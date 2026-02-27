import { computed, onMounted, ref } from 'vue';
import { quantityOptions } from '~/data/products/categoryExperience';
import {
    productCatalog,
    type ProductCategoryKey,
    type ProductItem,
} from '~/data/products/catalog';
import {
    CART_STORAGE_KEY,
    CART_UPDATED_EVENT,
    CHECKOUT_SELECTION_STORAGE_KEY,
    cartPaymentOptions,
} from '~/data/cart/page';
import { useCountry } from '~/composables/app/useCountry';
import { formatCurrencyByCountry } from '~/utils/currency';
import { sizeDimOnly } from '~/utils/cart';

export type StoredCartState = {
    id: string;
    category: ProductCategoryKey;
    productId: string;
    sizeKey: string;
    qty: number;
    total: number;
    artworkName: string;
    artworkPreviewUrl?: string;
};

export type CartRow = {
    id: string;
    category: ProductCategoryKey;
    product: ProductItem;
    sizeLabel: string;
    qty: number;
    total: number;
    artworkPreviewUrl: string;
};

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
    window.dispatchEvent(new CustomEvent(CART_UPDATED_EVENT));
}

export function useCartPage() {
    const { t } = useI18n();
    const { withCountry, country } = useCountry();
    const router = useRouter();

    const cartState = ref<StoredCartState[]>([]);
    const selectedIds = ref<string[]>([]);

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

    function goToCheckout() {
        if (!selectedRows.value.length) return;
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(
                CHECKOUT_SELECTION_STORAGE_KEY,
                JSON.stringify(selectedRows.value.map((row) => row.id))
            );
        }
        void router.push(withCountry('/checkout'));
    }

    const continueShoppingPath = computed(() => withCountry('/stickers'));

    onMounted(() => {
        cartState.value = readCartStateFromStorage();
        selectedIds.value = cartState.value.map((item) => item.id);
    });

    return {
        rows,
        selectedIds,
        allSelected,
        selectedRows,
        selectedTotal,
        qtySelectOptions,
        paymentOptions: cartPaymentOptions,
        continueShoppingPath,
        toggleRowSelection,
        updateQty,
        removeByIds,
        goToCheckout,
        formatPrice: (value: number) =>
            formatCurrencyByCountry(value, country.value),
        sizeDimOnly,
    };
}


