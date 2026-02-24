<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { quantityOptions } from '~/data/products/categoryExperience';
import {
    productCatalog,
    type ProductCategoryKey,
    type ProductItem,
} from '~/data/products/catalog';

definePageMeta({
    layout: 'home',
});

type StoredCartState = {
    id: string;
    category: ProductCategoryKey;
    productId: string;
    sizeKey: string;
    qty: number;
    total: number;
    artworkName: string;
    artworkPreviewUrl?: string;
};

type CartRow = {
    id: string;
    category: ProductCategoryKey;
    product: ProductItem;
    sizeLabel: string;
    qty: number;
    total: number;
    artworkPreviewUrl: string;
};

const CART_STORAGE_KEY = 'musticker-product-cart-v1';
const { t } = useI18n();
const localePath = useLocalePath();
const cartState = ref<StoredCartState[]>([]);
const selectedIds = ref<string[]>([]);

function normalizeCartState(payload: unknown): StoredCartState[] {
    if (!Array.isArray(payload)) return [];
    return payload
        .filter(
            (item): item is StoredCartState =>
                Boolean(item) &&
                typeof item === 'object' &&
                typeof (item as StoredCartState).id === 'string' &&
                typeof (item as StoredCartState).productId === 'string'
        )
        .map((item) => ({
            ...item,
            artworkPreviewUrl:
                typeof item.artworkPreviewUrl === 'string' ? item.artworkPreviewUrl : '',
        }));
}

function readCartStateFromStorage() {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(CART_STORAGE_KEY);
        if (!raw) return [];
        return normalizeCartState(JSON.parse(raw));
    } catch {
        return [];
    }
}

function writeCartStateToStorage(next: StoredCartState[]) {
    if (typeof window === 'undefined') return;
    if (next.length) {
        window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(next));
    } else {
        window.localStorage.removeItem(CART_STORAGE_KEY);
    }
    window.dispatchEvent(new CustomEvent('musticker:cart-updated'));
}

const rows = computed<CartRow[]>(() =>
    cartState.value
        .map((entry) => {
            const category = productCatalog[entry.category];
            const product = category?.products.find((item) => item.id === entry.productId);
            if (!product) return null;
            return {
                id: entry.id,
                category: entry.category,
                product,
                sizeLabel: t(`product.sizes.${entry.sizeKey}.label`),
                qty: entry.qty,
                total: entry.total,
                artworkPreviewUrl: entry.artworkPreviewUrl || '',
            };
        })
        .filter((item): item is CartRow => Boolean(item))
);

const allSelected = computed({
    get: () => rows.value.length > 0 && selectedIds.value.length === rows.value.length,
    set: (checked: boolean) => {
        selectedIds.value = checked ? rows.value.map((row) => row.id) : [];
    },
});

const selectedRows = computed(() =>
    rows.value.filter((row) => selectedIds.value.includes(row.id))
);

const selectedTotal = computed(() =>
    selectedRows.value.reduce((sum, row) => sum + row.total, 0)
);
const qtySelectOptions = computed(() =>
    quantityOptions.map((qty) => ({
        label: qty.toLocaleString(),
        value: qty,
    }))
);

function formatPrice(value: number) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(value);
}

function sizeDimOnly(label: string) {
    const matched = label.match(/(\d+\s*(?:x|\u00d7)\s*\d+)/i);
    if (matched?.[1]) return matched[1].replace(/\s+/g, '');
    return label;
}

function toggleRowSelection(itemId: string, checked: boolean) {
    if (checked) {
        if (!selectedIds.value.includes(itemId)) {
            selectedIds.value = [...selectedIds.value, itemId];
        }
        return;
    }
    selectedIds.value = selectedIds.value.filter((id) => id !== itemId);
}

function updateQty(itemId: string, nextQty: number) {
    const qty = Number(nextQty);
    if (!Number.isFinite(qty) || qty <= 0) return;

    cartState.value = cartState.value.map((item) => {
        if (item.id !== itemId) return item;
        const unitPrice = item.qty > 0 ? item.total / item.qty : 0;
        return {
            ...item,
            qty,
            total: unitPrice * qty,
        };
    });
    writeCartStateToStorage(cartState.value);
}

function removeByIds(ids: string[]) {
    if (!ids.length) return;
    cartState.value = cartState.value.filter((item) => !ids.includes(item.id));
    selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id));
    writeCartStateToStorage(cartState.value);
}

onMounted(() => {
    cartState.value = readCartStateFromStorage();
    selectedIds.value = cartState.value.map((item) => item.id);
});
</script>

