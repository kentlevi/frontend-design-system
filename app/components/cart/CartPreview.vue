<script setup lang="ts">
import { toRef } from 'vue';
import { useCartPreview } from '~/composables/cart/preview/useCartPreview';
import { sizeDimOnly } from '~/utils/cart';
import type { ProductItem } from '~/types/products/catalog';
import type {
	CartPreviewItem,
	CartPreviewSizeOptionModel,
} from '~/types/cart/preview';

const props = withDefaults(
	defineProps<{
		open: boolean;
		cartItemCount: number;
		cartItems: CartPreviewItem[];
		sizeOptionModels?: CartPreviewSizeOptionModel[];
		quantityOptions?: readonly number[];
		grandTotal: number;
		featuredOpen: boolean;
		featuredItems: ProductItem[];
		getProductName: (product: ProductItem) => string;
		formatPrice: (value: number) => string;
		featuredStartPrice: (product: ProductItem) => string;
	}>(),
	{
		sizeOptionModels: () => [],
		quantityOptions: () => [],
	}
);

const emit = defineEmits<{
	close: [];
	'close-featured': [];
	'update-item': [payload: { itemId: string; sizeKey: string; qty: number }];
	'remove-item': [itemId: string];
}>();

const { t } = useI18n();
const {
	editingItemId,
	draftSizeKey,
	draftQty,
	redirectingToCart,
	redirectLoaderRef,
	openInlineEdit,
	cancelInlineEdit,
	saveInlineEdit,
	editedItemTotal,
	editedGrandTotal,
	getInlineSizeOptions,
	getInlineQtyOptions,
	goToCart,
	goToCheckout,
	customizeFeaturedProduct,
} = useCartPreview({
	cartItems: toRef(props, 'cartItems'),
	sizeOptionModels: toRef(props, 'sizeOptionModels'),
	quantityOptions: toRef(props, 'quantityOptions'),
	grandTotal: toRef(props, 'grandTotal'),
	closePreview: () => emit('close'),
	emitUpdateItem: (payload) => emit('update-item', payload),
});
</script>

