import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { useCountry } from '~/composables/app/country/useCountry';
import type { ProductByCategoryApiItem } from '~/types/products/productByCategory';
import {
	productCatalog,
} from '~/data/products/catalog';
import { homeProductTypes } from '~/data/products/homeTypes';
import {
	PRODUCT_SELECTION_NAV_DELAY_MS,
	quantityOptions,
	sizeFeatureCards,
	sizeOptions,
} from '~/data/products/categoryExperience';
import { defaultStartPriceByProductId } from '~/data/products/pricing';
import type {
	ProductCategory,
	ProductCategoryKey,
	ProductItem,
} from '~/types/products/catalog';
import {
	readStoredCartStateFromStorage,
	writeStoredCartStateToStorage,
	type StoredCartState,
} from '~/helpers/cart/cartState.helper';
import {
	formatProductFileSize,
	generateProductCartItemId,
	getFeaturedProducts,
	getProductIdFromSlug,
	getProductSlugByCategory,
	mergePlainProductCartItems,
	normalizeProductCartState,
	readProductArtworkAsDataUrl,
} from '~/helpers/products/productCategory.helper';
import { formatCurrencyByCountry } from '~/utils/currency';

export function useProductCategoryExperience(category: Ref<ProductCategoryKey>, apiProducts?: Ref<ProductByCategoryApiItem[] | undefined>) {
	const { t } = useI18n();
	const route = useRoute();
	const router = useRouter();
	const { withCountry, country } = useCountry();

	const categoryData = computed<ProductCategory>(() => {
		const catalogCategory = productCatalog[category.value];
		const responseProducts = apiProducts?.value;

		if (!responseProducts?.length) {
			return catalogCategory;
		}

		const mappedProducts = responseProducts
			.map((product) => resolveCatalogProductByApiSlug(product.url_slug, catalogCategory.products))
			.filter((product): product is ProductItem => Boolean(product));

		if (!mappedProducts.length) {
			return catalogCategory;
		}

		return {
			...catalogCategory,
			products: dedupeProductsById(mappedProducts),
		};
	});
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
				const product = productCatalog[entry.category]?.products.find(
					(item) => item.id === entry.productId
				);
				if (!product) return null;

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
			})
			.filter((item): item is NonNullable<typeof item> => Boolean(item))
	);
	const cartGrandTotal = computed(() =>
		cartItems.value.reduce((sum, item) => sum + item.total, 0)
	);
	const featuredItems = computed(() => {
		return getFeaturedProducts(
			homeProductTypes.map((item) => item.productId),
			selectedId.value
		);
	});
	const cartItemCount = computed(() => cartItems.value.length);
	const cartArtworkName = computed(
		() => cartItems.value[0]?.artworkName || artworkFile.value?.name || ''
	);
	const cartArtworkSize = computed(() =>
		artworkFile.value ? formatProductFileSize(artworkFile.value.size) : ''
	);
	const cartArtworkExtension = computed(() => {
		const fileName = artworkFile.value?.name || '';
		const parts = fileName.split('.');
		const extension = parts.at(-1);
		return parts.length > 1 && extension ? extension.toLowerCase() : 'file';
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
			id: generateProductCartItemId(selectedProduct.value.id),
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
		const nextState = mergePlainProductCartItems([nextItem, ...baseState]);
		cartState.value = nextState;
		writeStoredCartStateToStorage(nextState);
		return true;
	}

	onMounted(() => {
		if (typeof window === 'undefined') return;
		cartState.value = mergePlainProductCartItems(
			normalizeProductCartState(readStoredCartStateFromStorage())
		);
	});

	function selectProduct(productId: string) {
		selectedId.value = productId;
		hasPickedProduct.value = true;

		const productSlug = productIdToSlug(productId);
		const targetPath = withCountry(`/${category.value}/${productSlug}`);
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
			? await readProductArtworkAsDataUrl(file)
			: '';
	}

	async function proceedToCart() {
		if (addToCartLoading.value) return;
		addToCartLoading.value = true;
		try {
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
		writeStoredCartStateToStorage(nextState);
	}

	function updateCartItem(itemId: string, nextSizeKey: string, nextQty: number) {
		const qty = Number(nextQty);
		if (!Number.isFinite(qty) || qty <= 0) return;

		const normalizedSizeKey = sizeOptions.includes(
			nextSizeKey as (typeof sizeOptions)[number]
		)
			? nextSizeKey
			: sizeOptions[0];

		const nextState = mergePlainProductCartItems(
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
		writeStoredCartStateToStorage(nextState);
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

		const targetSlug = getProductSlugByCategory(entry.productId, entry.category);
		const targetPath = withCountry(`/${entry.category}/${targetSlug}`);

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

	function featuredStartPrice(product: ProductItem) {
		return formatCurrencyByCountry(defaultStartPriceByProductId(product.id), country.value);
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
		const [name = '', ...rest] = label.split(' ');
		return {
			name,
			dim: rest.join(' '),
		};
	}

	function productIdToSlug(productId: string) {
		return getProductSlugByCategory(productId, category.value);
	}

	function resolveCatalogProductByApiSlug(slug: string, catalogProducts: ProductItem[]) {
		if (!slug) return null;

		const slugWithStickerSuffix =
			category.value === 'stickers' && !slug.endsWith('-sticker')
				? `${slug}-sticker`
				: slug;

		return (
			catalogProducts.find((item) => item.id === slugWithStickerSuffix) ||
			catalogProducts.find((item) => item.id === slug) ||
			null
		);
	}

	function dedupeProductsById(products: ProductItem[]) {
		const seen = new Set<string>();
		return products.filter((product) => {
			if (seen.has(product.id)) return false;
			seen.add(product.id);
			return true;
		});
	}

	function productSlugToId(slug: string) {
		return getProductIdFromSlug(slug, category.value);
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
		formatPrice: (value: number) =>
			formatCurrencyByCountry(value, country.value),
		quantityPrice,
		getProductName,
		getProductBlurb,
	};
}