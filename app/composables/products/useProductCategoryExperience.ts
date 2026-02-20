import { computed, onBeforeUnmount, ref, watch, type Ref } from 'vue';
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
    const hasUploadedArtwork = computed(() => Boolean(artworkFile.value));
    const selectedSizeLabel = computed(() =>
        t(`product.sizes.${selectedSize.value}.label`)
    );
    const featuredItems = computed(() => {
        const activeId = selectedId.value;
        return categoryData.value.products
            .filter((item) => item.id !== activeId)
            .slice(0, 3);
    });
    const cartItemCount = computed(() => (selectedProduct.value ? 1 : 0));
    const cartArtworkName = computed(() => artworkFile.value?.name || '');
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
            closeUploadModal();
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

    function selectProduct(productId: string) {
        selectedId.value = productId;
        hasPickedProduct.value = true;

        const productSlug = productIdToSlug(productId);
        const targetPath = localePath(`/${category.value}/${productSlug}`);
        if (route.path === targetPath) return;

        const routeProduct = route.params.product;
        const hasRouteProduct = Array.isArray(routeProduct)
            ? routeProduct.length > 0
            : Boolean(routeProduct);

        if (selectionNavigationTimer) {
            clearTimeout(selectionNavigationTimer);
            selectionNavigationTimer = null;
        }

        if (hasRouteProduct) {
            router.push(targetPath);
            return;
        }

        setSelectionScrollLock(true);
        selectionNavigationTimer = setTimeout(() => {
            void router.push(targetPath).finally(() => {
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
        uploadModalOpen.value = true;
    }

    function closeUploadModal() {
        uploadModalOpen.value = false;
    }

    function closeCartPreview() {
        cartPreviewOpen.value = false;
    }

    function openFilePicker() {
        artworkInputRef.value?.click();
    }

    function removeArtwork() {
        if (artworkPreviewUrl.value) {
            URL.revokeObjectURL(artworkPreviewUrl.value);
        }
        artworkPreviewUrl.value = '';
        artworkFile.value = null;
        if (artworkInputRef.value) {
            artworkInputRef.value.value = '';
        }
    }

    function onArtworkSelected(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (!file) return;

        if (artworkPreviewUrl.value) {
            URL.revokeObjectURL(artworkPreviewUrl.value);
        }

        artworkFile.value = file;
        artworkPreviewUrl.value = file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : '';
    }

    function proceedToCart() {
        if (!hasUploadedArtwork.value) return;
        openCartPreview();
    }

    function openCartPreview() {
        uploadModalOpen.value = false;
        featuredOpen.value = true;
        cartPreviewOpen.value = true;
    }

    function skipAndUploadLater() {
        if (hasUploadedArtwork.value) return;
        openCartPreview();
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
        setSelectionScrollLock(false);
        setOverlayBodyScrollLock(false);
        if (artworkPreviewUrl.value) {
            URL.revokeObjectURL(artworkPreviewUrl.value);
        }
    });

    return {
        sizeFeatureCards,
        quantityOptions,
        categoryData,
        selectedId,
        selectedSize,
        selectedQty,
        hasPickedProduct,
        uploadModalOpen,
        cartPreviewOpen,
        featuredOpen,
        specialInstructions,
        artworkFile,
        artworkPreviewUrl,
        artworkInputRef,
        sizeOptionModels,
        selectedProduct,
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
        skipAndUploadLater,
        closeFeaturedItems,
        featuredStartPrice,
        formatPrice,
        quantityPrice,
        getProductName,
        getProductBlurb,
    };
}
