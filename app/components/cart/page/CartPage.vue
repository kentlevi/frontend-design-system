<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import lottie from 'lottie-web';
import { useCartPage } from '~/composables/cart/page/useCartPage';
import { formatProductFileSize, readProductArtworkAsDataUrl } from '~/helpers/products/productCategory.helper';
import CartItemDetailsModal from '~/components/cart/modals/CartItemDetailsModal.vue';
import CartItemEditModal from '~/components/cart/modals/CartItemEditModal.vue';
import CartEmptyState from './CartEmptyState.vue';
import CartPageHeader from './CartPageHeader.vue';
import CartPageList from './CartPageList.vue';
import CartPageSummary from './CartPageSummary.vue';

const { t } = useI18n();
const toast_store = useToastStore();

const {
	rows,
	selected_ids,
	all_selected,
	selected_rows,
	featured_empty_items,
	discover_empty_items,
	size_option_models,
	qty_select_options,
	payment_options,
	continue_shopping_path,
	toggleRowSelection,
	updateQty,
	updateSize,
	updateItemArtworkDetails,
	goToCheckout,
	format_price,
	size_dim_only,
} = useCartPage();

const detail_item_id = ref<string | null>(null);
const edit_size_item_id = ref<string | null>(null);
const edit_size_draft_key = ref('');
const edit_size_draft_custom_width = ref('');
const edit_size_draft_custom_height = ref('');
const saving_page_update = ref(false);
const page_loader_ref = ref<HTMLElement | null>(null);
const custom_qty_item_id = ref<string | null>(null);
const custom_qty_draft = ref('');
const custom_qty_dropdown_ref = ref<HTMLElement | null>(null);
const custom_qty_input_ref = ref<HTMLInputElement | null>(null);
const custom_qty_menu_open = ref(false);
const pending_qty_display_item_id = ref<string | null>(null);
const pending_qty_display_value = ref<number | null>(null);
const artwork_action_file_input_ref = ref<HTMLInputElement | null>(null);
const pending_artwork_action_item_id = ref<string | null>(null);
const pending_artwork_draft_item_id = ref<string | null>(null);
const pending_artwork_draft_name = ref('');
const pending_artwork_draft_size_label = ref('');
const pending_artwork_draft_preview_url = ref('');
const CART_EDIT_SAVE_DELAY_MS = 900;
const CART_CUSTOM_QTY_IDLE_MS = 1000;
let page_loader_animation: ReturnType<typeof lottie.loadAnimation> | null = null;
let custom_qty_save_timeout: ReturnType<typeof setTimeout> | null = null;

const detail_item = computed(() => {
	const row = rows.value.find((current_row) => current_row.id === detail_item_id.value) || null;
	if (!row) return null;
	if (pending_artwork_draft_item_id.value !== row.id) return row;

	return {
		...row,
		artworkName: pending_artwork_draft_name.value,
		artworkSizeLabel: pending_artwork_draft_size_label.value,
		artworkPreviewUrl: pending_artwork_draft_preview_url.value,
	};
});

const edit_size_item = computed(() =>
	rows.value.find((current_row) => current_row.id === edit_size_item_id.value) || null
);

const edit_size_options = computed(() => [
	...size_option_models.value.map((size) => ({
		label: `${size.name} ${size.dim}`.trim().replace(/(\d+)\D+(\d+)/, '$1x$2mm'),
		value: size.key,
	})),
	{
		label: t('cart.cartPreview.editModal.customSize'),
		value: 'custom',
	},
]);

const qty_select_options_with_custom = computed(() => [
	...qty_select_options.value,
	{
		label: t('cart.cartPreview.editModal.customQuantity'),
		value: -1,
	},
]);

const has_pending_custom_qty = computed(() => custom_qty_item_id.value !== null);
const display_selected_total = computed(() =>
	selected_rows.value.reduce((sum, row) => sum + getRowDisplayTotal(row.id, row.total), 0)
);
const checkout_disabled = computed(() =>
	selected_rows.value.length === 0 || has_pending_custom_qty.value || saving_page_update.value
);

function bindCustomQtyDropdownRef(
	element: Element | ComponentPublicInstance | null,
	_refs?: Record<string, unknown>,
) {
	custom_qty_dropdown_ref.value = element instanceof HTMLElement ? element : null;
}

function bindCustomQtyInputRef(
	element: Element | ComponentPublicInstance | null,
	_refs?: Record<string, unknown>,
) {
	custom_qty_input_ref.value = element instanceof HTMLInputElement ? element : null;
}

function showCartItemUpdatedToast() {
	toast_store.showToastWithTimer({
		message: t('cart.cartPage.itemUpdated'),
		tone: 'primary',
		dismissible: true,
		variant: 'default',
	}, 3000);
}

