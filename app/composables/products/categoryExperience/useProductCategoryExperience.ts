import { computed, inject, onBeforeUnmount, onMounted, provide, ref, watch, type InjectionKey, type Ref } from 'vue';
import type VinylLetteringDesigner from '~/components/products/product-category/VinylLetteringDesigner.vue';
import { useCountry } from '~/composables/app/country/useCountry';
import {
	productCatalog,
} from '~/data/products/catalog';
import { homeProductTypes } from '~/data/products/homeTypes';
import {
	quantity_options,
	size_feature_cards,
	size_options,
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
import { useAttributesStore, useSelectionStore, useUploadStore } from '~/stores/product';
import {
	formatProductFileSize,
	getFeaturedProducts,
	getProductIdFromSlug,
	getProductSlugByCategory,
	mergePlainProductCartItems,
	normalizeProductCartState,
} from '~/helpers/products/productCategory.helper';
import { formatCurrencyByCountry } from '~/utils/currency';
import type { Products } from '~/types/navigation/navgiation';
import { useQuoteSectionHandler } from '~/composables/product-page/useQuoteSectionHandler';

let pending_picker_route_animation = false;

export function useProductCategoryExperience(category: Ref<ProductCategoryKey>, api_products?: Ref<Products | undefined>) {
	const { t, te } = useI18n();
	const route = useRoute();
	const router = useRouter();
	const { withCountry, country } = useCountry();
	const selectionStore = useSelectionStore();
	const attributeStore = useAttributesStore();
	const uploadStore = useUploadStore();

	// Slicing Core: Quote Handler handles the complex product configuration
	const quoteHandler = useQuoteSectionHandler();

	const size_key_by_attribute_id = {
		1: 'small30',
		2: 'medium75',
		3: 'large100',
		4: 'extraLarge125',
	} as const;

	const category_data = computed<ProductCategory>(() => {
		const catalog_category = productCatalog[category.value];
		const response_products = api_products?.value?.products ?? [];

		if (!response_products.length) {
			return catalog_category;
		}

		const mapped_products = response_products
			.map((product) => resolveCatalogProductByApiSlug(product.url_slug, catalog_category.products))
			.filter((product): product is ProductItem => Boolean(product));

		if (!mapped_products.length) {
			return catalog_category;
		}

		return {
			...catalog_category,
			products: dedupeProductsById(mapped_products),
		};
	});

	const selected_id = ref<string | null>(null);
	const selected_size = ref<(typeof size_options)[number]>(size_options[0]);
	const selected_qty = ref<number>(quantity_options[0]);
	const has_picked_product = ref(false);
	const picker_slid_up = ref(false);
	const picker_slide_transition_enabled = ref(false);

	const upload_modal_open = computed({
		get: () => uploadStore.is_modal_open,
		set: (val) => uploadStore.is_modal_open = val
	});
	const add_to_cart_loading = computed({
		get: () => uploadStore.is_uploading,
		set: (val) => uploadStore.is_uploading = val
	});
	const cart_preview_open = computed({
		get: () => uploadStore.is_preview_open,
		set: (val) => uploadStore.is_preview_open = val
	});

	const featured_open = ref(true);

	const special_instructions = computed({
		get: () => uploadStore.instruction,
		set: (val) => uploadStore.instruction = val
	});

	const artwork_file = computed({
		get: () => uploadStore.artwork_file,
		set: (val) => uploadStore.artwork_file = val
	});

	const artwork_preview_url = computed({
		get: () => uploadStore.artwork_preview,
		set: (val) => uploadStore.artwork_preview = val
	});

	const vinyl_designer_ref = ref<InstanceType<typeof VinylLetteringDesigner> | null>(null);
	const is_mounted = ref(false);
	const vinyl_preview_ready = ref(false);
	let picker_slide_frame_id: number | null = null;

	function cancelPendingPickerSlide() {
		if (typeof window === 'undefined') return;
		if (picker_slide_frame_id === null) return;
		window.cancelAnimationFrame(picker_slide_frame_id);
		picker_slide_frame_id = null;
	}

	function scheduleAnimatedPickerSlideUp() {
		if (typeof window === 'undefined') {
			picker_slid_up.value = true;
			return;
		}

		cancelPendingPickerSlide();
		picker_slid_up.value = false;
		picker_slide_frame_id = window.requestAnimationFrame(() => {
			picker_slide_frame_id = window.requestAnimationFrame(() => {
				picker_slid_up.value = true;
				picker_slide_frame_id = null;
			});
		});
	}

	function resolveCartSizeLabel(entry: Pick<StoredCartState, 'sizeKey' | 'customSizeLabel'>) {
		if (entry.customSizeLabel) return entry.customSizeLabel;
		if (entry.sizeKey === 'custom') return '';
		return t(`product.sizes.${entry.sizeKey}.label`);
	}

	const size_option_models = computed(() =>
		size_options.map((size) => ({
			key: size,
			...sizeLabelParts(size),
		}))
	);

	const selected_product = computed(() => {
		if (!selected_id.value) return null;
		return (
			category_data.value.products.find((item) => item.id === selected_id.value) ||
            null
		);
	});

	// Use pricing from the selection store which is updated by quote handler
	// QuantitySpec doesn't have unitPrice/discount directly, we derive them or fallback
	const subtotal = computed(() => {
		const total_price = selectionStore.quantity?.price ?? 0;
		// If we don't have unit price from API, we can't easily show subtotal vs total discount
		// But we can show it if we have the breakdown logic here
		return total_price; // Fallback for now if breakdown is missing
	});

	const total = computed(() => selectionStore.quantity?.price ?? 0);
	const discount_rate = ref(0); // This could be passed from quote handler if available

	const pricing_ready = computed(() => Boolean(selectionStore.quantity?.price));

	const has_uploaded_artwork = computed(
		() => Boolean(artwork_file.value || artwork_preview_url.value)
	);

	const is_loading_features = computed(() => {
		const has_data = (quoteHandler.featured_sizes.value?.length || 0) > 0;
		const normalize = (slug: string | undefined) => slug?.replace(/-sticker$/, '') || '';

		const target_slug = normalize(quoteHandler.url_slug.value);
		const loaded_slug = normalize(quoteHandler.product.value?.url_slug);

		// 1. Initial load (no data at all)
		if (!has_data) {
			// Even if we don't have active data, check if it's in the cache.
			// If it's in the cache, the service will restore it instantly,
			// so we shouldn't show a skeleton.
			if (target_slug && attributeStore.attribute_cache[target_slug]) return false;
			return true;
		}

		// 2. Navigation between different products (stale data prevention)
		if (target_slug !== loaded_slug) {
			// Even if in cache, we stay in 'loading' if a navigation flight is active
			// This prevents the 'pop' before the new component is fully ready
			if (selection_navigation_in_flight.value) return true;

			if (target_slug && attributeStore.attribute_cache[target_slug]) return false;
			return true;
		}

		// 3. Otherwise, use existing data
		return false;
	});
	const active_size_code = computed(() => {
		const store_size = selectionStore.size;
		if (!store_size) return null;

		if (store_size.custom) return 'custom';

		// If it has a code, use it
		if (store_size.code) return store_size.code;

		// Map from ID if needed
		if (typeof store_size.id === 'number') {
			return size_key_by_attribute_id[store_size.id as keyof typeof size_key_by_attribute_id] || null;
		}

		return null;
	});
	const cart_state = ref<StoredCartState[]>([]);
	const cart_items = computed(() =>
		cart_state.value
			.map((entry) => {
				const product = productCatalog[entry.category]?.products.find(
					(item) => item.id === entry.productId
				);
				if (!product) return null;

				return {
					id: entry.id,
					product,
					sizeKey: entry.sizeKey,
					sizeLabel: resolveCartSizeLabel(entry),
					customSizeLabel: entry.customSizeLabel || '',
					qty: entry.qty,
					total: entry.total,
					artworkName: entry.artworkName,
					artworkPreviewUrl: entry.artworkPreviewUrl || '',
				};
			})
			.filter((item): item is NonNullable<typeof item> => Boolean(item))
	);
	const cart_grand_total = computed(() =>
		cart_items.value.reduce((sum, item) => sum + item.total, 0)
	);
	const featured_items = computed(() => {
		return getFeaturedProducts(
			homeProductTypes.map((item) => item.productId),
			selected_id.value
		);
	});
	const cart_item_count = computed(() => cart_items.value.length);
	const cart_artwork_name = computed(
		() => cart_items.value[0]?.artworkName || artwork_file.value?.name || ''
	);
	const cart_artwork_size = computed(() =>
		artwork_file.value ? formatProductFileSize(artwork_file.value.size) : ''
	);
	const cart_artwork_extension = computed(() => {
		const file_name = artwork_file.value?.name || '';
		const parts = file_name.split('.');
		const extension = parts.at(-1);
		return parts.length > 1 && extension ? extension.toLowerCase() : 'file';
	});

	let selection_navigation_timer: ReturnType<typeof setTimeout> | null = null;
	let selection_scroll_locked = false;
	let body_overflow_before_selection_lock = '';
	let overlay_body_scroll_locked = false;
	const selection_navigation_in_flight = ref(false);
	const editing_cart_item_id = ref<string | null>(null);
	let preserve_upload_modal_on_next_route_sync = false;

	watch(
		() => category.value,
		(new_cat, old_cat) => {
			if (new_cat === old_cat) return;

			// If the current route already has a product slug for the new category,
			// skip the reset. The route params watch will handle setting the state.
			// This prevents the "Reset -> Set" flicker during category navigation.
			const route_product = route.params.product;
			const slug = Array.isArray(route_product) ? route_product[0] : route_product;
			if (slug && productSlugToId(slug)) return;

			selected_id.value = null;
			selected_qty.value = quantity_options[0];
			selected_size.value = size_options[0];
			has_picked_product.value = false;
			quoteHandler.clearForm();
		}
	);

	watch(
		() => route.params.product,
		() => {
			applySelectionFromRoute();
			setSelectionScrollLock(false);
			if (preserve_upload_modal_on_next_route_sync) {
				preserve_upload_modal_on_next_route_sync = false;
			} else {
				closeUploadModal();
			}
			closeCartPreview();
		},
		{ immediate: true }
	);

	watch(
		() => upload_modal_open.value || cart_preview_open.value,
		(is_open) => {
			setOverlayBodyScrollLock(is_open);
		}
	);

	onMounted(() => {
		if (typeof window === 'undefined') return;
		is_mounted.value = true;

		cart_state.value = mergePlainProductCartItems(
			normalizeProductCartState(readStoredCartStateFromStorage())
		);

		if (pending_picker_route_animation) {
			picker_slide_transition_enabled.value = true;
			scheduleAnimatedPickerSlideUp();
			pending_picker_route_animation = false;
		}
	});

	function selectProduct(product_id: string) {
		const slug = product_id;
		const normalize = (s: string) => s.replace(/-sticker$/, '');
		const current_base = normalize(route.params.product as string || '');
		const new_base = normalize(slug);

		if (current_base === new_base) {
			selection_navigation_in_flight.value = false;
			return;
		}

		pending_picker_route_animation = true;
		picker_slide_transition_enabled.value = true;
		selection_navigation_in_flight.value = true;

		const target_path = withCountry(`/${category.value}/${slug}`);

		router.push(target_path);

		// Fallback safety to clear flight if navigation hangs
		selection_navigation_timer = setTimeout(() => {
			selection_navigation_in_flight.value = false;
		}, 1000);
	};

	function setSelectionScrollLock(locked: boolean) {
		if (typeof document === 'undefined') return;

		if (locked) {
			if (selection_scroll_locked) return;
			body_overflow_before_selection_lock = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			selection_scroll_locked = true;
			return;
		}

		if (!selection_scroll_locked) return;
		document.body.style.overflow = body_overflow_before_selection_lock;
		selection_scroll_locked = false;
	}

	function setOverlayBodyScrollLock(locked: boolean) {
		if (typeof document === 'undefined') return;

		if (locked) {
			if (overlay_body_scroll_locked) return;
			document.body.style.overflow = 'hidden';
			overlay_body_scroll_locked = true;
			return;
		}

		if (!overlay_body_scroll_locked) return;
		if (!selection_scroll_locked) {
			document.body.style.overflow = body_overflow_before_selection_lock;
		}
		overlay_body_scroll_locked = false;
	}

	function openUploadModal() {
		if (!selected_product.value) return;
		if (!quoteHandler.has_lettering_editor.value) {
			selectionStore.clearLetteringState();
		}
		if (selection_navigation_in_flight.value) {
			preserve_upload_modal_on_next_route_sync = true;
		}
		upload_modal_open.value = true;
	}

	async function proceedToNextStep() {
		if (selection_navigation_in_flight.value || add_to_cart_loading.value) return;

		if (quoteHandler.has_lettering_editor.value) {
			add_to_cart_loading.value = true;
			try {
				const editor = vinyl_designer_ref.value;
				if (!editor) return;

				const blob = await editor.generateImage();
				if (!blob) return;

				const file = new File([blob], 'lettering.png', { type: 'image/png' });
				quoteHandler.letteringFileUpdate(file);

				const dispatched = await quoteHandler.dispatchItem();
				if (!dispatched) return;

				openCartPreview();
				return;
			} finally {
				add_to_cart_loading.value = false;
			}
		}

		openUploadModal();
	}

	function closeUploadModal() {
		upload_modal_open.value = false;
		editing_cart_item_id.value = null;
	}

	function closeCartPreview() {
		uploadStore.closePreview();
	}

	async function proceedToCart() {
		if (add_to_cart_loading.value) return;
		add_to_cart_loading.value = true;
		try {
			await new Promise((resolve) => setTimeout(resolve, 450));
			editing_cart_item_id.value = null;
			uploadStore.clearArtwork();
			openCartPreview();
		} finally {
			add_to_cart_loading.value = false;
		}
	}

	function removeCartItem(item_id: string) {
		const next_state = cart_state.value.filter((item) => item.id !== item_id);
		cart_state.value = next_state;
		writeStoredCartStateToStorage(next_state);
	}

	function updateCartItem(item_id: string, next_size_key: string, next_qty: number, custom_size_label = '') {
		const qty = Number(next_qty);
		if (!Number.isFinite(qty) || qty <= 0) return;

		const normalized_size_key = size_options.includes(
			next_size_key as (typeof size_options)[number]
		)
			? next_size_key
			: 'custom';

		const next_state = mergePlainProductCartItems(
			cart_state.value.map((item) => {
				if (item.id !== item_id) return item;
				const unit_price = item.qty > 0 ? item.total / item.qty : 0;
				return {
					...item,
					sizeKey: normalized_size_key,
					customSizeLabel: normalized_size_key === 'custom' ? custom_size_label : '',
					qty,
					total: unit_price * qty,
				};
			})
		);

		cart_state.value = next_state;
		writeStoredCartStateToStorage(next_state);
	}

	async function editCartItem(item_id: string) {
		const entry = cart_state.value.find((item) => item.id === item_id);
		if (!entry) return;
		editing_cart_item_id.value = item_id;

		if (size_options.includes(entry.sizeKey as (typeof size_options)[number])) {
			selected_size.value = entry.sizeKey as (typeof size_options)[number];
		}
		selected_qty.value = entry.qty;
		selected_id.value = entry.productId;
		has_picked_product.value = true;

		const target_slug = getProductSlugByCategory(entry.productId, entry.category);
		const target_path = withCountry(`/${entry.category}/${target_slug}`);

		if (route.path !== target_path) {
			preserve_upload_modal_on_next_route_sync = true;
			await router.push(target_path);
		}

		if (entry.artworkPreviewUrl) {
			artwork_preview_url.value = entry.artworkPreviewUrl;
			artwork_file.value = null;
		} else {
			uploadStore.clearArtwork();
		}

		upload_modal_open.value = true;
		cart_preview_open.value = false;
	}

	function openCartPreview() {
		uploadStore.closeModal();
		featured_open.value = true;
		uploadStore.openPreview();
	}

	function skipAndUploadLater() {
		editing_cart_item_id.value = null;
		uploadStore.clearArtwork();
		openCartPreview();
	}

	function closeFeaturedItems() {
		featured_open.value = false;
	}

	function featuredStartPrice(product: ProductItem) {
		return formatCurrencyByCountry(defaultStartPriceByProductId(product.id), country.value);
	}

	function quantityPrice(qty: number) {
		const total_price = selectionStore.quantity?.price ?? 0;
		const current_qty = selectionStore.quantity?.nr ?? 1;
		const unit = current_qty > 0 ? total_price / current_qty : 0;
		return unit * qty;
	}

	function getProductName(product: ProductItem) {
		const navigation_key = `product.navigationNames.${product.id}`;
		if (te(navigation_key)) return t(navigation_key);
		return t(`product.items.${product.id}.name`);
	}

	function getProductPageName(product: ProductItem) {
		const page_key = `product.pageNames.${product.id}`;
		if (te(page_key)) return t(page_key);
		return t(`product.items.${product.id}.name`);
	}

	function getProductBlurb(product: ProductItem) {
		return t(`product.items.${product.id}.blurb`);
	}

	function selectSizeByCode(code: string) {
		const store_sizes = attributeStore.sizes;
		if (!store_sizes?.length) return;

		// Find the matching SizeSpec
		const matching = store_sizes.find((ssize) => {
			// Try code match first
			if (ssize.code === code) return true;

			// Try ID mapping match
			const mapped_code = typeof ssize.id === 'number'
				? size_key_by_attribute_id[ssize.id as keyof typeof size_key_by_attribute_id]
				: null;
			return mapped_code === code;
		});

		if (matching) {
			quoteHandler.inputUpdateSize(matching);
		}
	}

	function sizeLabelParts(size_key: string) {
		const label = t(`product.sizes.${size_key}.label`);
		const [name = '', ...rest] = label.split(' ');
		return {
			name,
			dim: rest.join(' '),
		};
	}

	function resolveCatalogProductByApiSlug(slug: string, catalog_products: ProductItem[]) {
		if (!slug) return null;

		return (
			catalog_products.find((item) => item.id === slug)
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
		if (!category.value) return null;
		return getProductIdFromSlug(slug, category.value);
	}

	function applySelectionFromRoute() {
		const route_product = route.params.product;
		const slug = Array.isArray(route_product) ? route_product[0] : route_product;

		if (!slug) {
			selected_id.value = null;
			has_picked_product.value = false;
			return;
		}

		const resolved_id = productSlugToId(slug);
		if (!resolved_id) {
			selected_id.value = null;
			has_picked_product.value = false;
			return;
		}

		selected_id.value = resolved_id;
		has_picked_product.value = true;
		vinyl_preview_ready.value = false;

		if (pending_picker_route_animation) {
			picker_slide_transition_enabled.value = true;

			if (!is_mounted.value) {
				picker_slid_up.value = false;
			}
			else {
				scheduleAnimatedPickerSlideUp();
				pending_picker_route_animation = false;
			}
		}
		else {
			cancelPendingPickerSlide();
			picker_slide_transition_enabled.value = false;
			picker_slid_up.value = true;
		}

		// Ensure quote handler is in sync with route on load
		quoteHandler.instatiateForm(slug);
		if (!quoteHandler.has_lettering_editor.value) {
			selectionStore.clearLetteringState();
		}
	}

	function setVinylPreviewReady(ready: boolean) {
		vinyl_preview_ready.value = ready;
	}

	function setVinylDesignerRef(instance: InstanceType<typeof VinylLetteringDesigner> | null) {
		vinyl_designer_ref.value = instance;
	}

	onBeforeUnmount(() => {
		if (selection_navigation_timer) {
			clearTimeout(selection_navigation_timer);
			selection_navigation_timer = null;
		}
		cancelPendingPickerSlide();
		picker_slide_transition_enabled.value = false;
		selection_navigation_in_flight.value = false;
		preserve_upload_modal_on_next_route_sync = false;
		setSelectionScrollLock(false);
		setOverlayBodyScrollLock(false);
	});

	const context = {
		// States from Quote Handler
		...quoteHandler,

		// Experience-specific states
		size_feature_cards,
		quantity_options,
		category_data,
		selected_id,
		selected_size,
		selected_qty,
		selection_navigation_in_flight,
		has_picked_product,
		picker_slid_up,
		picker_slide_transition_enabled,
		upload_modal_open,
		add_to_cart_loading,
		cart_preview_open,
		featured_open,
		special_instructions,
		artwork_file,
		artwork_preview_url,
		size_option_models,
		selected_product,
		cart_items,
		cart_grand_total,
		subtotal,
		discount_rate,
		total,
		pricing_ready,
		has_uploaded_artwork,
		is_loading_features,
		active_size_code,
		featured_items,
		cart_item_count,
		cart_artwork_name,
		cart_artwork_size,
		cart_artwork_extension,
		vinyl_preview_ready,

		// Actions
		selectProduct,
		openUploadModal,
		proceedToNextStep,
		closeUploadModal,
		closeCartPreview,
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
		getProductPageName,
		getProductBlurb,
		selectSizeByCode,
		setVinylPreviewReady,
		setVinylDesignerRef,
		letteringWidthUpdate: quoteHandler.letteringWidthInput,
		letteringHeightUpdate: quoteHandler.letteringHeightInput,
		custom_size: quoteHandler.custom_size,
		custom_quantity: quoteHandler.custom_quantity,
	};

	return context;
}

export const ProductExperienceKey: InjectionKey<ReturnType<typeof useProductCategoryExperience>> = Symbol('ProductExperience');

export function provideProductExperience(category: Ref<ProductCategoryKey>, apiProducts?: Ref<Products | undefined>) {
	const experience = useProductCategoryExperience(category, apiProducts);
	provide(ProductExperienceKey, experience);
	return experience;
}

export function useProductExperience() {
	const context = inject(ProductExperienceKey);
	if (!context) {
		throw new Error('useProductExperience must be used within provideProductExperience');
	}
	return context;
}