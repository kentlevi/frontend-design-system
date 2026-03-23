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
	selectedIds,
	allSelected,
	selectedRows,
	featuredEmptyItems,
	discoverEmptyItems,
	sizeOptionModels,
	qtySelectOptions,
	paymentOptions,
	continueShoppingPath,
	toggleRowSelection,
	updateQty,
	updateSize,
	updateItemArtworkDetails,
	removeByIds,
	goToCheckout,
	formatPrice,
	sizeDimOnly,
} = useCartPage();

const deleteTargetIds = ref<string[]>([]);
const deleteModalOpen = computed(() => deleteTargetIds.value.length > 0);
const isBulkDelete = computed(() => deleteTargetIds.value.length > 1);
const detailItemId = ref<string | null>(null);
const editSizeItemId = ref<string | null>(null);
const editSizeDraftKey = ref('');
const editSizeDraftCustomWidth = ref('');
const editSizeDraftCustomHeight = ref('');
const savingPageUpdate = ref(false);
const pageLoaderRef = ref<HTMLElement | null>(null);
const customQtyItemId = ref<string | null>(null);
const customQtyDraft = ref('');
const customQtyDropdownRef = ref<HTMLElement | null>(null);
const customQtyInputRef = ref<HTMLInputElement | null>(null);
const customQtyMenuOpen = ref(false);
const pendingQtyDisplayItemId = ref<string | null>(null);
const pendingQtyDisplayValue = ref<number | null>(null);
const artworkActionFileInputRef = ref<HTMLInputElement | null>(null);
const pendingArtworkActionItemId = ref<string | null>(null);
const pendingArtworkDraftItemId = ref<string | null>(null);
const pendingArtworkDraftName = ref('');
const pendingArtworkDraftSizeLabel = ref('');
const pendingArtworkDraftPreviewUrl = ref('');
const CART_EDIT_SAVE_DELAY_MS = 900;
const CART_CUSTOM_QTY_IDLE_MS = 1000;
let pageLoaderAnimation: ReturnType<typeof lottie.loadAnimation> | null = null;
let customQtySaveTimeout: ReturnType<typeof setTimeout> | null = null;
const detailItem = computed(() => {
	const row = rows.value.find((currentRow) => currentRow.id === detailItemId.value) || null;
	if (!row) return null;
	if (pendingArtworkDraftItemId.value !== row.id) return row;

	return {
		...row,
		artworkName: pendingArtworkDraftName.value,
		artworkSizeLabel: pendingArtworkDraftSizeLabel.value,
		artworkPreviewUrl: pendingArtworkDraftPreviewUrl.value,
	};
});
const editSizeItem = computed(() =>
	rows.value.find((currentRow) => currentRow.id === editSizeItemId.value) || null
);
const editSizeOptions = computed(() => [
	...sizeOptionModels.value.map((size) => ({
		label: `${size.name} ${size.dim}`.trim().replace(/(\d+)\D+(\d+)/, '$1x$2mm'),
		value: size.key,
	})),
	{
		label: t('cart.cartPreview.editModal.customSize'),
		value: 'custom',
	},
]);
const qtySelectOptionsWithCustom = computed(() => [
	...qtySelectOptions.value,
	{
		label: t('cart.cartPreview.editModal.customQuantity'),
		value: -1,
	},
]);
const hasPendingCustomQty = computed(() => customQtyItemId.value !== null);
const displaySelectedTotal = computed(() =>
	selectedRows.value.reduce((sum, row) => sum + getRowDisplayTotal(row.id, row.total), 0)
);
const checkoutDisabled = computed(() =>
	selectedRows.value.length === 0 || hasPendingCustomQty.value || savingPageUpdate.value
);

function showCartItemUpdatedToast() {
	toast_store.showToastWithTimer({
		message: t('cart.cartPage.itemUpdated'),
		tone: 'primary',
		dismissible: true,
		variant: 'default',
	}, 3000);
}

function getArtworkActionLabel(hasArtwork: boolean) {
	return hasArtwork
		? t('cart.cartPage.replaceArtwork')
		: t('checkout.orderDetails.uploadArtwork');
}

function closeCustomQtyMenu() {
	customQtyMenuOpen.value = false;
}

function clearCustomQtySaveTimeout() {
	if (!customQtySaveTimeout) return;
	clearTimeout(customQtySaveTimeout);
	customQtySaveTimeout = null;
}