function showArtworkUploadSuccessToast() {
	toast_store.showToastWithTimer({
		message: t('cart.cartPage.artworkUploadSuccess'),
		tone: 'primary',
		dismissible: true,
		variant: 'default',
	}, 3000);
}

function showArtworkRemovedSuccessToast() {
	toast_store.showToastWithTimer({
		message: t('cart.cartPage.artworkRemovedSuccess'),
		tone: 'primary',
		dismissible: true,
		variant: 'default',
	}, 3000);
}

function getArtworkActionLabel(has_artwork: boolean) {
	return has_artwork
		? t('cart.cartPage.replaceArtwork')
		: t('checkout.orderDetails.uploadArtwork');
}

function closeCustomQtyMenu() {
	custom_qty_menu_open.value = false;
}

function clearCustomQtySaveTimeout() {
	if (!custom_qty_save_timeout) return;
	clearTimeout(custom_qty_save_timeout);
	custom_qty_save_timeout = null;
}

function destroyPageLoaderAnimation() {
	if (!page_loader_animation) return;
	page_loader_animation.destroy();
	page_loader_animation = null;
}

async function mountPageLoaderAnimation() {
	if (typeof window === 'undefined' || !page_loader_ref.value) return;

	destroyPageLoaderAnimation();
	const response = await fetch('/animations/musticker-loader.json');
	if (!response.ok) return;

	const animation_data = await response.json();
	page_loader_animation = lottie.loadAnimation({
		container: page_loader_ref.value,
		renderer: 'svg',
		loop: true,
		autoplay: true,
		animationData: animation_data,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid meet',
		},
	});
}

function closeCustomQtyMode() {
	custom_qty_item_id.value = null;
	custom_qty_draft.value = '';
	closeCustomQtyMenu();
	clearCustomQtySaveTimeout();
}

function clearPendingQtyDisplay() {
	pending_qty_display_item_id.value = null;
	pending_qty_display_value.value = null;
}

function openCustomQtyMode(item_id: string) {
	const row = rows.value.find((current_row) => current_row.id === item_id);
	if (!row) return;

	custom_qty_item_id.value = item_id;
	custom_qty_draft.value = '';
	custom_qty_menu_open.value = false;
	clearCustomQtySaveTimeout();
	nextTick(() => {
		custom_qty_input_ref.value?.focus();
	});
}

async function commitQtySelection(item_id: string, next_qty: number) {
	if (saving_page_update.value) return;

	saving_page_update.value = true;
	pending_qty_display_item_id.value = item_id;
	pending_qty_display_value.value = next_qty;
	closeCustomQtyMode();
	await nextTick();
	await mountPageLoaderAnimation();
	await new Promise((resolve) => setTimeout(resolve, CART_EDIT_SAVE_DELAY_MS));
	updateQty(item_id, next_qty);
	saving_page_update.value = false;
	destroyPageLoaderAnimation();
	clearPendingQtyDisplay();
	showCartItemUpdatedToast();
}

function handleQtyOptionSelect(item_id: string, value: string | number) {
	const normalized = Number(value);
	if (normalized === -1) {
		openCustomQtyMode(item_id);
		return;
	}

	void commitQtySelection(item_id, normalized);
}

function onCustomQtyInput(value: string) {
	const digits = value.replace(/[^0-9]/g, '');
	custom_qty_draft.value = digits ? Number(digits).toLocaleString() : '';
	scheduleCustomQtySave();
}

function getDraftCustomQty() {
	const next_qty = Number(custom_qty_draft.value.replace(/,/g, ''));
	return Number.isFinite(next_qty) && next_qty > 0 ? next_qty : null;
}

function getQtyOptionsForRow(qty: number) {
	const has_preset = qty_select_options.value.some((option) => Number(option.value) === qty);
	if (has_preset || qty <= 0) {
		return qty_select_options_with_custom.value;
	}

	return [
		...qty_select_options.value,
		{
			label: Number(qty).toLocaleString(),
			value: qty,
		},
		{
			label: t('cart.cartPreview.editModal.customQuantity'),
			value: -1,
		},
	];
}

function getRowDisplayQty(item_id: string, qty: number) {
	if (pending_qty_display_item_id.value === item_id && pending_qty_display_value.value) {
		return pending_qty_display_value.value;
	}

	return qty;
}

function getRowDisplayTotal(item_id: string, total: number) {
	return custom_qty_item_id.value === item_id ? 0 : total;
}

async function commitCustomQty(item_id: string) {
	const next_qty = getDraftCustomQty();
	if (!next_qty) return;
	await commitQtySelection(item_id, next_qty);
}

function toggleCustomQtyMenu() {
	custom_qty_menu_open.value = !custom_qty_menu_open.value;
}

