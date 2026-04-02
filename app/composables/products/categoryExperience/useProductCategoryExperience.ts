import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue';
import { useCountry } from '~/composables/app/country/useCountry';
import {
	productCatalog,
} from '~/data/products/catalog';
import { homeProductTypes } from '~/data/products/homeTypes';
import {
	PRODUCT_SELECTION_NAV_DELAY_MS,
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
import { useSelectionStore } from '~/stores/product';
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
import type { Products } from '~/types/navigation/navgiation';

export function useProductCategoryExperience(category: Ref<ProductCategoryKey>, apiProducts?: Ref<Products | undefined>) {
	const { t } = useI18n();
	const route = useRoute();
	const router = useRouter();
	const { withCountry, country } = useCountry();
	const selectionStore = useSelectionStore();
	const size_key_by_attribute_id = {
		1: 'small30',
		2: 'medium75',
		3: 'large100',
		4: 'extraLarge125',
	} as const;

	const category_data = computed<ProductCategory>(() => {
		const catalog_category = productCatalog[category.value];
		const response_products = apiProducts?.value?.products ?? [];

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
	const upload_modal_open = ref(false);
	const add_to_cart_loading = ref(false);
	const cart_preview_open = ref(false);
	const featured_open = ref(true);
	const special_instructions = ref('');
	const artwork_file = ref<File | null>(null);
	const artwork_preview_url = ref('');
	const artwork_input_ref = ref<HTMLInputElement | null>(null);

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

	const unit_price = computed(() => {
		const base =
			category.value === 'stickers'
				? 2.4
				: category.value === 'roll-stickers'
					? 1.7
					: 1.9;
		return Math.max(0.18, base - selected_qty.value / 5000);
	});

	const subtotal = computed(() => unit_price.value * selected_qty.value);
	const discount_rate = computed(() =>
		selected_qty.value >= 1000 ? 0.2 : selected_qty.value >= 300 ? 0.12 : 0.06
	);
	const total = computed(() => subtotal.value * (1 - discount_rate.value));
	const has_uploaded_artwork = computed(
		() => Boolean(artwork_file.value || artwork_preview_url.value)
	);
	const selected_size_label = computed(() =>
		t(`product.sizes.${selected_size.value}.label`)
	);
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

	function resolveUnitPriceForQty(qty: number) {
		const base =
			category.value === 'stickers'
				? 2.4
				: category.value === 'roll-stickers'
					? 1.7
					: 1.9;
		return Math.max(0.18, base - qty / 5000);
	}

	function resolveDiscountRateForQty(qty: number) {
		return qty >= 1000 ? 0.2 : qty >= 300 ? 0.12 : 0.06;
	}

	function resolveCartSizeSelection() {
		const live_size = selectionStore.size;
		const width = live_size?.width ?? null;
		const height = live_size?.height ?? null;
		const has_dimensions =
			typeof width === 'number'
			&& width > 0
			&& typeof height === 'number'
			&& height > 0;

		if (live_size?.custom) {
			return {
				sizeKey: 'custom',
				customSizeLabel: has_dimensions ? `${width}x${height}mm` : '',
			};
		}

		const mapped_size_key =
			typeof live_size?.id === 'number'
				? size_key_by_attribute_id[live_size.id as keyof typeof size_key_by_attribute_id]
				: undefined;

		if (mapped_size_key) {
			return {
				sizeKey: mapped_size_key,
				customSizeLabel: '',
			};
		}

		if (has_dimensions) {
			return {
				sizeKey: 'custom',
				customSizeLabel: `${width}x${height}mm`,
			};
		}

		return {
			sizeKey: selected_size.value,
			customSizeLabel: '',
		};
	}

	let selection_navigation_timer: ReturnType<typeof setTimeout> | null = null;
	let selection_scroll_locked = false;
	let body_overflow_before_selection_lock = '';
	let overlay_body_scroll_locked = false;
	const selection_navigation_in_flight = ref(false);
	const editing_cart_item_id = ref<string | null>(null);
	let preserve_upload_modal_on_next_route_sync = false;

	watch(
		() => category.value,
		() => {
			selected_id.value = null;
			selected_size.value = size_options[0];
			selected_qty.value = quantity_options[0];
			has_picked_product.value = false;
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

	function appendCurrentSelectionToCart(
		artworkName = '',
		artworkPreviewUrlValue = '',
		replaceItemId: string | null = null
	) {
		if (!selected_product.value) {
			applySelectionFromRoute();
		}

		if (!selected_product.value) return false;

		const resolved_qty = selectionStore.quantity?.nr && selectionStore.quantity.nr > 0
			? selectionStore.quantity.nr
			: selected_qty.value;
		const resolved_size = resolveCartSizeSelection();
		const resolved_subtotal = resolveUnitPriceForQty(resolved_qty) * resolved_qty;
		const resolved_total = resolved_subtotal * (1 - resolveDiscountRateForQty(resolved_qty));

		const next_item: StoredCartState = {
			id: generateProductCartItemId(selected_product.value.id),
			category: category.value,
			productId: selected_product.value.id,
			sizeKey: resolved_size.sizeKey,
			customSizeLabel: resolved_size.customSizeLabel,
			qty: resolved_qty,
			total: resolved_total,
			artworkName,
			artworkSizeLabel: cart_artwork_size.value,
			specialInstructions: special_instructions.value,
			artworkPreviewUrl: artworkPreviewUrlValue,
		};

		const base_state = replaceItemId
			? cart_state.value.filter((item) => item.id !== replaceItemId)
			: cart_state.value;
		const next_state = mergePlainProductCartItems([next_item, ...base_state]);
		cart_state.value = next_state;
		writeStoredCartStateToStorage(next_state);
		return true;
	}

	onMounted(() => {
		if (typeof window === 'undefined') return;
		cart_state.value = mergePlainProductCartItems(
			normalizeProductCartState(readStoredCartStateFromStorage())
		);
	});

	function selectProduct(productId: string) {
		selected_id.value = productId;
		has_picked_product.value = true;

		const product_slug = productId;
		const target_path = withCountry(`/${category.value}/${product_slug}`);
		if (route.path === target_path) {
			selection_navigation_in_flight.value = false;
			return;
		}

		const route_product = route.params.product;
		const has_route_product = Array.isArray(route_product)
			? route_product.length > 0
			: Boolean(route_product);

		if (selection_navigation_timer) {
			clearTimeout(selection_navigation_timer);
			selection_navigation_timer = null;
		}

		if (has_route_product) {
			selection_navigation_in_flight.value = true;
			void router.push(target_path).finally(() => {
				selection_navigation_in_flight.value = false;
			});
			return;
		}

		setSelectionScrollLock(true);
		selection_navigation_in_flight.value = true;
		selection_navigation_timer = setTimeout(() => {
			void router.push(target_path).finally(() => {
				selection_navigation_in_flight.value = false;
				setSelectionScrollLock(false);
			});
			selection_navigation_timer = null;
		}, PRODUCT_SELECTION_NAV_DELAY_MS);
	}

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
		if (selection_navigation_in_flight.value) {
			preserve_upload_modal_on_next_route_sync = true;
		}
		upload_modal_open.value = true;
	}

	function closeUploadModal() {
		upload_modal_open.value = false;
		editing_cart_item_id.value = null;
	}

	function closeCartPreview() {
		cart_preview_open.value = false;
	}

	function openFilePicker() {
		artwork_input_ref.value?.click();
	}

	function removeArtwork() {
		artwork_preview_url.value = '';
		artwork_file.value = null;
		if (artwork_input_ref.value) {
			artwork_input_ref.value.value = '';
		}
	}

	async function onArtworkSelected(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		artwork_file.value = file;
		artwork_preview_url.value = file.type.startsWith('image/')
			? await readProductArtworkAsDataUrl(file)
			: '';
	}

	async function proceedToCart() {
		if (add_to_cart_loading.value) return;
		add_to_cart_loading.value = true;
		try {
			await new Promise((resolve) => setTimeout(resolve, 450));
			const appended = appendCurrentSelectionToCart(
				artwork_file.value?.name || '',
				artwork_preview_url.value,
				editing_cart_item_id.value
			);
			if (appended) {
				editing_cart_item_id.value = null;
				removeArtwork();
				openCartPreview();
			}
		} finally {
			add_to_cart_loading.value = false;
		}
	}

	function removeCartItem(itemId: string) {
		const next_state = cart_state.value.filter((item) => item.id !== itemId);
		cart_state.value = next_state;
		writeStoredCartStateToStorage(next_state);
	}

	function updateCartItem(itemId: string, nextSizeKey: string, nextQty: number, customSizeLabel = '') {
		const qty = Number(nextQty);
		if (!Number.isFinite(qty) || qty <= 0) return;

		const normalized_size_key = size_options.includes(
			nextSizeKey as (typeof size_options)[number]
		)
			? nextSizeKey
			: 'custom';

		const next_state = mergePlainProductCartItems(
			cart_state.value.map((item) => {
				if (item.id !== itemId) return item;
				const unit_price = item.qty > 0 ? item.total / item.qty : 0;
				return {
					...item,
					sizeKey: normalized_size_key,
					customSizeLabel: normalized_size_key === 'custom' ? customSizeLabel : '',
					qty,
					total: unit_price * qty,
				};
			})
		);

		cart_state.value = next_state;
		writeStoredCartStateToStorage(next_state);
	}

	async function editCartItem(itemId: string) {
		const entry = cart_state.value.find((item) => item.id === itemId);
		if (!entry) return;
		editing_cart_item_id.value = itemId;

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
			removeArtwork();
		}

		upload_modal_open.value = true;
		cart_preview_open.value = false;
	}

	function openCartPreview() {
		upload_modal_open.value = false;
		featured_open.value = true;
		cart_preview_open.value = true;
	}

	function skipAndUploadLater() {
		const appended = appendCurrentSelectionToCart('', '', editing_cart_item_id.value);
		if (appended) {
			editing_cart_item_id.value = null;
			removeArtwork();
			openCartPreview();
		}
	}

	function closeFeaturedItems() {
		featured_open.value = false;
	}

	function featuredStartPrice(product: ProductItem) {
		return formatCurrencyByCountry(defaultStartPriceByProductId(product.id), country.value);
	}

	function quantityPrice(qty: number) {
		return unit_price.value * qty;
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

	function resolveCatalogProductByApiSlug(slug: string, catalogProducts: ProductItem[]) {
		if (!slug) return null;

		return (
			catalogProducts.find((item) => item.id === slug)
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
	}

	onBeforeUnmount(() => {
		if (selection_navigation_timer) {
			clearTimeout(selection_navigation_timer);
			selection_navigation_timer = null;
		}
		selection_navigation_in_flight.value = false;
		preserve_upload_modal_on_next_route_sync = false;
		setSelectionScrollLock(false);
		setOverlayBodyScrollLock(false);
	});

	return {
		size_feature_cards,
		quantity_options,
		category_data,
		selected_id,
		selected_size,
		selected_qty,
		selection_navigation_in_flight,
		has_picked_product,
		upload_modal_open,
		add_to_cart_loading,
		cart_preview_open,
		featured_open,
		special_instructions,
		artwork_file,
		artwork_preview_url,
		artwork_input_ref,
		size_option_models,
		selected_product,
		cart_items,
		cart_grand_total,
		subtotal,
		discount_rate,
		total,
		has_uploaded_artwork,
		selected_size_label,
		featured_items,
		cart_item_count,
		cart_artwork_name,
		cart_artwork_size,
		cart_artwork_extension,
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