function destroyPageLoaderAnimation() {
	if (!pageLoaderAnimation) return;
	pageLoaderAnimation.destroy();
	pageLoaderAnimation = null;
}

async function mountPageLoaderAnimation() {
	if (typeof window === 'undefined' || !pageLoaderRef.value) return;

	destroyPageLoaderAnimation();
	const response = await fetch('/animations/musticker-loader.json');
	if (!response.ok) return;

	const animationData = await response.json();
	pageLoaderAnimation = lottie.loadAnimation({
		container: pageLoaderRef.value,
		renderer: 'svg',
		loop: true,
		autoplay: true,
		animationData,
		rendererSettings: {
			preserveAspectRatio: 'xMidYMid meet',
		},
	});
}

function closeCustomQtyMode() {
	customQtyItemId.value = null;
	customQtyDraft.value = '';
	closeCustomQtyMenu();
	clearCustomQtySaveTimeout();
}

function clearPendingQtyDisplay() {
	pendingQtyDisplayItemId.value = null;
	pendingQtyDisplayValue.value = null;
}

function openCustomQtyMode(itemId: string) {
	const row = rows.value.find((currentRow) => currentRow.id === itemId);
	if (!row) return;

	customQtyItemId.value = itemId;
	customQtyDraft.value = '';
	customQtyMenuOpen.value = false;
	clearCustomQtySaveTimeout();
	nextTick(() => {
		customQtyInputRef.value?.focus();
	});
}

async function commitQtySelection(itemId: string, nextQty: number) {
	if (savingPageUpdate.value) return;

	savingPageUpdate.value = true;
	pendingQtyDisplayItemId.value = itemId;
	pendingQtyDisplayValue.value = nextQty;
	closeCustomQtyMode();
	await nextTick();
	await mountPageLoaderAnimation();
	await new Promise((resolve) => setTimeout(resolve, CART_EDIT_SAVE_DELAY_MS));
	updateQty(itemId, nextQty);
	savingPageUpdate.value = false;
	destroyPageLoaderAnimation();
	clearPendingQtyDisplay();
	showCartItemUpdatedToast();
}

function handleQtyOptionSelect(itemId: string, value: string | number) {
	const normalized = Number(value);
	if (normalized === -1) {
		openCustomQtyMode(itemId);
		return;
	}

	void commitQtySelection(itemId, normalized);
}

function onCustomQtyInput(value: string) {
	const digits = value.replace(/[^0-9]/g, '');
	customQtyDraft.value = digits ? Number(digits).toLocaleString() : '';
	scheduleCustomQtySave();
}

function getDraftCustomQty() {
	const nextQty = Number(customQtyDraft.value.replace(/,/g, ''));
	return Number.isFinite(nextQty) && nextQty > 0 ? nextQty : null;
}