function scheduleCustomQtySave() {
	const item_id = custom_qty_item_id.value;
	if (!item_id) return;

	clearCustomQtySaveTimeout();
	custom_qty_save_timeout = setTimeout(() => {
		void commitCustomQty(item_id);
	}, CART_CUSTOM_QTY_IDLE_MS);
}

function handlePointerDown(event: PointerEvent) {
	const target = event.target as Node | null;
	if (!target) return;
	if (custom_qty_dropdown_ref.value?.contains(target)) return;
	closeCustomQtyMode();
}

function handleEscape(event: KeyboardEvent) {
	if (event.key !== 'Escape') return;
	closeCustomQtyMode();
}

function preventNonDigitInput(event: InputEvent) {
	if (!event.data) return;
	if (/^\d+$/.test(event.data)) return;
	event.preventDefault();
}

const cart_store = useCartStore();

function openDeleteModal(ids: string[]) {
	cart_store.setForDeleteItems(ids);
}

function openItemDetails(item_id: string) {
	clearPendingArtworkDraft();
	detail_item_id.value = item_id;
}

function openEditSize(item_id: string) {
	const row = rows.value.find((current_row) => current_row.id === item_id);
	if (!row) return;

	edit_size_item_id.value = item_id;
	edit_size_draft_key.value = size_option_models.value.some((size) => size.key === row.sizeKey) ? row.sizeKey : 'custom';
	const matched = size_dim_only(row.customSizeLabel || row.sizeLabel).match(/(\d+)\s*(?:x|\u00d7)\s*(\d+)/i);
	edit_size_draft_custom_width.value = matched?.[1] ?? '';
	edit_size_draft_custom_height.value = matched?.[2] ?? '';
}

function closeEditSize() {
	edit_size_item_id.value = null;
	edit_size_draft_key.value = '';
	edit_size_draft_custom_width.value = '';
	edit_size_draft_custom_height.value = '';
}

async function saveEditSize() {
	if (!edit_size_item_id.value) return;
	const is_custom_size = edit_size_draft_key.value === 'custom';
	const width = Number(edit_size_draft_custom_width.value);
	const height = Number(edit_size_draft_custom_height.value);
	const item_id = edit_size_item_id.value;
	const size_key = edit_size_draft_key.value;

	if (!size_key) return;
	if (is_custom_size && (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0)) return;

	saving_page_update.value = true;
	closeEditSize();
	await nextTick();
	await mountPageLoaderAnimation();
	await new Promise((resolve) => setTimeout(resolve, CART_EDIT_SAVE_DELAY_MS));

	updateSize(
		item_id,
		size_key,
		is_custom_size ? `${width}x${height}mm` : ''
	);
	saving_page_update.value = false;
	destroyPageLoaderAnimation();
	showCartItemUpdatedToast();
}

function closeItemDetails() {
	detail_item_id.value = null;
	clearPendingArtworkDraft();
}

function saveItemDetails(payload: { artworkName: string; artworkSizeLabel: string; artworkPreviewUrl: string; specialInstructions: string }) {
	if (!detail_item_id.value) return;
	const has_artwork = Boolean(payload.artworkName || payload.artworkPreviewUrl);
	updateItemArtworkDetails(detail_item_id.value, payload);
	detail_item_id.value = null;
	clearPendingArtworkDraft();
	if (has_artwork) {
		showArtworkUploadSuccessToast();
		return;
	}
	showArtworkRemovedSuccessToast();
}

function clearPendingArtworkDraft() {
	pending_artwork_action_item_id.value = null;
	pending_artwork_draft_item_id.value = null;
	pending_artwork_draft_name.value = '';
	pending_artwork_draft_size_label.value = '';
	pending_artwork_draft_preview_url.value = '';
	if (artwork_action_file_input_ref.value) {
		artwork_action_file_input_ref.value.value = '';
	}
}

function openArtworkPicker(item_id: string) {
	pending_artwork_action_item_id.value = item_id;
	artwork_action_file_input_ref.value?.click();
}

async function onArtworkActionSelected(event: Event) {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	const item_id = pending_artwork_action_item_id.value;
	if (!file || !item_id) return;

	pending_artwork_draft_item_id.value = item_id;
	pending_artwork_draft_name.value = file.name;
	pending_artwork_draft_size_label.value = formatProductFileSize(file.size);
	pending_artwork_draft_preview_url.value = file.type.startsWith('image/')
		? await readProductArtworkAsDataUrl(file)
		: '';
	detail_item_id.value = item_id;
	pending_artwork_action_item_id.value = null;
}

onMounted(() => {
	window.addEventListener('pointerdown', handlePointerDown, true);
	window.addEventListener('keydown', handleEscape);
});

onBeforeUnmount(() => {
	window.removeEventListener('pointerdown', handlePointerDown, true);
	window.removeEventListener('keydown', handleEscape);
	clearCustomQtySaveTimeout();
	destroyPageLoaderAnimation();
});
</script>

