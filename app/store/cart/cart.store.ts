import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useUsersStore } from '~/stores/users/users.store';
import type { FeaturedDataResponse } from '~/types/products/attributes';
import type { CartItem, CartRow } from '~/types/cart/cart';
import { productCatalog } from '~/utils/products/catalog';
import { homeProductTypePathById } from '~/utils/products/homeTypes';
import { featuredProducts } from '~/utils/products/featured';
import type { LocalizedCatalogProduct } from '~/utils/cart/cartState.helper';
import { cartPaymentOptions } from '~/utils/cart/page';

export type CartEmptyProduct = {
	id: string;
	label: string;
	image: string;
	to: string;
};

export const useCartStore = defineStore('cart', () => {
	const user_store = useUsersStore();

	const items = ref<CartItem[]>([]);
	const loading = ref<boolean>(true);
	const number_of_items = ref<number>(0);
	const grand_total = ref<number>(0);
	const selected_ids = ref<string[]>([]);
	const has_initialized_demo = ref<boolean>(false);

	const cart_user_id = computed(() => user_store.state?.id ?? null);
	const selected_item = ref<CartItem | null>(null);
	const selected_item_id = computed(() => selected_item.value && selected_item.value.id ? selected_item.value.id : null);
	const featured_data = ref<FeaturedDataResponse | null>(null);

	const payment_options = computed(() => cartPaymentOptions);

	// Empty state recommendations
	const empty_featured_products = computed<CartEmptyProduct[]>(() => featuredProducts.map((p: { id: string; name: string; image: string }) => ({
		id: p.id,
		label: p.name,
		image: p.image,
		to: homeProductTypePathById[p.id] || `/stickers/${p.id}`,
	})));

	const is_authenticated = computed(() => user_store.state?.id ?? null);

	const empty_discover_products = computed<CartEmptyProduct[]>(() => {
		const featured_ids = new Set(empty_featured_products.value.map(p => p.id));
		const products: CartEmptyProduct[] = [];

		for (const category of Object.values(productCatalog) as { key: string; products: Array<{ id: string; name: string; image: string }> }[]) {
			for (const product of category.products) {
				if (!featured_ids.has(product.id)) {
					// Resolve path: use home map or fallback to category-based convention
					const to = homeProductTypePathById[product.id] || `/${category.key}/${product.id}`;

					products.push({
						id: product.id,
						label: product.name,
						image: product.image,
						to,
					});
				}
			}
		}

		return products;
	});

	// Derived Rows for UI
	const rows = computed<CartRow[]>(() => {
		return items.value.map((item) => {
			const item_id = item.id ? String(item.id) : (item.local_identity || 'unknown');

			// Resolve product info from catalog
			// Note: This logic previously existed in helper/composable,
			// now consolidated for global access.
			let resolved_product: LocalizedCatalogProduct | null = null;
			for (const category of Object.values(productCatalog) as { key: string; products: Array<{ id: string; name: string; image: string; icon?: string; blurb?: string }> }[]) {
				const product = category.products.find(p => p.id === item.product || p.name === item.product);
				if (product) {
					resolved_product = {
						...product,
						name: product.name, // In a real app, this would use i18n
					};
					break;
				}
			}

			// Fallback if not found in catalog
			if (!resolved_product) {
				resolved_product = {
					id: item.product || 'unknown',
					name: item.product || 'Unknown Product',
					icon: 'regular-info-circle',
					image: item.product_thumbnail || '',
					blurb: '',
				};
			}

			return {
				id: item_id,
				image: item.product_thumbnail || resolved_product.image,
				title: resolved_product.name,
				metadata: `${item.width}x${item.height}"`,
				url_slug: item.url_slug || resolved_product.id,
				width: item.width,
				height: item.height,
				qty: item.quantity,
				total: item.cost,
				sizeKey: `${item.width}x${item.height}`,
				sizeLabel: `${item.width}x${item.height}"`,
				customSizeLabel: '',
				rawItem: item,
				product: resolved_product,
				category: (item as CartItem & { category?: string }).category || 'stickers',
				artworkName: item.artwork_file_name || '',
				artworkSizeLabel: '',
				specialInstructions: item.instruction || '',
				artworkPreviewUrl: item.artwork_preview || '',
				artwork_file_name: item.artwork_file_name,
				artwork_file: item.artwork_file,
				product_thumbnail: item.product_thumbnail,
				file_path: item.file_path,
			} as CartRow;
		});
	});

	const all_selected = computed({
		get: () => rows.value.length > 0 && selected_ids.value.length === rows.value.length,
		set: (checked: boolean) => {
			selected_ids.value = checked ? rows.value.map((row) => row.id) : [];
		},
	});

	const selected_total = computed(() => {
		return rows.value
			.filter(row => selected_ids.value.includes(row.id))
			.reduce((sum, row) => sum + row.total, 0);
	});

	watch(cart_user_id, (next, prev) => {
		// Only clear the cart if the user specifically changes
		// (e.g. logging out or switching accounts).
		// We ignore the transition from Guest (0/null) to a real ID
		// which typically happens during hard-refresh re-authentication.
		if (prev !== undefined && prev !== 0 && prev !== null && next !== prev) {
			empty();
		}
	});

	// Edit modal state
	const edit_modal_open = ref(false);
	const edit_mode = ref<'full' | 'size'>('full');
	const editing_item_id = ref<string | null>(null);

	const editing_item = computed(() => {
		if (!editing_item_id.value) return null;
		return items.value.find(item => String(item.id) === editing_item_id.value) ?? null;
	});

	const openEditModal = (item_id: string, mode: 'full' | 'size' = 'full') => {
		editing_item_id.value = item_id;
		edit_mode.value = mode;
		edit_modal_open.value = true;
	};

	const closeEditModal = () => {
		edit_modal_open.value = false;
		editing_item_id.value = null;
	};

	const unsave_draft = ref<CartItem[]>([]);
	const deletion_id = ref<string | number | null>(null);
	const deletion_ids = ref<string[]>([]);

	const setForDeleteItem = (id: string | number | null) => {
		deletion_id.value = id;
		deletion_ids.value = [];
	};

	const setForDeleteItems = (ids: string[]) => {
		deletion_ids.value = ids;
		deletion_id.value = null;
	};

	const removeByIds = (ids: string[]) => {
		items.value = items.value.filter(item => {
			const item_id = item.id ? String(item.id) : (item.local_identity || 'unknown');
			return !ids.includes(item_id);
		});
		selected_ids.value = selected_ids.value.filter(id => !ids.includes(id));
		updateTotals();
	};

	const updateItemQty = (item_id: string, qty: number) => {
		const index = items.value.findIndex(item => String(item.id) === item_id);
		if (index !== -1 && items.value[index]) {
			const item = items.value[index];
			const unit_price = item.quantity > 0 ? item.cost / item.quantity : 0;
			items.value[index] = {
				...item,
				quantity: qty,
				cost: unit_price * qty
			};
			updateTotals();
		}
	};

	function updateTotals() {
		number_of_items.value = items.value.length;
		grand_total.value = items.value.reduce((sum: number, item: CartItem) => sum + Number(item.cost), 0);
	}

	const empty = () => {
		items.value = [];
		number_of_items.value = 0;
		grand_total.value = 0;
		selected_ids.value = [];
	};

	const toggleSelection = (id: string, checked: boolean) => {
		if (checked) {
			if (!selected_ids.value.includes(id)) {
				selected_ids.value.push(id);
			}
		} else {
			selected_ids.value = selected_ids.value.filter(i => i !== id);
		}
	};

	const updateItemSize = (item_id: string, width: number, height: number) => {
		const index = items.value.findIndex(item => String(item.id) === item_id);
		if (index !== -1 && items.value[index]) {
			items.value[index] = {
				...items.value[index],
				width,
				height,
			};
		}
	};

	const updateItemArtworkDetails = (item_id: string, details: {
		artworkName: string;
		artworkSizeLabel: string;
		artworkPreviewUrl: string;
		specialInstructions: string;
	}) => {
		const index = items.value.findIndex(item => String(item.id) === item_id);
		if (index !== -1 && items.value[index]) {
			items.value[index] = {
				...items.value[index],
				artwork_file_name: details.artworkName,
				artwork_preview: details.artworkPreviewUrl,
				instruction: details.specialInstructions,
			};
		}
	};

	return {
		items,
		loading,
		rows,
		selected_ids,
		all_selected,
		selected_total,
		payment_options,
		empty_featured_products,
		empty_discover_products,
		number_of_items,
		grand_total,
		cart_user_id,
		is_authenticated,
		unsave_draft,
		deletion_id,
		deletion_ids,
		selected_item,
		selected_item_id,
		featured_data,
		edit_modal_open,
		edit_mode,
		editing_item_id,
		editing_item,
		openEditModal,
		closeEditModal,
		setForDeleteItem,
		setForDeleteItems,
		removeByIds,
		updateItemQty,
		updateItemSize,
		updateItemArtworkDetails,
		toggleSelection,
		empty,
		has_initialized_demo,
	};
}, {
	persist: {
		key: 'mu_cart',
		storage: persistedState.localStorage,
		pick: ['items', 'number_of_items', 'grand_total', 'selected_ids', 'has_initialized_demo'],
	}
});