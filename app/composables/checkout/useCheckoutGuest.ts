import { computed, onMounted, ref } from 'vue';
import { checkoutProvinceOptions } from '~/data/checkout/options';
import {
    productCatalog,
    type ProductCategoryKey,
    type ProductItem,
} from '~/data/products/catalog';

const CART_STORAGE_KEY = 'musticker-product-cart-v1';
const CHECKOUT_SELECTION_STORAGE_KEY = 'musticker-checkout-selection-v1';

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

type CheckoutItem = {
    id: string;
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

function readSelectionIdsFromStorage() {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(CHECKOUT_SELECTION_STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.filter((item): item is string => typeof item === 'string');
    } catch {
        return [];
    }
}

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

export function useCheckoutGuest() {
    const { t } = useI18n();

    const email = ref('');
    const fullName = ref('');
    const company = ref('');
    const address1 = ref('');
    const address2 = ref('');
    const province = ref('');
    const city = ref('');
    const postalCode = ref('');
    const phone = ref('');
    const cardNumber = ref('');
    const expiry = ref('');
    const cvv = ref('');
    const useShippingAsBilling = ref(true);

    const cartState = ref<StoredCartState[]>([]);
    const selectedItemIds = ref<string[]>([]);

    const checkoutItems = computed<CheckoutItem[]>(() =>
        cartState.value
            .map((entry) => {
                const category = productCatalog[entry.category];
                const product = category?.products.find((item) => item.id === entry.productId);
                if (!product) return null;

                return {
                    id: entry.id,
                    product,
                    sizeLabel: t(`product.sizes.${entry.sizeKey}.label`),
                    qty: entry.qty,
                    total: entry.total,
                    artworkPreviewUrl: entry.artworkPreviewUrl || '',
                };
            })
            .filter((item): item is CheckoutItem => Boolean(item))
    );

    const selectedCheckoutItems = computed(() => {
        if (!selectedItemIds.value.length) return checkoutItems.value;
        const selected = checkoutItems.value.filter((item) =>
            selectedItemIds.value.includes(item.id)
        );
        return selected.length ? selected : checkoutItems.value;
    });

    const orderTotal = computed(() =>
        selectedCheckoutItems.value.reduce((sum, item) => sum + item.total, 0)
    );
    const orderDiscount = computed(() => 0);
    const orderShippingFee = computed(() => 0);
    const orderSubtotal = computed(
        () => orderTotal.value + orderDiscount.value - orderShippingFee.value
    );

    onMounted(() => {
        if (typeof window === 'undefined') return;

        try {
            const raw = window.localStorage.getItem(CART_STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            cartState.value = normalizeCartState(parsed);
        } catch {
            cartState.value = [];
        }

        selectedItemIds.value = readSelectionIdsFromStorage();
    });

    return {
        provinceOptions: checkoutProvinceOptions,
        email,
        fullName,
        company,
        address1,
        address2,
        province,
        city,
        postalCode,
        phone,
        cardNumber,
        expiry,
        cvv,
        useShippingAsBilling,
        selectedCheckoutItems,
        orderTotal,
        orderDiscount,
        orderShippingFee,
        orderSubtotal,
        formatPrice,
        sizeDimOnly,
    };
}