<template>
	<main class="cart-page" data-testid="cart-page">
		<UiLoadingOverlay
			:visible="saving_page_update"
			:label="t('cart.cartPage.savingChanges')"
			test-id="cart-page-edit-size-saving-overlay"
			transition-name="cart-redirect-fade"
			position="fixed"
			:z-index="120"
		>
			<div ref="page_loader_ref" aria-hidden="true" />
		</UiLoadingOverlay>

		<input
			ref="artwork_action_file_input_ref"
			type="file"
			class="cart-item-artwork-action-input"
			accept=".eps,.ai,.psd,.pdf,.tif,.tiff,.png,.jpg,.jpeg"
			@change="onArtworkActionSelected"
		>

		<section class="cart-page-shell">
			<CartPageHeader
				v-if="rows.length > 0"
				:title="t('cart.cartPage.title')"
				:continue-shopping-path="continue_shopping_path"
				:continue-shopping-label="t('cart.cartPage.continueShopping')"
			/>

			<section v-if="rows.length > 0" class="cart-page-layout">
				<CartPageList
					:rows="rows"
					:all-selected="all_selected"
					:selected-ids="selected_ids"
					:custom-qty-item-id="custom_qty_item_id"
					:custom-qty-draft="custom_qty_draft"
					:custom-qty-menu-open="custom_qty_menu_open"
					:qty-select-options-with-custom="qty_select_options_with_custom"
					:bind-custom-qty-dropdown-ref="bindCustomQtyDropdownRef"
					:bind-custom-qty-input-ref="bindCustomQtyInputRef"
					:get-row-display-qty="getRowDisplayQty"
					:get-qty-options-for-row="getQtyOptionsForRow"
					:get-artwork-action-label="getArtworkActionLabel"
					:size-dim-only="size_dim_only"
					:format-price="format_price"
					:get-row-display-total="getRowDisplayTotal"
					@update:all-selected="all_selected = $event"
					@open-delete-modal="openDeleteModal"
					@toggle-row-selection="toggleRowSelection($event.itemId, $event.checked)"
					@open-item-details="openItemDetails"
					@open-artwork-picker="openArtworkPicker"
					@open-edit-size="openEditSize"
					@select-qty-option="handleQtyOptionSelect($event.itemId, $event.value)"
					@custom-qty-input="onCustomQtyInput"
					@commit-custom-qty="void commitCustomQty($event)"
					@toggle-custom-qty-menu="toggleCustomQtyMenu"
					@prevent-non-digit-input="preventNonDigitInput"
				/>

				<CartPageSummary
					:order-summary-label="t('cart.cartPage.orderSummary')"
					:total-label="t('cart.cartPage.total')"
					:total-value="format_price(display_selected_total)"
					:checkout-label="t('cart.cartPage.proceedCheckout', { count: selected_rows.length })"
					:note="t('cart.cartPage.note')"
					:payment-label="t('cart.cartPage.availablePaymentOptions')"
					:payment-options="payment_options"
					:checkout-disabled="checkout_disabled"
					@checkout="goToCheckout"
				/>
			</section>

			<CartEmptyState
				v-else
				:featured-items="featured_empty_items"
				:discover-items="discover_empty_items"
			/>
		</section>

		<CartDeleteItemModal />

		<CartItemDetailsModal
			:model-value="Boolean(detail_item_id)"
			:item="detail_item"
			@update:model-value="!$event ? closeItemDetails() : undefined"
			@cancel="closeItemDetails"
			@save="saveItemDetails"
		/>

		<CartItemEditModal
			:model-value="Boolean(edit_size_item_id)"
			:item="edit_size_item"
			:size-options="edit_size_options"
			:quantity-options="qty_select_options"
			:show-quantity="false"
			:size-key="edit_size_draft_key"
			:custom-size-width="edit_size_draft_custom_width"
			:custom-size-height="edit_size_draft_custom_height"
			:qty="edit_size_item?.qty || 1"
			:custom-qty="''"
			@update:model-value="!$event ? closeEditSize() : undefined"
			@update:size-key="edit_size_draft_key = $event"
			@update:custom-size-width="edit_size_draft_custom_width = $event"
			@update:custom-size-height="edit_size_draft_custom_height = $event"
			@cancel="closeEditSize"
			@save="saveEditSize"
		/>
	</main>
</template>

<style scoped lang="scss">
.cart-page {
	min-height: calc(100dvh - 120px);
	background: var(--bg-page);

	.cart-item-artwork-action-input {
		display: none;
	}

	.cart-page-shell {
		max-width: 1200px;
		margin: 0 auto;
	}

	.cart-page-layout {
		margin-top: 26px;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 282px;
		gap: 34px;
	}
}

@media (max-width: 980px) {
	.cart-page {
		.cart-page-layout {
			grid-template-columns: 1fr;
		}
	}
}
</style>