function getQtyOptionsForRow(qty: number) {
	const hasPreset = qtySelectOptions.value.some((option) => Number(option.value) === qty);
	if (hasPreset || qty <= 0) {
		return qtySelectOptionsWithCustom.value;
	}

	return [
		...qtySelectOptions.value,
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

function getRowDisplayQty(itemId: string, qty: number) {
	if (pendingQtyDisplayItemId.value === itemId && pendingQtyDisplayValue.value) {
		return pendingQtyDisplayValue.value;
	}

	return qty;
}

function getRowDisplayTotal(itemId: string, total: number) {
	return customQtyItemId.value === itemId ? 0 : total;
}

async function commitCustomQty(itemId: string) {
	const nextQty = getDraftCustomQty();
	if (!nextQty) return;
	await commitQtySelection(itemId, nextQty);
}

function toggleCustomQtyMenu() {
	customQtyMenuOpen.value = !customQtyMenuOpen.value;
}

function scheduleCustomQtySave() {
	const itemId = customQtyItemId.value;
	if (!itemId) return;

	clearCustomQtySaveTimeout();
	customQtySaveTimeout = setTimeout(() => {
		void commitCustomQty(itemId);
	}, CART_CUSTOM_QTY_IDLE_MS);
}

function handlePointerDown(event: PointerEvent) {
	const target = event.target as Node | null;
	if (!target) return;
	if (customQtyDropdownRef.value?.contains(target)) return;
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
	deleteTargetIds.value = [...ids];
}

function closeDeleteModal() {
	deleteTargetIds.value = [];
}

function confirmDeleteItems() {
	if (!deleteTargetIds.value.length) return;
	removeByIds(deleteTargetIds.value);
	deleteTargetIds.value = [];
}

function openItemDetails(itemId: string) {
	clearPendingArtworkDraft();
	detailItemId.value = itemId;
}

function openEditSize(itemId: string) {
	const row = rows.value.find((currentRow) => currentRow.id === itemId);
	if (!row) return;

	editSizeItemId.value = itemId;
	editSizeDraftKey.value = sizeOptionModels.value.some((size) => size.key === row.sizeKey) ? row.sizeKey : 'custom';
	const matched = sizeDimOnly(row.customSizeLabel || row.sizeLabel).match(/(\d+)\s*(?:x|×)\s*(\d+)/i);
	editSizeDraftCustomWidth.value = matched?.[1] ?? '';
	editSizeDraftCustomHeight.value = matched?.[2] ?? '';
}

function closeEditSize() {
	editSizeItemId.value = null;
	editSizeDraftKey.value = '';
	editSizeDraftCustomWidth.value = '';
	editSizeDraftCustomHeight.value = '';
}

async function saveEditSize() {
	if (!editSizeItemId.value) return;
	const isCustomSize = editSizeDraftKey.value === 'custom';
	const width = Number(editSizeDraftCustomWidth.value);
	const height = Number(editSizeDraftCustomHeight.value);
	const itemId = editSizeItemId.value;
	const sizeKey = editSizeDraftKey.value;

	if (!sizeKey) return;
	if (isCustomSize && (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0)) return;

	savingPageUpdate.value = true;
	closeEditSize();
	await nextTick();
	await mountPageLoaderAnimation();
	await new Promise((resolve) => setTimeout(resolve, CART_EDIT_SAVE_DELAY_MS));

	updateSize(
		itemId,
		sizeKey,
		isCustomSize ? `${width}x${height}mm` : ''
	);
	savingPageUpdate.value = false;
	destroyPageLoaderAnimation();
	showCartItemUpdatedToast();
}

function closeItemDetails() {
	detailItemId.value = null;
	clearPendingArtworkDraft();
}

function saveItemDetails(payload: { artworkName: string; artworkSizeLabel: string; artworkPreviewUrl: string; specialInstructions: string }) {
	if (!detailItemId.value) return;
	updateItemArtworkDetails(detailItemId.value, payload);
	detailItemId.value = null;
	clearPendingArtworkDraft();
}

function clearPendingArtworkDraft() {
	pendingArtworkActionItemId.value = null;
	pendingArtworkDraftItemId.value = null;
	pendingArtworkDraftName.value = '';
	pendingArtworkDraftSizeLabel.value = '';
	pendingArtworkDraftPreviewUrl.value = '';
	if (artworkActionFileInputRef.value) {
		artworkActionFileInputRef.value.value = '';
	}
}

function openArtworkPicker(itemId: string) {
	pendingArtworkActionItemId.value = itemId;
	artworkActionFileInputRef.value?.click();
}

async function onArtworkActionSelected(event: Event) {
	const target = event.target as HTMLInputElement;
	const file = target.files?.[0];
	const itemId = pendingArtworkActionItemId.value;
	if (!file || !itemId) return;

	pendingArtworkDraftItemId.value = itemId;
	pendingArtworkDraftName.value = file.name;
	pendingArtworkDraftSizeLabel.value = formatProductFileSize(file.size);
	pendingArtworkDraftPreviewUrl.value = file.type.startsWith('image/')
		? await readProductArtworkAsDataUrl(file)
		: '';
	detailItemId.value = itemId;
	pendingArtworkActionItemId.value = null;
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
			:visible="savingPageUpdate"
			:label="t('cart.cartPage.savingChanges')"
			test-id="cart-page-edit-size-saving-overlay"
			transition-name="cart-redirect-fade"
			position="fixed"
			:z-index="120"
		>
			<div ref="pageLoaderRef" aria-hidden="true" />
		</UiLoadingOverlay>
		<input
			ref="artworkActionFileInputRef"
			type="file"
			class="cart-item-artwork-action-input"
			accept=".eps,.ai,.psd,.pdf,.tif,.tiff,.png,.jpg,.jpeg"
			@change="onArtworkActionSelected"
		>
		<section class="cart-page-shell">
			<header v-if="rows.length > 0" class="cart-page-head">
				<h1 class="cart-page-title">{{ t('cart.cartPage.title') }}</h1>
				<NuxtLink :to="continueShoppingPath" class="cart-page-continue">
					<UiIcon name="strong-long-arrow-right" :size="24" color="var(--text-primary)" />
					{{ t('cart.cartPage.continueShopping') }}
				</NuxtLink>
			</header>

			<section v-if="rows.length > 0" class="cart-page-layout">
				<section class="cart-list" data-testid="cart-page-list">
					<div class="cart-list-controls">
						<UiCheckbox
							class="cart-check-row"
							:model-value="allSelected"
							box-class="cart-check-row-box"
							icon-class="cart-check-row-icon"
							@update:model-value="allSelected = $event"
						>
							{{ t('cart.cartPage.selectAll', { count: rows.length }) }}
						</UiCheckbox>
						<UiButton
							class="cart-remove-btn"
							variant="outline"
							tone="default"
							size="md"
							label-class="cart-remove-btn-label"
							:disabled="selectedIds.length === 0"
							@click="openDeleteModal(selectedIds)"
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
							:model-value="selectedIds.includes(row.id)"
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
								<p class="cart-item-size">{{ t('cart.cartPage.sizeLabel', { size: sizeDimOnly(row.sizeLabel) }) }}</p>
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
								v-if="customQtyItemId !== row.id"
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
								ref="customQtyDropdownRef"
								class="cart-qty-select-shell ui-select"
								:data-open="customQtyMenuOpen || null"
							>
								<input
									ref="customQtyInputRef"
									:value="customQtyDraft"
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
										:class="{ 'is-open': customQtyMenuOpen }"
									/>
								</button>
								<Transition name="ui-select-menu">
									<div v-if="customQtyMenuOpen" class="ui-select-menu" role="listbox">
										<div class="ui-select-options">
											<button
												v-for="option in qtySelectOptionsWithCustom"
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

						<strong class="cart-row-price">{{ formatPrice(getRowDisplayTotal(row.id, row.total)) }}</strong>

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
								<strong class="cart-summary-total-value">{{ formatPrice(displaySelectedTotal) }}</strong>
							</div>
							<div class="cart-summary-actions">
								<UiButton
									type="button"
									variant="filled"
									tone="neutral"
									size="md"
									class="cart-checkout-btn"
									:disabled="checkoutDisabled"
									@click="goToCheckout"
								>
									{{ t('cart.cartPage.proceedCheckout', { count: selectedRows.length }) }}
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
								v-for="option in paymentOptions"
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
				:featured-items="featuredEmptyItems"
				:discover-items="discoverEmptyItems"
			/>
		</section>
		<DeleteConfirmModal
			:model-value="deleteModalOpen"
			:title="isBulkDelete ? t('cart.cartPage.removeAllTitle') : t('cart.cartPage.deleteItemTitle')"
			:description="isBulkDelete
				? t('cart.cartPage.removeAllDescription')
				: t('cart.cartPage.deleteItemDescription')"
			:confirm-label="isBulkDelete ? t('cart.cartPage.removeAllConfirm') : t('cart.cartPage.removeConfirm')"
			test-id="cart-page-delete-modal"
			@update:model-value="!$event ? closeDeleteModal() : undefined"
			@cancel="closeDeleteModal"
			@confirm="confirmDeleteItems"
		/>
		<CartItemDetailsModal
			:model-value="Boolean(detailItemId)"
			:item="detailItem"
			@update:model-value="!$event ? closeItemDetails() : undefined"
			@cancel="closeItemDetails"
			@save="saveItemDetails"
		/>
		<CartItemEditModal
			:model-value="Boolean(editSizeItemId)"
			:item="editSizeItem"
			:size-options="editSizeOptions"
			:quantity-options="qtySelectOptions"
			:show-quantity="false"
			:size-key="editSizeDraftKey"
			:custom-size-width="editSizeDraftCustomWidth"
			:custom-size-height="editSizeDraftCustomHeight"
			:qty="editSizeItem?.qty || 1"
			:custom-qty="''"
			@update:model-value="!$event ? closeEditSize() : undefined"
			@update:size-key="editSizeDraftKey = $event"
			@update:custom-size-width="editSizeDraftCustomWidth = $event"
			@update:custom-size-height="editSizeDraftCustomHeight = $event"
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