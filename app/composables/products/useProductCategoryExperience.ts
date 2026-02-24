import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import {
    productCatalog,
    type ProductCategoryKey,
    type ProductItem,
} from '~/data/products/catalog';
import {
    PRODUCT_SELECTION_NAV_DELAY_MS,
    quantityOptions,
    sizeFeatureCards,
    sizeOptions,
} from '~/data/products/categoryExperience';

export function useProductCategoryExperience(category: Ref<ProductCategoryKey>) {
    const CART_STORAGE_KEY = 'musticker-product-cart-v1';

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

    const { t } = useI18n();
    const route = useRoute();
    const router = useRouter();
    const localePath = useLocalePath();

    const categoryData = computed(() => productCatalog[category.value]);
    const selectedId = ref<string | null>(null);
    const selectedSize = ref<(typeof sizeOptions)[number]>(sizeOptions[0]);
    const selectedQty = ref<number>(quantityOptions[0]);
    const hasPickedProduct = ref(false);
    const uploadModalOpen = ref(false);
    const addToCartLoading = ref(false);
    const cartPreviewOpen = ref(false);
    const featuredOpen = ref(true);
    const specialInstructions = ref('');
    const artworkFile = ref<File | null>(null);
    const artworkPreviewUrl = ref('');
    const artworkInputRef = ref<HTMLInputElement | null>(null);

    const sizeOptionModels = computed(() =>
        sizeOptions.map((size) => ({
            key: size,
            ...sizeLabelParts(size),
        }))
    );

    const selectedProduct = computed(() => {
        if (!selectedId.value) return null;
        return (
            categoryData.value.products.find((item) => item.id === selectedId.value) ||
            null
        );
    });

    const unitPrice = computed(() => {
        const base =
            category.value === 'stickers'
                ? 2.4
                : category.value === 'roll-stickers'
                  ? 1.7
                  : 1.9;
        return Math.max(0.18, base - selectedQty.value / 5000);
    });

    const subtotal = computed(() => unitPrice.value * selectedQty.value);
    const discountRate = computed(() =>
        selectedQty.value >= 1000 ? 0.2 : selectedQty.value >= 300 ? 0.12 : 0.06
    );
    const total = computed(() => subtotal.value * (1 - discountRate.value));
    const hasUploadedArtwork = computed(
        () => Boolean(artworkFile.value || artworkPreviewUrl.value)
    );
    const selectedSizeLabel = computed(() =>
        t(`product.sizes.${selectedSize.value}.label`)
    );
    const cartState = ref<StoredCartState[]>([]);
    const cartItems = computed(() =>
        cartState.value
            .map((entry) => {
                for (const cat of Object.values(productCatalog)) {
                    const product = cat.products.find((item) => item.id === entry.productId);
                    if (product) {
                        return {
                            id: entry.id,
                            product,
                            sizeKey: entry.sizeKey,
                            sizeLabel: t(`product.sizes.${entry.sizeKey}.label`),
                            qty: entry.qty,
                            total: entry.total,
                            artworkName: entry.artworkName,
                            artworkPreviewUrl: entry.artworkPreviewUrl || '',
                        };
                    }
                }
                return null;
            })
            .filter((item): item is NonNullable<typeof item> => Boolean(item))
    );
    const cartGrandTotal = computed(() =>
        cartItems.value.reduce((sum, item) => sum + item.total, 0)
    );
    const featuredItems = computed(() => {
        const activeId = selectedId.value;
        return categoryData.value.products
            .filter((item) => item.id !== activeId)
            .slice(0, 3);
    });
    const cartItemCount = computed(() => cartItems.value.length);
    const cartArtworkName = computed(
        () => cartItems.value[0]?.artworkName || artworkFile.value?.name || ''
    );
    const cartArtworkSize = computed(() =>
        artworkFile.value ? formatFileSize(artworkFile.value.size) : ''
    );
    const cartArtworkExtension = computed(() => {
        const fileName = artworkFile.value?.name || '';
        const parts = fileName.split('.');
        return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'file';
    });

    let selectionNavigationTimer: ReturnType<typeof setTimeout> | null = null;
    let selectionScrollLocked = false;
    let bodyOverflowBeforeSelectionLock = '';
    let overlayBodyScrollLocked = false;
    const selectionNavigationInFlight = ref(false);
    const editingCartItemId = ref<string | null>(null);
    let preserveUploadModalOnNextRouteSync = false;

    watch(
        () => category.value,
        () => {
            selectedId.value = null;
            selectedSize.value = sizeOptions[0];
            selectedQty.value = quantityOptions[0];
            hasPickedProduct.value = false;
        }
    );

    watch(
        () => route.params.product,
        () => {
            applySelectionFromRoute();
            setSelectionScrollLock(false);
            if (preserveUploadModalOnNextRouteSync) {
                preserveUploadModalOnNextRouteSync = false;
            } else {
                closeUploadModal();
            }
            closeCartPreview();
        },
        { immediate: true }
    );

    watch(
        () => uploadModalOpen.value || cartPreviewOpen.value,
        (isOpen) => {
            setOverlayBodyScrollLock(isOpen);
        }
    );

    function normalizeCartState(payload: unknown): StoredCartState[] {
        if (Array.isArray(payload)) {
            return payload.filter(
                (item): item is StoredCartState =>
                    Boolean(item) &&
                    typeof item === 'object' &&
                    typeof (item as StoredCartState).productId === 'string' &&
                    typeof (item as StoredCartState).id === 'string'
            ).map((item) => ({
                ...item,
                artworkPreviewUrl:
                    typeof item.artworkPreviewUrl === 'string'
                        ? item.artworkPreviewUrl
                        : '',
            }));
        }

        if (
            payload &&
            typeof payload === 'object' &&
            typeof (payload as StoredCartState).productId === 'string'
        ) {
            const single = payload as StoredCartState;
            return [
                {
                    ...single,
                    id: single.id || `${single.productId}-${Date.now()}`,
                    artworkPreviewUrl:
                        typeof single.artworkPreviewUrl === 'string'
                            ? single.artworkPreviewUrl
                            : '',
                },
            ];
        }

        return [];
    }

    function readCartStateFromStorage(): StoredCartState[] {
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

    function isPlainItem(item: StoredCartState) {
        return !item.artworkName && !item.artworkPreviewUrl;
    }

    function mergePlainCartItems(items: StoredCartState[]) {
        const merged: StoredCartState[] = [];
        const plainIndexByKey = new Map<string, number>();

        for (const item of items) {
            if (!isPlainItem(item)) {
                merged.push(item);
                continue;
            }

            const key = `${item.category}::${item.productId}::${item.sizeKey}`;
            const existingIndex = plainIndexByKey.get(key);
            if (existingIndex === undefined) {
                plainIndexByKey.set(key, merged.length);
                merged.push(item);
                continue;
            }

            const existing = merged[existingIndex];
            merged[existingIndex] = {
                ...existing,
                qty: existing.qty + item.qty,
                total: existing.total + item.total,
            };
        }

        return merged;
    }

    function generateCartItemId(productId: string) {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID();
        }
        return `${productId}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    }

    function appendCurrentSelectionToCart(
        artworkName = '',
        artworkPreviewUrlValue = '',
        replaceItemId: string | null = null
    ) {
        if (!selectedProduct.value) {
            applySelectionFromRoute();
        }

        if (!selectedProduct.value) return false;

        const nextItem: StoredCartState = {
            id: generateCartItemId(selectedProduct.value.id),
            category: category.value,
            productId: selectedProduct.value.id,
            sizeKey: selectedSize.value,
            qty: selectedQty.value,
            total: total.value,
            artworkName,
            artworkPreviewUrl: artworkPreviewUrlValue,
        };

        const baseState = replaceItemId
            ? cartState.value.filter((item) => item.id !== replaceItemId)
            : cartState.value;
        const nextState = mergePlainCartItems([nextItem, ...baseState]);
        cartState.value = nextState;
        writeCartStateToStorage(nextState);
        return true;
    }

    onMounted(() => {
        if (typeof window === 'undefined') return;
        cartState.value = mergePlainCartItems(readCartStateFromStorage());
    });

    function selectProduct(productId: string) {
        selectedId.value = productId;
        hasPickedProduct.value = true;

        const productSlug = productIdToSlug(productId);
        const targetPath = localePath(`/${category.value}/${productSlug}`);
        if (route.path === targetPath) {
            selectionNavigationInFlight.value = false;
            return;
        }

        const routeProduct = route.params.product;
        const hasRouteProduct = Array.isArray(routeProduct)
            ? routeProduct.length > 0
            : Boolean(routeProduct);

        if (selectionNavigationTimer) {
            clearTimeout(selectionNavigationTimer);
            selectionNavigationTimer = null;
        }

        if (hasRouteProduct) {
            selectionNavigationInFlight.value = true;
            void router.push(targetPath).finally(() => {
                selectionNavigationInFlight.value = false;
            });
            return;
        }

        setSelectionScrollLock(true);
        selectionNavigationInFlight.value = true;
        selectionNavigationTimer = setTimeout(() => {
            void router.push(targetPath).finally(() => {
                selectionNavigationInFlight.value = false;
                setSelectionScrollLock(false);
            });
            selectionNavigationTimer = null;
        }, PRODUCT_SELECTION_NAV_DELAY_MS);
    }

    function setSelectionScrollLock(locked: boolean) {
        if (typeof document === 'undefined') return;

        if (locked) {
            if (selectionScrollLocked) return;
            bodyOverflowBeforeSelectionLock = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            selectionScrollLocked = true;
            return;
        }

        if (!selectionScrollLocked) return;
        document.body.style.overflow = bodyOverflowBeforeSelectionLock;
        selectionScrollLocked = false;
    }

    function setOverlayBodyScrollLock(locked: boolean) {
        if (typeof document === 'undefined') return;

        if (locked) {
            if (overlayBodyScrollLocked) return;
            document.body.style.overflow = 'hidden';
            overlayBodyScrollLocked = true;
            return;
        }

        if (!overlayBodyScrollLocked) return;
        if (!selectionScrollLocked) {
            document.body.style.overflow = bodyOverflowBeforeSelectionLock;
        }
        overlayBodyScrollLocked = false;
    }

    function openUploadModal() {
        if (!selectedProduct.value) return;
        if (selectionNavigationInFlight.value) {
            preserveUploadModalOnNextRouteSync = true;
        }
        uploadModalOpen.value = true;
    }

    function closeUploadModal() {
        uploadModalOpen.value = false;
        editingCartItemId.value = null;
    }

    function closeCartPreview() {
        cartPreviewOpen.value = false;
    }

    function openFilePicker() {
        artworkInputRef.value?.click();
    }

    function removeArtwork() {
        artworkPreviewUrl.value = '';
        artworkFile.value = null;
        if (artworkInputRef.value) {
            artworkInputRef.value.value = '';
        }
    }

    async function onArtworkSelected(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        artworkFile.value = file;
        artworkPreviewUrl.value = file.type.startsWith('image/')
            ? await readFileAsDataUrl(file)
            : '';
    }

    async function proceedToCart() {
        if (!hasUploadedArtwork.value || addToCartLoading.value) return;
        addToCartLoading.value = true;
        try {
            // Simulate add-to-cart processing so UI state is visible and double-submits are blocked.
            await new Promise((resolve) => setTimeout(resolve, 450));
            const appended = appendCurrentSelectionToCart(
                artworkFile.value?.name || '',
                artworkPreviewUrl.value,
                editingCartItemId.value
            );
            if (appended) {
                editingCartItemId.value = null;
                removeArtwork();
                openCartPreview();
            }
        } finally {
            addToCartLoading.value = false;
        }
    }

    function removeCartItem(itemId: string) {
        const nextState = cartState.value.filter((item) => item.id !== itemId);
        cartState.value = nextState;
        writeCartStateToStorage(nextState);
    }

    function updateCartItem(itemId: string, nextSizeKey: string, nextQty: number) {
        const qty = Number(nextQty);
        if (!Number.isFinite(qty) || qty <= 0) return;

        const normalizedSizeKey = sizeOptions.includes(
            nextSizeKey as (typeof sizeOptions)[number]
        )
            ? nextSizeKey
            : sizeOptions[0];

        const nextState = mergePlainCartItems(
            cartState.value.map((item) => {
                if (item.id !== itemId) return item;
                const unitPrice = item.qty > 0 ? item.total / item.qty : 0;
                return {
                    ...item,
                    sizeKey: normalizedSizeKey,
                    qty,
                    total: unitPrice * qty,
                };
            })
        );

        cartState.value = nextState;
        writeCartStateToStorage(nextState);
    }

    function productIdToSlugByCategory(
        productId: string,
        categoryKey: ProductCategoryKey
    ) {
        if (categoryKey === 'stickers') {
            return productId.replace(/-sticker$/, '');
        }
        return productId;
    }

    async function editCartItem(itemId: string) {
        const entry = cartState.value.find((item) => item.id === itemId);
        if (!entry) return;
        editingCartItemId.value = itemId;

        if (sizeOptions.includes(entry.sizeKey as (typeof sizeOptions)[number])) {
            selectedSize.value = entry.sizeKey as (typeof sizeOptions)[number];
        }
        selectedQty.value = entry.qty;
        selectedId.value = entry.productId;
        hasPickedProduct.value = true;

        const targetSlug = productIdToSlugByCategory(entry.productId, entry.category);
        const targetPath = localePath(`/${entry.category}/${targetSlug}`);

        if (route.path !== targetPath) {
            preserveUploadModalOnNextRouteSync = true;
            await router.push(targetPath);
        }

        if (entry.artworkPreviewUrl) {
            artworkPreviewUrl.value = entry.artworkPreviewUrl;
            artworkFile.value = null;
        } else {
            removeArtwork();
        }

        uploadModalOpen.value = true;
        cartPreviewOpen.value = false;
    }

    function openCartPreview() {
        uploadModalOpen.value = false;
        featuredOpen.value = true;
        cartPreviewOpen.value = true;
    }

    function skipAndUploadLater() {
        if (hasUploadedArtwork.value) return;
        const appended = appendCurrentSelectionToCart('', '', editingCartItemId.value);
        if (appended) {
            editingCartItemId.value = null;
            removeArtwork();
            openCartPreview();
        }
    }

    function closeFeaturedItems() {
        featuredOpen.value = false;
    }

    function featuredStartPrice() {
        const startingQty = quantityOptions[0];
        return formatPrice(quantityPrice(startingQty));
    }

    function formatFileSize(bytes: number) {
        if (bytes <= 0) return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        const index = Math.min(
            Math.floor(Math.log(bytes) / Math.log(1024)),
            units.length - 1
        );
        const value = bytes / 1024 ** index;
        return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
    }

    function readFileAsDataUrl(file: File): Promise<string> {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
            reader.onerror = () => resolve('');
            reader.readAsDataURL(file);
        });
    }

    function formatPrice(value: number) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(value);
    }

    function quantityPrice(qty: number) {
        return unitPrice.value * qty;
    }

    function getProductName(product: ProductItem) {
        return t(`product.items.${product.id}.name`);
    }

    function getProductBlurb(product: ProductItem) {
        return t(`product.items.${product.id}.blurb`);
    }

    function sizeLabelParts(sizeKey: string) {
        const label = t(`product.sizes.${sizeKey}.label`);
        const [name, ...rest] = label.split(' ');
        return {
            name,
            dim: rest.join(' '),
        };
    }

    function productIdToSlug(productId: string) {
        if (category.value === 'stickers') {
            return productId.replace(/-sticker$/, '');
        }
        return productId;
    }

    function productSlugToId(slug: string) {
        const directMatch = categoryData.value.products.find((item) => item.id === slug);
        if (directMatch) return directMatch.id;

        if (category.value === 'stickers') {
            const stickerMatch = categoryData.value.products.find(
                (item) => item.id === `${slug}-sticker`
            );
            if (stickerMatch) return stickerMatch.id;
        }

        return null;
    }

    function applySelectionFromRoute() {
        const routeProduct = route.params.product;
        const slug = Array.isArray(routeProduct) ? routeProduct[0] : routeProduct;

        if (!slug) {
            selectedId.value = null;
            hasPickedProduct.value = false;
            return;
        }

        const resolvedId = productSlugToId(slug);
        if (!resolvedId) {
            selectedId.value = null;
            hasPickedProduct.value = false;
            return;
        }

        selectedId.value = resolvedId;
        hasPickedProduct.value = true;
    }

    onBeforeUnmount(() => {
        if (selectionNavigationTimer) {
            clearTimeout(selectionNavigationTimer);
            selectionNavigationTimer = null;
        }
        selectionNavigationInFlight.value = false;
        preserveUploadModalOnNextRouteSync = false;
        setSelectionScrollLock(false);
        setOverlayBodyScrollLock(false);
    });

    return {
        sizeFeatureCards,
        quantityOptions,
        categoryData,
        selectedId,
        selectedSize,
        selectedQty,
        selectionNavigationInFlight,
        hasPickedProduct,
        uploadModalOpen,
        addToCartLoading,
        cartPreviewOpen,
        featuredOpen,
        specialInstructions,
        artworkFile,
        artworkPreviewUrl,
        artworkInputRef,
        sizeOptionModels,
        selectedProduct,
        cartItems,
        cartGrandTotal,
        subtotal,
        discountRate,
        total,
        hasUploadedArtwork,
        selectedSizeLabel,
        featuredItems,
        cartItemCount,
        cartArtworkName,
        cartArtworkSize,
        cartArtworkExtension,
        selectProduct,
        openUploadModal,
        closeUploadModal,
        closeCartPreview,
        openFilePicker,
        removeArtwork,
        onArtworkSelected,
        proceedToCart,
        editCartItem,
        removeCartItem,
        updateCartItem,
        skipAndUploadLater,
        closeFeaturedItems,
        featuredStartPrice,
        formatPrice,
        quantityPrice,
        getProductName,
        getProductBlurb,
    };
}
