<script setup lang="ts">
import type { ProductItem } from '~/data/products/catalog';

const props = defineProps<{
    open: boolean;
    cartItemCount: number;
    selectedProduct: ProductItem | null;
    artworkPreviewUrl: string;
    cartArtworkName: string;
    selectedSizeLabel: string;
    selectedQty: number;
    total: number;
    featuredOpen: boolean;
    featuredItems: ProductItem[];
    getProductName: (product: ProductItem) => string;
    formatPrice: (value: number) => string;
    featuredStartPrice: () => string;
}>();

const emit = defineEmits<{
    close: [];
    'close-featured': [];
}>();

const { t } = useI18n();
</script>

<template>
    <Teleport to="body">
        <Transition name="cart-preview-slide">
            <div v-if="props.open" class="cart-preview-shell" @click.self="emit('close')" data-testid="product-category-cart-overlay">
                <aside class="cart-preview-panel" role="dialog" aria-modal="true" data-testid="product-category-cart-dialog">
                    <header class="cart-preview-header" data-testid="product-category-cart-header">
                        <h3 class="cart-preview-title" data-testid="product-category-cart-title">{{ t('checkout.cart.previewTitle', { count: props.cartItemCount }) }}</h3>
                        <UiButton
                            type="button"
                            variant="ghost"
                            tone="neutral"
                            class="cart-preview-continue"
                            @click="emit('close')"
                            data-testid="product-category-cart-continue-shopping"
                        >
                            {{ t('checkout.cart.continueShopping') }}
                            <UiIcon name="strong-arrow-right" :size="18" color="#2a2f3d" />
                        </UiButton>
                    </header>

                    <div class="cart-preview-body" data-testid="product-category-cart-body">
                        <article v-if="props.selectedProduct" class="cart-preview-item" data-testid="product-category-cart-item">
                            <div class="cart-preview-item-main" data-testid="product-category-cart-item-main">
                                <div class="cart-preview-item-thumb">
                                    <img
                                        v-if="props.artworkPreviewUrl"
                                        :src="props.artworkPreviewUrl"
                                        :alt="
                                            props.cartArtworkName ||
                                            props.getProductName(props.selectedProduct)
                                        " class="cart-preview-image" />
                                    <img
                                        v-else
                                        :src="props.selectedProduct.image"
                                        :alt="props.getProductName(props.selectedProduct)" class="cart-preview-image" />
                                </div>
                                <div class="cart-preview-item-copy" data-testid="product-category-cart-item-copy">
                                    <h4 class="cart-preview-section-title" data-testid="product-category-cart-item-name">
                                        {{ props.getProductName(props.selectedProduct) }}
                                        <UiIcon name="light-info-circle" :size="14" color="#6d7180" />
                                    </h4>
                                    <p class="cart-preview-meta" data-testid="product-category-cart-item-size">{{ t('checkout.cart.size') }}: {{ props.selectedSizeLabel }}</p>
                                    <p class="cart-preview-meta" data-testid="product-category-cart-item-quantity">
                                        {{ t('checkout.cart.quantity') }}:
                                        {{ props.selectedQty.toLocaleString() }}
                                    </p>
                                </div>
                            </div>
                            <div class="cart-preview-item-side" data-testid="product-category-cart-item-side">
                                <strong class="cart-preview-item-price" data-testid="product-category-cart-item-price">
                                    {{ props.formatPrice(props.total) }}
                                </strong>
                                <div class="cart-preview-item-actions" data-testid="product-category-cart-item-actions">
                                    <UiButton type="button" variant="ghost" tone="neutral" size="sm" icon-only class="cart-item-icon-btn" data-testid="product-category-cart-item-edit">
                                        <UiIcon name="strong-edit" :size="16" color="#2a2f3d" />
                                    </UiButton>
                                    <UiButton type="button" variant="ghost" tone="neutral" size="sm" icon-only class="cart-item-icon-btn" data-testid="product-category-cart-item-delete">
                                        <UiIcon name="strong-trash" :size="16" color="#2a2f3d" />
                                    </UiButton>
                                </div>
                            </div>
                        </article>

                        <section v-if="props.featuredOpen" class="cart-featured" data-testid="product-category-cart-featured">
                            <div class="cart-featured-head" data-testid="product-category-cart-featured-head">
                                <h4 class="cart-preview-section-title" data-testid="product-category-cart-featured-title">{{ t('checkout.cart.featuredItems') }}</h4>
                                <UiButton
                                    type="button"
                                    variant="ghost"
                                    tone="neutral"
                                    size="sm"
                                    icon-only
                                    class="cart-featured-close"
                                    @click="emit('close-featured')"
                                    data-testid="product-category-cart-featured-close"
                                >
                                    <UiIcon name="strong-times" :size="16" color="#2a2f3d" />
                                </UiButton>
                            </div>
                            <div class="cart-featured-grid" data-testid="product-category-cart-featured-list">
                                <article
                                    v-for="item in props.featuredItems"
                                    :key="item.id"
                                    class="cart-featured-card"
                                    :data-testid="`product-category-cart-featured-item-${item.id}`"
                                >
                                    <div class="cart-featured-media">
                                        <img :src="item.image" :alt="props.getProductName(item)" class="cart-preview-image" />
                                    </div>
                                    <div class="cart-featured-content">
                                        <h5 class="cart-featured-item-title">{{ props.getProductName(item) }}</h5>
                                        <p class="cart-featured-price">
                                            <span class="cart-preview-label">{{ t('checkout.cart.startsAt') }}</span>
                                            <strong class="cart-preview-value">{{ props.featuredStartPrice() }}</strong>
                                        </p>
                                        <UiButton type="button" variant="subtle" tone="neutral" class="cart-featured-customize-btn">
                                            {{ t('checkout.cart.customize') }}
                                        </UiButton>
                                    </div>
                                </article>
                            </div>
                        </section>
                    </div>

                    <footer class="cart-preview-footer" data-testid="product-category-cart-footer">
                        <p class="cart-preview-total" data-testid="product-category-cart-total-row">
                            <span class="cart-preview-label">{{ t('checkout.cart.total') }}</span>
                            <strong class="cart-preview-value">{{ props.formatPrice(props.total) }}</strong>
                        </p>
                        <div class="cart-preview-note-row" data-testid="product-category-cart-note-row">
                            <p class="cart-preview-note-label">Note:</p>
                            <p class="cart-preview-note">{{ t('checkout.cart.note') }}</p>
                        </div>
                        <div class="cart-preview-actions" data-testid="product-category-cart-actions">
                            <UiButton type="button" variant="outline" tone="neutral" size="md" height="48px" class="cart-preview-view-btn" data-testid="product-category-cart-view-button">
                                {{ t('checkout.cart.viewCart') }}
                            </UiButton>
                            <UiButton type="button" variant="filled" tone="neutral" size="md" height="48px" class="cart-preview-checkout-btn" data-testid="product-category-cart-checkout-button">
                                <UiIcon name="strong-paper-plane" :size="16" color="#ffffff" />
                                {{ t('checkout.cart.proceedToCheckout') }}
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
        width: min(568px, 100vw);
        max-width: 100vw;
        background: var(--contrast-light);
        border-left: 1px solid var(--gray-30);
        box-shadow: -20px 0 42px rgba(7, 14, 26, 0.16);
        height: 100dvh;
        display: grid;
        grid-template-rows: auto 1fr auto;
    }

    .cart-preview-header {
        min-height: 84px;
        border-bottom: 1px solid var(--gray-30);
        padding: 0 22px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .cart-preview-title {
            margin: 0;
            font-size: 34px;
            line-height: 1.1;
            color: var(--text-primary);
        }

        .cart-preview-continue {
            color: var(--text-primary);
            display: inline-flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            line-height: 24px;
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
        overflow: auto;
        padding: 20px 22px 16px;

        .cart-preview-item {
            padding: 0 0 16px;
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 12px;
            border-bottom: 1px solid var(--gray-30);
        }

        .cart-preview-item-main {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            min-width: 0;
        }

        .cart-preview-item-thumb {
            width: 64px;
            height: 64px;
            border-radius: 10px;
            background: var(--gray-10);
            overflow: hidden;
            flex-shrink: 0;

            .cart-preview-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .cart-preview-item-copy {
            .cart-preview-section-title {
                margin: 0 0 4px;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                font-size: 14px;
                line-height: 1.3;
                color: var(--text-primary);
            }

            .cart-preview-meta {
                margin: 0;
                font-size: 14px;
                line-height: 1.5;
                color: var(--text-secondary);
            }
        }

        .cart-preview-item-side {
            display: grid;
            justify-items: end;
            gap: 8px;
        }

        .cart-preview-item-price {
            font-size: 38px;
            line-height: 1;
            color: var(--text-primary);
            white-space: nowrap;
        }

        .cart-preview-item-actions {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .cart-item-icon-btn {
            width: 24px;
            height: 24px;
            min-width: 24px;
            border-radius: 6px;
            padding: 0;
            --btn-soft: transparent;
        }

        .cart-featured {
            margin-top: auto;
            padding-top: 18px;
            border-top: 1px solid var(--gray-30);
        }

        .cart-featured-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;

            .cart-preview-section-title {
                margin: 0;
                font-size: 28px;
                line-height: 1.15;
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
            gap: 10px;
            overflow-x: auto;
            padding-bottom: 8px;
            scrollbar-width: thin;

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
            min-width: 178px;
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
                margin: 0;
                font-size: 16px;
                line-height: 1.35;
                color: var(--text-primary);
            }

            .cart-featured-customize-btn {
                width: calc(100% - 4px);
                margin: 0 auto;
                height: 38px;
                border-radius: 8px;
                background: var(--gray-20);
                color: var(--text-primary);
                font-size: 14px;
                font-weight: 600;
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
            padding: 10px 12px;
        }

        .cart-featured-content {
            padding: 12px 12px 10px;
            display: grid;
            gap: 8px;
        }

        .cart-featured-price {
            margin: 0;
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 8px;

            .cart-preview-label {
                font-size: 14px;
                color: var(--text-secondary);
            }

            .cart-preview-value {
                font-size: 32px;
                line-height: 1;
                color: var(--text-primary);
            }
        }
    }

    .cart-preview-footer {
        border-top: 1px solid var(--gray-30);
        padding: 14px 22px 20px;

        .cart-preview-total {
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 2px;

            .cart-preview-label {
                font-size: 32px;
                line-height: 1.2;
                color: var(--text-primary);
            }

            .cart-preview-value {
                font-size: 46px;
                line-height: 1;
                color: var(--text-primary);
            }
        }

        .cart-preview-note-row {
            margin-top: 4px;
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: start;
            column-gap: 10px;
        }

        .cart-preview-note-label {
            margin: 0;
            font-size: 14px;
            line-height: 1.5;
            color: var(--text-secondary);
        }

        .cart-preview-note {
            margin: 0;
            font-size: 14px;
            line-height: 1.5;
            color: var(--text-secondary);
        }

        .cart-preview-actions {
            margin-top: 12px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
        }

        .cart-preview-view-btn {
            width: 120px;
            border-radius: 16px;
            border: 1px solid var(--gray-60);
            background: var(--contrast-light);
            color: var(--text-primary);
            font-size: 16px;
            font-weight: 600;
            box-shadow: none;
            transition: background-color 0.18s ease;

            &:hover {
                background: var(--gray-20);
            }
        }

        .cart-preview-checkout-btn {
            width: 286px;
            border-radius: 16px;
            background: var(--gray-100);
            color: #ffffff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-size: 16px;
            font-weight: 600;
            transition: filter 0.18s ease;

            &:hover {
                filter: brightness(1.05);
            }
        }
    }
}

.cart-preview-slide-enter-active,
.cart-preview-slide-leave-active {
    transition: opacity 0.6s cubic-bezier(0.65, 0, 0.35, 1);
}

.cart-preview-slide-enter-from,
.cart-preview-slide-leave-to {
    opacity: 0;

    .cart-preview-panel {
        transform: translateX(100%);
    }
}

.cart-preview-slide-enter-active,
.cart-preview-slide-leave-active {
    .cart-preview-panel {
        transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
    }
}

@media (max-width: 820px) {
    .cart-preview-shell {
        .cart-preview-header {
            .cart-preview-title {
                font-size: 28px;
            }
        }

        .cart-preview-body {
            .cart-preview-item-price {
                font-size: 30px;
            }
        }

        .cart-preview-footer {
            .cart-preview-total {
                .cart-preview-label {
                    font-size: 28px;
                }

                .cart-preview-value {
                    font-size: 40px;
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