<template>
	<Teleport to="body">
		<Transition name="cart-preview-slide">
			<div v-if="props.open" class="cart-preview-shell" data-testid="product-category-cart-overlay" @click.self="emit('close')">
				<UiLoadingOverlay
					:visible="redirectingToCart"
					:label="t('cart.cartPreview.redirectingToCart')"
					test-id="product-category-cart-redirect-loading"
					transition-name="cart-redirect-fade"
					position="absolute"
					:z-index="2"
				>
					<div ref="redirectLoaderRef" aria-hidden="true" />
				</UiLoadingOverlay>
				<aside class="cart-preview-panel" role="dialog" aria-modal="true" data-testid="product-category-cart-dialog">
					<header class="cart-preview-header" data-testid="product-category-cart-header">
						<h3 class="cart-preview-title" data-testid="product-category-cart-title">{{ t('cart.cartPreview.previewTitle', { count: props.cartItemCount }) }}</h3>
						<UiButton
							type="button"
							variant="ghost"
							tone="neutral"
							class="cart-preview-continue"
							data-testid="product-category-cart-continue-shopping-button"
							@click="emit('close')"
						>
							{{ t('cart.cartPreview.continueShopping') }}
							<UiIcon name="strong-long-arrow-right" :size="18" color="#2a2f3d" />
						</UiButton>
					</header>

					<div
						class="cart-preview-body"
						:class="{ 'cart-preview-body--empty': props.cartItemCount === 0 }"
						data-testid="product-category-cart-body"
					>
						<section v-if="props.cartItemCount === 0" class="cart-preview-empty" data-testid="product-category-cart-empty">
							<img
								src="/illustrations/cart/empty-cart-basket.svg"
								:alt="t('cart.cartPreview.emptyIconAlt')"
								width="112"
								height="112"
								class="cart-preview-empty-image"
							>
							<h4 class="cart-preview-empty-title">{{ t('cart.cartPreview.emptyTitle') }}</h4>
							<p class="cart-preview-empty-description">{{ t('cart.cartPreview.emptyDescription') }}</p>
						</section>

						<section
							v-if="props.cartItemCount > 0"
							class="cart-preview-items-scroll"
							data-testid="product-category-cart-items-scroll"
						>
							<section
								class="cart-preview-items"
								data-testid="product-category-cart-items"
							>
								<article
									v-for="item in props.cartItems"
									:key="item.id"
									class="cart-preview-item"
									data-testid="product-category-cart-item"
								>
									<div class="cart-preview-item-main" data-testid="product-category-cart-item-main">
										<div class="cart-preview-item-thumb">
											<img
												:src="item.artworkPreviewUrl || item.product.image"
												:alt="props.getProductName(item.product)" class="cart-preview-image" >
										</div>
										<div class="cart-preview-item-copy" data-testid="product-category-cart-item-copy">
											<h4 class="cart-preview-section-title" data-testid="product-category-cart-item-name">
												{{ props.getProductName(item.product) }}
												<UiIcon name="regular-info-circle" :size="20" color="#6d7180" />
											</h4>
											<template v-if="editingItemId === item.id">
												<div class="cart-preview-inline-edit" data-testid="product-category-cart-item-inline-edit">
													<p class="cart-preview-meta" data-testid="product-category-cart-item-size">
														{{ t('cart.cartPreview.size') }}:
														<UiSelect
															:model-value="draftSizeKey"
															class="cart-inline-select"
															trigger-class="cart-inline-select-trigger"
															:options="getInlineSizeOptions(item)"
															data-testid="product-category-cart-item-size-select"
															@update:model-value="draftSizeKey = String($event)"
														/>
													</p>
													<p class="cart-preview-meta" data-testid="product-category-cart-item-quantity">
														{{ t('cart.cartPreview.quantity') }}:
														<UiSelect
															:model-value="draftQty"
															class="cart-inline-select"
															trigger-class="cart-inline-select-trigger"
															:options="getInlineQtyOptions(item)"
															data-testid="product-category-cart-item-qty-select"
															@update:model-value="draftQty = Number($event)"
														/>
													</p>
												</div>
											</template>
											<template v-else>
												<p class="cart-preview-meta" data-testid="product-category-cart-item-size">{{ t('cart.cartPreview.size') }}: {{ sizeDimOnly(item.sizeLabel) }}</p>
												<p class="cart-preview-meta" data-testid="product-category-cart-item-quantity">
													{{ t('cart.cartPreview.quantity') }}:
													{{ item.qty.toLocaleString() }}
												</p>
											</template>
										</div>
									</div>
									<div class="cart-preview-item-side" data-testid="product-category-cart-item-side">
										<strong class="cart-preview-item-price" data-testid="product-category-cart-item-price">
											{{ props.formatPrice(editedItemTotal(item)) }}
										</strong>
										<div
											v-if="editingItemId === item.id"
											class="cart-preview-item-actions"
											data-testid="product-category-cart-item-actions"
										>
											<UiButton
												variant="ghost"
												tone="neutral"
												size="sm"
												class="cart-item-icon-btn"
												icon-only
												icon="strong-save"
												:icon-size="24"
												:sr-label="t('cart.cartPreview.aria.saveItemChanges')"
												data-testid="product-category-cart-item-save-button"
												@click="saveInlineEdit(item.id)"
											/>
											<UiButton
												variant="ghost"
												tone="neutral"
												size="sm"
												class="cart-item-icon-btn"
												icon-only
												icon="strong-times"
												:icon-size="24"
												:sr-label="t('cart.cartPreview.aria.cancelItemChanges')"
												data-testid="product-category-cart-item-cancel-button"
												@click="cancelInlineEdit"
											/>
										</div>
										<div
											v-else
											class="cart-preview-item-actions"
											data-testid="product-category-cart-item-actions"
										>
											<UiButton
												variant="ghost"
												tone="neutral"
												size="sm"
												class="cart-item-icon-btn"
												icon-only
												icon="strong-edit"
												:icon-size="24"
												:sr-label="t('cart.cartPreview.aria.editItem')"
												data-testid="product-category-cart-item-edit-button"
												@click="openInlineEdit(item)"
											/>
											<UiButton
												variant="ghost"
												tone="neutral"
												size="sm"
												class="cart-item-icon-btn"
												icon-only
												icon="strong-trash"
												:icon-size="24"
												:sr-label="t('cart.cartPreview.aria.removeItem')"
												data-testid="product-category-cart-item-delete-button"
												@click="emit('remove-item', item.id)"
											/>
										</div>
									</div>
								</article>
							</section>
						</section>

						<section
							v-if="props.featuredOpen"
							class="cart-featured"
							:class="{ 'cart-featured--with-item': props.cartItemCount > 0 }"
							data-testid="product-category-cart-featured"
						>
							<div class="cart-featured-head" data-testid="product-category-cart-featured-head">
								<h4 class="cart-preview-section-title" data-testid="product-category-cart-featured-title">{{ t('cart.cartPreview.featuredItems') }}</h4>
								<UiButton
									type="button"
									variant="ghost"
									tone="neutral"
									size="sm"
									icon-only
									icon="strong-times"
									icon-size="md"
									:sr-label="t('cart.cartPreview.closeFeaturedItems')"
									class="cart-featured-close"
									data-testid="product-category-cart-featured-close-button"
									@click="emit('close-featured')"
								/>
							</div>
							<div class="cart-featured-grid" data-testid="product-category-cart-featured-list">
								<article
									v-for="item in props.featuredItems"
									:key="item.id"
									class="cart-featured-card"
									:data-testid="`product-category-cart-featured-item-${item.id}`"
								>
									<div class="cart-featured-media">
										<img :src="item.image" :alt="props.getProductName(item)" class="cart-preview-image" >
									</div>
									<div class="cart-featured-content">
										<h5 class="cart-featured-item-title">{{ props.getProductName(item) }}</h5>
										<p class="cart-featured-price">
											<span class="cart-preview-label">{{ t('cart.cartPreview.startsAt') }}</span>
											<strong class="cart-preview-value">{{ props.featuredStartPrice(item) }}</strong>
										</p>
										<UiButton
											type="button"
											variant="subtle"
											tone="neutral"
											class="cart-featured-customize-btn"
											@click="customizeFeaturedProduct(item.id)"
										>
											{{ t('cart.cartPreview.customize') }}
										</UiButton>
									</div>
								</article>
							</div>
						</section>
					</div>

					<footer v-if="props.cartItemCount > 0" class="cart-preview-footer" data-testid="product-category-cart-footer">
						<div class="cart-preview-summary" data-testid="product-category-cart-summary">
							<p class="cart-preview-total" data-testid="product-category-cart-total-row">
								<span class="cart-preview-label">{{ t('cart.cartPreview.total') }}</span>
								<strong class="cart-preview-value">{{ props.formatPrice(editedGrandTotal()) }}</strong>
							</p>
							<div class="cart-preview-note-row" data-testid="product-category-cart-note-row">
								<p class="cart-preview-note-label">{{ t('cart.cartPreview.noteLabel') }}</p>
								<p class="cart-preview-note">{{ t('cart.cartPreview.note') }}</p>
							</div>
						</div>
						<div class="cart-preview-actions" data-testid="product-category-cart-actions">
							<UiButton
								type="button"
								variant="outline"
								tone="neutral"
								size="md"
								height="48px"
								class="cart-preview-view-btn"
								:disabled="redirectingToCart"
								data-testid="product-category-cart-view-button"
								@click="goToCart"
							>
								{{ t('cart.cartPreview.viewCart') }}
							</UiButton>
							<UiButton type="button" variant="filled" tone="neutral" size="md" height="48px" class="cart-preview-checkout-btn" data-testid="product-category-cart-checkout-button" @click="goToCheckout">
								<UiIcon name="regular-paper-plane" :size="16" color="#ffffff" />
								{{ t('cart.cartPreview.proceedToCheckout') }}
							</UiButton>
						</div>
					</footer>
				</aside>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