<template>
    <main class="cart-page" data-testid="cart-page">
        <section class="cart-page-shell">
            <header class="cart-page-head">
                <h1 class="cart-page-title">My Cart</h1>
                <NuxtLink :to="localePath('/stickers')" class="cart-page-continue">
                    <UiIcon name="strong-long-arrow-right" :size="24" color="var(--text-primary)" />
                    Continue Shopping
                </NuxtLink>
            </header>

            <section class="cart-page-layout">
                <section class="cart-list" data-testid="cart-page-list">
                    <div class="cart-list-controls">
                        <UiCheckbox
                            class="cart-check-row"
                            :model-value="allSelected"
                            @update:model-value="allSelected = $event"
                        >
                            Select All: {{ rows.length }} item(s)
                        </UiCheckbox>
                        <UiButton
                            class="cart-remove-btn"
                            variant="outline"
                            tone="default"
                            size="md"
                            :disabled="selectedIds.length === 0"
                            @click="removeByIds(selectedIds)"
                        >
                            <UiIcon name="regular-trash" :size="24" color="var(--text-primary)" />
                            Remove
                        </UiButton>
                    </div>

                    <div class="cart-list-head">
                        <span class="cart-list-head-label">ITEM</span>
                        <span class="cart-list-head-label">QUANTITY</span>
                        <span class="cart-list-head-label">PRICE</span>
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
                            @update:model-value="toggleRowSelection(row.id, $event)"
                        />

                        <div class="cart-item">
                            <div class="cart-item-thumb">
                                <img
                                    :src="row.artworkPreviewUrl || row.product.image"
                                    :alt="row.product.name"
                                />
                            </div>
                            <div class="cart-item-copy">
                                <h3 class="cart-item-title">{{ row.product.name }}</h3>
                                <p class="cart-item-size">Size: {{ sizeDimOnly(row.sizeLabel) }}mm</p>
                                <UiButton class="cart-link-btn" variant="ghost" tone="default" size="24">
                                    Replace Artwork
                                </UiButton>
                            </div>
                        </div>

                        <div class="cart-qty-wrap">
                            <UiButton class="cart-link-btn" variant="ghost" tone="default" size="24">
                                Edit Size
                            </UiButton>
                            <UiSelect
                                class="cart-qty-select-control"
                                :model-value="row.qty"
                                :options="qtySelectOptions"
                                icon-family="regular"
                                :icon-size="24"
                                @update:model-value="updateQty(row.id, Number($event))"
                            />
                        </div>

                        <strong class="cart-row-price">{{ formatPrice(row.total) }}</strong>

                        <UiButton
                            class="cart-delete-btn"
                            variant="ghost"
                            tone="default"
                            size="sm"
                            icon-only
                            icon="regular-trash"
                            icon-size="24"
                            sr-label="Remove item"
                            @click="removeByIds([row.id])"
                        />
                    </article>
                </section>

                <aside class="cart-summary-column" data-testid="cart-page-summary">
                    <section class="cart-summary-card">
                        <header class="cart-summary-header">
                            <h2 class="cart-summary-title">Order Summary</h2>
                        </header>
                        <div class="cart-summary-body">
                            <div class="cart-summary-line">
                                <span class="cart-summary-total-label">Total:</span>
                                <strong class="cart-summary-total-value">{{ formatPrice(selectedTotal) }}</strong>
                            </div>
                            <div class="cart-summary-actions">
                                <UiButton
                                    type="button"
                                    variant="filled"
                                    tone="neutral"
                                    size="md"
                                    class="cart-checkout-btn"
                                >
                                    Proceed Checkout ({{ selectedRows.length }})
                                </UiButton>
                                <p class="cart-summary-note">
                                    Shipping fees and discounts are calculated at checkout.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section class="cart-payment-section">
                        <p class="cart-payment-label">Available Payment Options:</p>
                        <div class="cart-payment-grid">
                            <span class="cart-payment-chip">PayPal</span>
                            <span class="cart-payment-chip">VISA</span>
                            <span class="cart-payment-chip">Mastercard</span>
                            <span class="cart-payment-chip">JCB</span>
                            <span class="cart-payment-chip">UnionPay</span>
                        </div>
                    </section>
                </aside>
            </section>
        </section>
    </main>
</template>

