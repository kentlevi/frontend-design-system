<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import lottie from 'lottie-web';
import { useCartPage } from '~/composables/cart/page/useCartPage';
import DeleteConfirmModal from '~/components/ui/DeleteConfirmModal.vue';
import CartItemDetailsModal from '~/components/cart/CartItemDetailsModal.vue';
import CartItemEditModal from '~/components/cart/CartItemEditModal.vue';
import CartEmptyState from '~/components/cart/CartEmptyState.vue';
import { formatProductFileSize, readProductArtworkAsDataUrl } from '~/helpers/products/productCategory.helper';

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
	removeByIds,
	goToCheckout,
	format_price,
	size_dim_only,
} = useCartPage();

const delete_target_ids = ref<string[]>([]);
const delete_modal_open = computed(() => delete_target_ids.value.length > 0);
const is_bulk_delete = computed(() => delete_target_ids.value.length > 1);
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

function showCartItemUpdatedToast() {
	toast_store.showToastWithTimer({
		message: t('cart.cartPage.itemUpdated'),
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

function openDeleteModal(ids: string[]) {
	delete_target_ids.value = [...ids];
}

function closeDeleteModal() {
	delete_target_ids.value = [];
}

function confirmDeleteItems() {
	if (!delete_target_ids.value.length) return;
	removeByIds(delete_target_ids.value);
	delete_target_ids.value = [];
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
	const matched = size_dim_only(row.customSizeLabel || row.sizeLabel).match(/(\d+)\s*(?:x|Ã—)\s*(\d+)/i);
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
	updateItemArtworkDetails(detail_item_id.value, payload);
	detail_item_id.value = null;
	clearPendingArtworkDraft();
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
			<header v-if="rows.length > 0" class="cart-page-head">
				<h1 class="cart-page-title">{{ t('cart.cartPage.title') }}</h1>
				<NuxtLink :to="continue_shopping_path" class="cart-page-continue">
					<UiIcon name="strong-long-arrow-right" :size="24" color="var(--text-primary)" />
					{{ t('cart.cartPage.continueShopping') }}
				</NuxtLink>
			</header>

			<section v-if="rows.length > 0" class="cart-page-layout">
				<section class="cart-list" data-testid="cart-page-list">
					<div class="cart-list-controls">
						<UiCheckbox
							class="cart-check-row"
							:model-value="all_selected"
							box-class="cart-check-row-box"
							icon-class="cart-check-row-icon"
							@update:model-value="all_selected = $event"
						>
							{{ t('cart.cartPage.selectAll', { count: rows.length }) }}
						</UiCheckbox>
						<UiButton
							class="cart-remove-btn"
							variant="outline"
							tone="default"
							size="md"
							label-class="cart-remove-btn-label"
							:disabled="selected_ids.length === 0"
							@click="openDeleteModal(selected_ids)"
						>
							<UiIcon name="regular-trash" :size="24" color="var(--text-primary)" />
							{{ t('cart.cartPage.remove') }}
						</UiButton>
					</div>

					<div class="cart-list-head">
						<span class="cart-list-head-label">{{ t('cart.cartPage.headers.item') }}</span>
						<span class="cart-list-head-label">{{ t('cart.cartPage.headers.quantity') }}</span>
						<span class="cart-list-head-label">{{ t('cart.cartPage.headers.price') }}</span>
						<span class="cart-list-head-spacer" />
					</div>

					<article
						v-for="row in rows"
						:key="row.id"
						class="cart-row"
						data-testid="cart-page-row"
					>
						<UiCheckbox
							class="cart-check-row cart-check-row--item"
							:model-value="selected_ids.includes(row.id)"
							box-class="cart-check-row-box"
							icon-class="cart-check-row-icon"
							@update:model-value="toggleRowSelection(row.id, $event)"
						/>

						<div class="cart-item">
							<button
								type="button"
								class="cart-item-thumb"
								:class="{ 'cart-item-thumb--interactive': Boolean(row.artworkPreviewUrl) }"
								:disabled="!row.artworkPreviewUrl"
								@click="row.artworkPreviewUrl ? openItemDetails(row.id) : undefined"
							>
								<img
									:src="row.artworkPreviewUrl || row.product.image"
									:alt="row.product.name"
									class="cart-item-thumb-image"
								>
								<span
									v-if="row.artworkPreviewUrl"
									class="cart-item-thumb-overlay"
									aria-hidden="true"
								>
									<UiIcon name="regular-info-circle" :size="24" color="#ffffff" />
								</span>
							</button>
							<div class="cart-item-copy">
								<h3 class="cart-item-title">{{ row.product.name }}</h3>
								<p class="cart-item-size">{{ t('cart.cartPage.sizeLabel', { size: size_dim_only(row.sizeLabel) }) }}</p>
								<UiButton class="cart-link-btn" variant="ghost" tone="default" size="24" @click="openArtworkPicker(row.id)">
									{{ getArtworkActionLabel(Boolean(row.artworkPreviewUrl)) }}
								</UiButton>
							</div>
						</div>

						<div class="cart-qty-wrap">
							<UiButton class="cart-link-btn" variant="ghost" tone="default" size="24" @click="openEditSize(row.id)">
								{{ t('cart.cartPage.editSize') }}
							</UiButton>
							<UiSelect
								v-if="custom_qty_item_id !== row.id"
								class="cart-qty-select-control"
								:model-value="getRowDisplayQty(row.id, row.qty)"
								:options="getQtyOptionsForRow(getRowDisplayQty(row.id, row.qty))"
								icon-family="regular"
								:icon-size="24"
								trigger-class="cart-qty-select-trigger"
								@update:model-value="handleQtyOptionSelect(row.id, $event)"
							/>
							<div
								v-else
								ref="custom_qty_dropdown_ref"
								class="cart-qty-select-shell ui-select"
								:data-open="custom_qty_menu_open || null"
							>
								<input
									ref="custom_qty_input_ref"
									:value="custom_qty_draft"
									type="text"
									inputmode="numeric"
									placeholder="Enter quantity"
									class="cart-qty-inline-input"
									@beforeinput="preventNonDigitInput"
									@input="onCustomQtyInput(($event.target as HTMLInputElement).value)"
									@blur="void commitCustomQty(row.id)"
									@keydown.enter.prevent="void commitCustomQty(row.id)"
								>
								<button
									type="button"
									class="cart-qty-select-arrow"
									aria-label="Open quantity options"
									@click="toggleCustomQtyMenu"
								>
									<UiIcon
										name="regular-angle-down"
										:size="24"
										color="var(--gray-90)"
										:class="{ 'is-open': custom_qty_menu_open }"
									/>
								</button>
								<Transition name="ui-select-menu">
									<div v-if="custom_qty_menu_open" class="ui-select-menu" role="listbox">
										<div class="ui-select-options">
											<button
												v-for="option in qty_select_options_with_custom"
												:key="option.value"
												type="button"
												class="ui-select-option"
												:class="{ 'is-selected': Number(option.value) === -1 }"
												@mousedown.prevent="handleQtyOptionSelect(row.id, option.value)"
											>
												<div class="ui-select-option-copy">
													<p class="ui-select-option-label">{{ option.label }}</p>
												</div>
											</button>
										</div>
									</div>
								</Transition>
							</div>
						</div>

						<strong class="cart-row-price">{{ format_price(getRowDisplayTotal(row.id, row.total)) }}</strong>

						<UiButton
							class="cart-delete-btn"
							variant="ghost"
							tone="default"
							size="sm"
							icon-only
							icon="regular-trash"
							icon-size="24"
							:sr-label="t('cart.cartPage.removeItemSr')"
							@click="openDeleteModal([row.id])"
						/>
					</article>
				</section>

				<aside class="cart-summary-column" data-testid="cart-page-summary">
					<section class="cart-summary-card">
						<header class="cart-summary-header">
							<h2 class="cart-summary-title">{{ t('cart.cartPage.orderSummary') }}</h2>
						</header>
						<div class="cart-summary-body">
							<div class="cart-summary-line">
								<span class="cart-summary-total-label">{{ t('cart.cartPage.total') }}</span>
								<strong class="cart-summary-total-value">{{ format_price(display_selected_total) }}</strong>
							</div>
							<div class="cart-summary-actions">
								<UiButton
									type="button"
									variant="filled"
									tone="neutral"
									size="md"
									class="cart-checkout-btn"
									:disabled="checkout_disabled"
									@click="goToCheckout"
								>
									{{ t('cart.cartPage.proceedCheckout', { count: selected_rows.length }) }}
								</UiButton>
								<p class="cart-summary-note">
									{{ t('cart.cartPage.note') }}
								</p>
							</div>
						</div>
					</section>

					<section class="cart-payment-section">
						<p class="cart-payment-label">{{ t('cart.cartPage.availablePaymentOptions') }}</p>
						<div class="cart-payment-grid">
							<span
								v-for="option in payment_options"
								:key="option.key"
								class="cart-payment-chip"
							>
								<img
									:src="option.icon"
									:alt="option.label"
									class="cart-payment-chip-icon"
									loading="lazy"
								>
							</span>
						</div>
					</section>
				</aside>
			</section>
			<CartEmptyState
				v-else
				:featured-items="featured_empty_items"
				:discover-items="discover_empty_items"
			/>
		</section>
		<DeleteConfirmModal
			:model-value="delete_modal_open"
			:title="is_bulk_delete ? t('cart.cartPage.removeAllTitle') : t('cart.cartPage.deleteItemTitle')"
			:description="is_bulk_delete
				? t('cart.cartPage.removeAllDescription')
				: t('cart.cartPage.deleteItemDescription')"
			:confirm-label="is_bulk_delete ? t('cart.cartPage.removeAllConfirm') : t('cart.cartPage.removeConfirm')"
			test-id="cart-page-delete-modal"
			@update:model-value="!$event ? closeDeleteModal() : undefined"
			@cancel="closeDeleteModal"
			@confirm="confirmDeleteItems"
		/>
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

        .cart-page-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 56px 0 20px;
            border-bottom: 1px solid var(--gray-30);

            .cart-page-title {

                font-size: var(--type-size-500);
                line-height: var(--type-line-500);
                color: var(--text-primary);
            }

            .cart-page-continue {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                color: var(--text-primary);
                text-decoration: none;
                font-size: var(--type-size-200);
                font-weight: var(--font-weight-semibold);
                line-height: var(--type-line-200);
            }
        }

        .cart-page-layout {
            margin-top: 26px;
            display: grid;
            grid-template-columns: minmax(0, 1fr) 282px;
            gap: 34px;

            .cart-list {
                .cart-list-controls {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 18px;

                    .cart-check-row {
                        display: inline-flex;
                        align-items: center;
                        gap: 10px;
                        color: var(--text-primary);
                        font-size: var(--type-size-100);
                        line-height: var(--type-line-100);

                        .cart-check-row-box {
                            width: 20px;
                            height: 20px;
                            border-radius: 5px;
                            border-color: var(--text-primary);
                            background: var(--contrast-light);
                        }

                        .cart-check-row-icon {
                            width: 16px;
                            height: 16px;
                            display: block;
                        }
                    }

                    .cart-remove-btn {
                        min-width: 118px;
                        height: 40px;
                        border-radius: 16px;
                        border: 1px solid var(--gray-50);
                        color: var(--abyss-base);
                        padding: 8px 24px;
                        font-size: var(--type-size-100);
                        line-height: var(--type-line-100);
                        font-weight: var(--font-weight-medium);
                        cursor: pointer;
                        transition: background-color 0.16s ease, border-color 0.16s ease,
                            opacity 0.16s ease;

                        .cart-remove-btn-label {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                        }

                        &:hover:not(:disabled) {
                            background: var(--gray-20);
                        }

                        &:disabled {
                            opacity: 0.45;
                            cursor: not-allowed;
                        }
                    }
                }

                .cart-list-head {
                    display: grid;
                    grid-template-columns: 1fr 176px 118px 40px;
                    gap: 14px;
                    border-bottom: 1px solid var(--gray-30);
                    padding-bottom: 10px;
                    color: var(--text-primary);
                    font-size: var(--type-size-100);
                    font-weight: var(--font-weight-medium);
                    line-height: var(--type-line-100);

                    .cart-list-head-label,
                    .cart-list-head-spacer {
                        display: block;
                    }
                }

				.cart-item-thumb {
					position: relative;
					width: 124px;
					height: 124px;
					border: 0;
					padding: 0;
					background: var(--gray-10);
					border-radius: 12px;
					overflow: hidden;
					flex-shrink: 0;

					&:disabled {
						cursor: default;
					}

					&.cart-item-thumb--interactive {
						cursor: pointer;

						.cart-item-thumb-overlay {
							opacity: 0;
							transition: opacity 0.18s ease;
						}

						&:hover .cart-item-thumb-overlay,
						&:focus-visible .cart-item-thumb-overlay {
							opacity: 1;
						}
					}

					.cart-item-thumb-image {
						width: 100%;
						height: 100%;
						object-fit: contain;
						display: block;
					}

					.cart-item-thumb-overlay {
						position: absolute;
						inset: 0;
						display: grid;
						place-items: center;
						background: rgba(38, 41, 51, 0.56);
					}
				}

                .cart-row {
                    display: grid;
                    grid-template-columns: 24px 1fr 256px 118px 40px;
                    gap: 14px;
                    align-items: center;
                    padding: 20px 0;
                    border-bottom: 1px solid var(--gray-30);

                    .cart-check-row {
                        &.cart-check-row--item {
                            justify-self: start;
                        }
                    }

                    .cart-item {
                        display: flex;
                        align-items: center;
                        gap: 16px;

                        .cart-link-btn {
                            border: 0;
                            background: transparent;
                            color: var(--gold-60);
                            padding: 0;
                            font-size: var(--type-size-100);
                            line-height: var(--type-line-100);
                            font-weight: var(--font-weight-semibold);
                            cursor: pointer;
                        }

                        .cart-item-thumb {
                            width: 96px;
                            height: 96px;
                            border-radius: 10px;
                            background: var(--gray-20);
                            display: grid;
                            place-items: center;
                            overflow: hidden;

                            .cart-item-thumb-image {
                                width: 72px;
                                height: 72px;
                                object-fit: contain;
                            }
                        }

                            .cart-item-copy {
                            .cart-item-title {

                                font-size: var(--type-size-100);
                                line-height: var(--type-line-100);
                                color: var(--text-primary);
                            }

                            .cart-item-size {

                                font-size: var(--type-size-100);
                                line-height: var(--type-line-100);
                                color: var(--text-secondary);
                            }

                        }
                    }

                    .cart-qty-wrap {
                        display: flex;
                        align-items: center;
                        gap: 32px;

						.cart-qty-select-control {
							width: 176px;
							min-width: 129px;
						}

						.cart-qty-select-trigger {
                            height: 40px;
                            border-radius: 8px;
                            border: 1px solid var(--gray-40);
                            background: var(--contrast-light);
                            padding: 8px 16px;
							box-shadow: none;
						}

						.cart-qty-select-shell {
							position: relative;
							width: 176px;
							min-width: 129px;
							display: grid;
							grid-template-columns: minmax(0, 1fr) auto;
							align-items: center;
							min-height: 40px;
							border-radius: 8px;
							border: 1px solid var(--gray-40);
							background: var(--contrast-light);
							padding: 8px 16px;

							.ui-select-menu {
								top: calc(100% + 8px);
								left: 0;
								right: 0;
							}
						}

						.cart-qty-inline-input {
							width: 100%;
							min-width: 0;
							border: 0;
							outline: 0;
							background: transparent;
							font-size: var(--type-size-100);
							line-height: var(--type-line-100);
							color: var(--text-primary);

							&::placeholder {
								color: var(--text-muted);
							}
						}

						.cart-qty-select-arrow {
							border: 0;
							outline: 0;
							background: transparent;
							display: grid;
							place-items: center;
							padding: 0;
							cursor: pointer;

							.ui-icon {
								transition: transform 160ms ease;
							}

							.ui-icon.is-open {
								transform: rotate(180deg);
							}
						}
                    }

                    .cart-row-price {
                        font-size: var(--type-size-300);
                        line-height: var(--type-line-300);
                        color: var(--text-primary);
                    }

                    .cart-delete-btn {
                        color: var(--abyss-base);
                        border: 0;
                        background: transparent;
                        width: 30px;
                        height: 30px;
                        display: grid;
                        place-items: center;
                        cursor: pointer;
                    }
                }
            }

            .cart-summary-column {
                align-self: start;
                max-width: 282px;
                display: flex;
                flex-direction: column;
                gap: 24px;

                .cart-summary-card {
                    border: 1px solid var(--gray-30);
                    border-radius: 16px;
                    background: var(--bg-page);

                    .cart-summary-header {
                        padding: 16px 24px;
                        border-bottom: 1px solid var(--gray-30);

                        .cart-summary-title {

                            font-size: var(--type-size-200);
                            font-weight: var(--font-weight-bold);
                            line-height: var(--type-line-200);
                            color: var(--text-primary);
                        }
                    }

                    .cart-summary-body {
                        padding: 16px 24px;
                        display: flex;
                        flex-direction: column;
                        gap: 16px;

                        .cart-summary-line {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            color: var(--text-primary);

                            .cart-summary-total-label {
                                font-size: var(--type-size-100);
                                font-weight: var(--font-weight-semibold);
                                line-height: var(--type-line-100);
                            }

                            .cart-summary-total-value {
                                font-size: var(--type-size-400);
                                line-height: var(--type-line-400);
                                font-weight: var(--font-weight-bold);
                            }
                        }

                        .cart-summary-actions {
                            display: flex;
                            flex-direction: column;
                            gap: 10px;
                            align-items: center;

                            .cart-checkout-btn {
                                width: 100%;
                                height: 48px;
                                border-radius: 16px;
                                font-size: var(--type-size-200);
                                font-weight: var(--font-weight-medium);
                                line-height: var(--type-line-200);
                                box-shadow: none;
                            }

                            .cart-summary-note {

                                color: var(--text-secondary);
                                font-size: var(--type-size-100);
                                line-height: var(--type-line-100);
                            }
                        }
                    }
                }

                .cart-payment-section {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;

                    .cart-payment-label {

                        color: var(--text-primary);
                        font-size: var(--type-size-100);
                        font-weight: var(--font-weight-regular);
                        line-height: var(--type-line-100);
                    }

                    .cart-payment-grid {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 8px;
                        flex-wrap: nowrap;

                        .cart-payment-chip {
                            flex: 1 1 0;
                            min-width: 0;
                            height: 40px;
                            width: 50px;
                            border: 1px solid var(--gray-40);
                            border-radius: 8px;
                            display: grid;
                            place-items: center;
                            background: var(--contrast-light);
                            box-sizing: border-box;

                            .cart-payment-chip-icon {
                                object-fit: contain;
                                display: block;
                            }
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 1200px) {
        .cart-page-shell {
            .cart-page-head {
                .cart-page-title {
                    font-size: var(--type-size-550);
                    line-height: var(--type-line-550);
                }

                .cart-page-continue {
                    font-size: var(--type-size-200);
                    line-height: var(--type-line-200);
                }
            }

            .cart-page-layout {
                .cart-list {
                    .cart-row {
                        .cart-row-price {
                            font-size: var(--type-size-500);
                            line-height: var(--type-line-500);
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 980px) {
        .cart-page-shell {
            .cart-page-layout {
                grid-template-columns: 1fr;

                .cart-list {
                    .cart-row {
                        grid-template-columns: 24px 1fr;

                        .cart-qty-wrap,
                        .cart-row-price,
                        .cart-delete-btn {
                            grid-column: 2 / 3;
                        }

                        .cart-row-price {
                            margin-top: 6px;
                        }
                    }
                }
            }
        }
    }
}
</style>