.cart-preview-shell {
    position: fixed;
    inset: 0;
    background: transparent;
    z-index: 230;
    display: flex;
    align-items: stretch;
    justify-content: flex-end;

    .cart-preview-panel {
        width: min(540px, 100vw);
        max-width: 100vw;
        background: var(--contrast-light);
        border-left: 1px solid var(--gray-30);
        box-shadow: -20px 0 42px rgba(7, 14, 26, 0.16);
        height: 100dvh;
        display: grid;
        grid-template-rows: auto 1fr auto;
        overflow-x: hidden;
    }

    .cart-preview-header {
        min-height: 84px;
        border-bottom: 1px solid var(--gray-30);
        padding: 0 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .cart-preview-title {

            font-size: var(--type-size-300);
            line-height: var(--type-line-300);
            color: var(--text-primary);
        }

        .cart-preview-continue {
            color: var(--text-primary);
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: var(--type-size-100);
            font-weight: var(--font-weight-semibold);
            line-height: var(--type-line-100);
            padding: 6px 0;
            min-height: auto;
            border-radius: 0;
            --btn-soft: transparent;
            transition: opacity 0.18s ease;

            &:hover {
                opacity: 0.7;
            }
        }
    }

    .cart-preview-body {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        overflow-x: hidden;
        padding: 0;
        min-height: 0;

        .cart-preview-items-scroll {
            min-height: 0;
            overflow: auto;
            height: 100%;
        }

        .cart-preview-items {
            display: grid;
            gap: 16px;
            padding: 24px;
        }

        .cart-preview-item {
            padding: 0 0 16px;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
            border-bottom: 1px solid var(--gray-30);
            min-height: 106px;
        }

        .cart-preview-item-main {
            display: flex;
            align-items: flex-start;
            gap: 16px;
            min-width: 0;
        }

        .cart-preview-item-thumb {
            width: 72px;
            height: 72px;
            border-radius: 10px;
            background: var(--gray-10);
            overflow: hidden;
            flex-shrink: 0;

            .cart-preview-image {
                padding: 12px;
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }

        .cart-preview-item-copy {
            min-width: 0;
            flex: 1;
            min-height: 72px;

            .cart-preview-section-title {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                color: var(--text-primary);
            }

            .cart-preview-meta {

                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                color: var(--text-secondary);
                min-height: 24px;
                display: flex;
                align-items: center;
            }

            .cart-preview-inline-edit {
                margin-top: 0;
                display: grid;
                gap: 0;
                max-width: 320px;

                .cart-inline-select {
                    min-width: 132px;
                }

                .cart-inline-select-trigger {
                    height: 24px;
                    padding-right: 8px;
                    padding-bottom: 1px;
                    border-radius: 8px;
                    background: var(--contrast-light);
                    color: var(--text-primary);
                    vertical-align: middle;
                    box-shadow: none;
                }
            }
        }

        .cart-preview-item-side {
            display: grid;
            justify-items: end;
            gap: 8px;
            min-width: 118px;
            align-self: stretch;
            align-content: start;
        }

        .cart-preview-item-price {
            font-size: var(--type-size-300);
            line-height: var(--type-line-300);
            color: var(--text-primary);
            white-space: nowrap;
        }

        .cart-preview-item-actions {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 16px;
            width: 100%;
            min-height: 32px;
        }

        .cart-item-icon-btn {
            width: 32px;
            height: 32px;
            min-width: 32px;
            border-radius: 6px;
            padding: 0;
            box-shadow: none;
            --btn-soft: transparent;
            --btn-border: transparent;

            &:hover {
                background: var(--gray-20);
            }
        }

        .cart-featured {
            margin-top: 16px;
            padding: 16px 24px;
            border-top: 1px solid var(--gray-30);
            min-width: 0;
        }

        .cart-featured--with-item {
            margin-top: auto;
        }

        .cart-preview-empty {
            display: grid;
            justify-items: center;
            text-align: center;
            row-gap: 10px;
            padding: 18px 14px 20px;
            border-bottom: 0;

            .cart-preview-empty-image {
                width: 112px;
                height: 112px;
                object-fit: contain;
                display: block;
            }

            .cart-preview-empty-title {

                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                color: var(--text-primary);
            }

            .cart-preview-empty-description {

                max-width: 420px;
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                color: var(--text-secondary);
            }
        }

        &.cart-preview-body--empty {
            display: grid;
            grid-template-rows: minmax(0, 1fr) auto;
            align-items: stretch;
            padding-top: 0;
            overflow: hidden;

            .cart-preview-empty {
                height: 100%;
                align-content: center;
                max-width: 100%;
                margin: 0 auto;
                padding: 24px 14px;
            }

            .cart-featured {
                margin-top: 0;
                min-height: 0;
            }
        }

        .cart-featured-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;

            .cart-preview-section-title {

                font-size: var(--type-size-200);
                line-height: var(--type-line-200);
                color: var(--text-primary);
            }
        }

        .cart-featured-close {
            width: 26px;
            height: 26px;
            min-width: 26px;
            border-radius: 6px;
            padding: 0;
            --btn-soft: transparent;
        }

        .cart-featured-grid {
            display: flex;
            flex-wrap: nowrap;
            gap: 10px;
            overflow-x: auto;
            overflow-y: hidden;
            padding-bottom: 12px;
            scrollbar-width: thin;
            width: 100%;
            max-width: 100%;
            min-width: 0;

            &::-webkit-scrollbar {
                height: 6px;
            }

            &::-webkit-scrollbar-track {
                background: transparent;
            }

            &::-webkit-scrollbar-thumb {
                background: var(--gray-50);
                border-radius: 999px;
            }
        }

        .cart-featured-card {
            min-width: 184px;
            flex: 0 0 184px;
            border: 1px solid var(--gray-30);
            border-radius: 10px;
            background: var(--contrast-light);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: transform 0.2s ease, border-color 0.2s ease;

            &:hover {
                border-color: var(--gray-50);
            }

            .cart-preview-image {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            .cart-featured-item-title {

                font-size: var(--type-size-100);
                font-weight: var(--font-weight-medium);
                line-height: var(--type-line-100);
                color: var(--text-primary);
            }

            .cart-featured-customize-btn {
                width: 100%;
                margin: 0 auto;
                height: 32px;
                border-radius: 8px;
                background: var(--gray-20);
                color: var(--text-primary);
                font-size: var(--type-size-100);
                font-weight: var(--font-weight-semibold);
                line-height: var(--type-line-100);
                box-shadow: none;
                transition: background-color 0.18s ease;

                &:hover {
                    background: var(--gray-30);
                }
            }
        }

        .cart-featured-media {
            height: 120px;
            background: var(--gray-10);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px 22px;
        }

        .cart-featured-content {
            padding: 16px;
            display: grid;
            gap: 8px;
        }

        .cart-featured-price {

            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 8px;

            .cart-preview-label {
                font-size: var(--type-size-100);
                line-height: var(--type-line-100);
                color: var(--text-secondary);
            }

            .cart-preview-value {
                font-size: var(--type-size-200);
                line-height: var(--type-line-200);
                color: var(--text-primary);
            }
        }
    }

    .cart-preview-footer {
        border-top: 1px solid var(--gray-30);
        padding: 24px;
        display: flex;
        flex-direction: column;
        gap: 16px;

        .cart-preview-total {

            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 2px;

            .cart-preview-label {
                font-size: var(--type-size-200);
                line-height: var(--type-line-200);
                color: var(--text-primary);
            }

            .cart-preview-value {
                font-size: var(--type-size-400);
                line-height: var(--type-line-400);
                color: var(--text-primary);
            }
        }

        .cart-preview-note-row {
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: start;
            column-gap: 10px;
        }

        .cart-preview-note-label {

            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            color: var(--text-secondary);
        }

        .cart-preview-note {

            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            color: var(--text-secondary);
            text-align: right;
        }

        .cart-preview-actions {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .cart-preview-view-btn {
            border-radius: 16px;
            border: 1px solid var(--gray-80);
            background: var(--contrast-light);
            color: var(--text-primary);
            font-size: var(--type-size-200);
            font-weight: var(--font-weight-semibold);
            line-height: var(--type-line-200);
            box-shadow: none;
            transition: background-color 0.18s ease;
            padding: 10px 16px;

            &:hover {
                background: var(--gray-20);
            }
        }

        .cart-preview-checkout-btn {
            border-radius: 16px;
            background: var(--gray-100);
            color: #ffffff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: var(--type-size-200);
            font-weight: var(--font-weight-semibold);
            line-height: var(--type-line-200);
            transition: filter 0.18s ease;
            padding: 10px 20px;

            &:hover {
                filter: brightness(1.05);
            }
        }
    }
}

@media (max-width: 820px) {
    .cart-preview-shell {
        .cart-preview-header {
            .cart-preview-title {
                font-size: var(--type-size-500);
                line-height: var(--type-line-500);
            }
        }

        .cart-preview-body {
            .cart-preview-item-price {
                font-size: var(--type-size-500);
                line-height: var(--type-line-500);
            }
        }

        .cart-preview-footer {
            .cart-preview-total {
                .cart-preview-label {
                    font-size: var(--type-size-500);
                    line-height: var(--type-line-500);
                }

                .cart-preview-value {
                    font-size: var(--type-size-550);
                    line-height: var(--type-line-550);
                }
            }

            .cart-preview-actions {
                display: grid;
                grid-template-columns: 1fr;
            }

            .cart-preview-view-btn,
            .cart-preview-checkout-btn {
                width: 100%;
            }
        }
    }
}
</style>

<style lang="scss">
.cart-preview-slide-enter-active,
.cart-preview-slide-leave-active {
    transition: opacity 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

.cart-preview-slide-enter-from,
.cart-preview-slide-leave-to {
    opacity: 0;
}

.cart-preview-slide-enter-from .cart-preview-panel,
.cart-preview-slide-leave-to .cart-preview-panel {
    transform: translateX(100%);
}

.cart-preview-slide-enter-active .cart-preview-panel,
.cart-preview-slide-leave-active .cart-preview-panel {
    transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

.cart-redirect-fade-enter-active,
.cart-redirect-fade-leave-active {
    transition: opacity 0.16s ease;
}

.cart-redirect-fade-enter-from,
.cart-redirect-fade-leave-to {
    opacity: 0;
}

</style>