<style scoped lang="scss">
.cart-page {
    min-height: calc(100dvh - 120px);
    background: var(--bg-page);
    padding: 48px 24px 72px;
    
    .cart-page-shell {
        max-width: 1200px;
        margin: 0 auto;

        .cart-page-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--gray-30);

            .cart-page-title {
                margin: 0;
                font-size: 32px;
                line-height: 48px;
                color: var(--text-primary);
            }

            .cart-page-continue {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                color: var(--text-primary);
                text-decoration: none;
                font-size: 14px;
                font-weight: 500;
                line-height: 24px;
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
                        font-size: 20px;
                        line-height: 28px;

                        :deep(.ui-checkbox-box) {
                            width: 20px;
                            height: 20px;
                            border-radius: 5px;
                            border-color: var(--text-primary);
                            background: var(--contrast-light);
                        }

                        :deep(.ui-checkbox-icon) {
                            width: 16px;
                            height: 16px;
                            display: block;
                        }

                        :deep(.ui-checkbox-input:checked + .ui-checkbox-box) {
                            background: var(--text-primary);
                            border-color: var(--text-primary);
                        }
                    }

                    .cart-remove-btn {
                        min-width: 118px;
                        height: 40px;
                        border-radius: 16px;
                        border: 1px solid var(--gold-40);
                        background: var(--gold-10);
                        color: var(--abyss-base);
                        padding: 8px 24px;
                        font-size: 14px;
                        line-height: 24px;
                        font-weight: 500;
                        cursor: pointer;
                        transition: background-color 0.16s ease, border-color 0.16s ease,
                            opacity 0.16s ease;

                        :deep(.ui-button-label) {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            gap: 8px;
                        }

                        &:hover:not(:disabled) {
                            background: var(--brand-primary-soft-hover, #f6f1d8);
                            border-color: var(--brand-primary-dark-hover, #e3cc4e);
                        }

                        &:disabled {
                            opacity: 0.45;
                            cursor: not-allowed;
                        }
                    }
                }

                .cart-list-head {
                    display: grid;
                    grid-template-columns: 1fr 180px 160px 40px;
                    gap: 14px;
                    border-bottom: 1px solid var(--gray-30);
                    padding-bottom: 10px;
                    color: var(--text-primary);
                    font-size: 14px;
                    font-weight: 500;
                    line-height: 24px;

                    .cart-list-head-label,
                    .cart-list-head-spacer {
                        display: block;
                    }
                }

                .cart-row {
                    display: grid;
                    grid-template-columns: 24px 1fr 220px 160px 40px;
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
                        gap: 14px;

                        .cart-item-thumb {
                            width: 86px;
                            height: 86px;
                            border-radius: 10px;
                            background: var(--gray-20);
                            display: grid;
                            place-items: center;
                            overflow: hidden;

                            img {
                                width: 62px;
                                height: 62px;
                                object-fit: contain;
                            }
                        }

                            .cart-item-copy {
                            .cart-item-title {
                                margin: 0;
                                font-size: 14px;
                                line-height: 24px;
                                color: var(--text-primary);
                            }

                            .cart-item-size {
                                margin: 0;
                                font-size: 14px;
                                line-height: 24px;
                                color: var(--text-secondary);
                            }

                            .cart-link-btn {
                                border: 0;
                                background: transparent;
                                color: var(--gold-60);
                                padding: 0;
                                font-size: 14px;
                                line-height: 24px;
                                font-weight: 600;
                                cursor: pointer;
                            }
                        }
                    }

                    .cart-qty-wrap {
                        display: flex;
                        align-items: center;
                        gap: 10px;

                        .cart-link-btn {
                            border: 0;
                            background: transparent;
                            color: var(--gold-60);
                            padding: 0;
                            font-size: 14px;
                            line-height: 24px;
                            font-weight: 600;
                            cursor: pointer;
                        }

                        .cart-qty-select-control {
                            width: 129px;
                            
                            :deep(.ui-select) {
                                min-width: 129px;
                                width: 129px;
                            }

                            :deep(.ui-select-trigger) {
                                height: 40px;
                                border-radius: 8px;
                                border: 1px solid var(--gray-40);
                                background: var(--contrast-light);
                                padding: 8px 16px;
                                box-shadow: none;
                            }
                        }
                    }

                    .cart-row-price {
                        font-size: 18px;
                        line-height: 32px;
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
                            margin: 0;
                            font-size: 16px;
                            line-height: 28px;
                            color: var(--text-primary);
                            font-weight: 700;
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
                                font-size: 14px;
                                font-weight: 600;
                                line-height: 24px;
                            }

                            .cart-summary-total-value {
                                font-size: 24px;
                                line-height: 36px;
                                font-weight: 700;
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
                                font-size: 16px;
                                line-height: 28px;
                                font-weight: 500;
                                box-shadow: none;
                            }

                            .cart-summary-note {
                                margin: 0;
                                color: var(--text-secondary);
                                font-size: 14px;
                                line-height: 24px;
                            }
                        }
                    }
                }

                .cart-payment-section {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;

                    .cart-payment-label {
                        color: var(--abyss-base);
                        font-size: 14px;
                        font-weight: 400;
                        line-height: 24px;
                    }

                    .cart-payment-grid {
                        display: grid;
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                        gap: 8px;

                        .cart-payment-chip {
                            min-height: 36px;
                            border: 1px solid var(--gray-40);
                            border-radius: 10px;
                            display: grid;
                            place-items: center;
                            font-size: 12px;
                            line-height: 18px;
                            color: var(--text-primary);
                            background: var(--contrast-light);
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
                    font-size: 34px;
                    line-height: 44px;
                }

                .cart-page-continue {
                    font-size: 18px;
                    line-height: 26px;
                }
            }

            .cart-page-layout {
                .cart-list {
                    .cart-row {
                        .cart-row-price {
                            font-size: 30px;
                            line-height: 38px;
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
