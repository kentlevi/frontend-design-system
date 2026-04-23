import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { useUsersStore } from '../users/users.store';
import type { FeaturedDataResponse } from '~/types/products/attributes';
import type { CartItem, CartRow } from '~/types/cart/cart';
import { productCatalog } from '~/data/products/catalog';
import type { ProductCategory } from '~/types/products/catalog';
import { homeProductTypePathById } from '~/data/products/homeTypes';
import { featuredProducts } from '~/data/products/featured';
import type { LocalizedCatalogProduct } from '~/helpers/cart/cartState.helper';
import { cartPaymentOptions } from '~/data/cart/page';

export type CartEmptyProduct = {
	id: string;
	label: string;
	image: string;
	to: string;
};

export const useCartStore = defineStore('cart-static', () => {
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
	const empty_featured_products = computed<CartEmptyProduct[]>(() => featuredProducts.map(p => ({
		id: p.id,
		label: p.name,
		image: p.image,
		to: homeProductTypePathById[p.id] || `/stickers/${p.id}`,
	})));

	const is_authenticated = computed(() => user_store.state?.id ?? null);

	const empty_discover_products = computed<CartEmptyProduct[]>(() => {
		const featured_ids = new Set(empty_featured_products.value.map(p => p.id));
		const products: CartEmptyProduct[] = [];

		for (const category of Object.values(productCatalog)) {
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
			const itemId = item.id ? String(item.id) : (item.local_identity || 'unknown');

			// Resolve product info from catalog
			// Note: This logic previously existed in helper/composable,
			// now consolidated for global access.
			let resolvedProduct: LocalizedCatalogProduct | null = null;
			for (const category of Object.values(productCatalog) as ProductCategory[]) {
				const product = category.products.find(p => p.id === item.product || p.name === item.product);
				if (product) {
					resolvedProduct = {
						...product,
						name: product.name, // In a real app, this would use i18n
					};
					break;
				}
			}

			// Fallback if not found in catalog
			if (!resolvedProduct) {
				resolvedProduct = {
					id: item.product || 'unknown',
					name: item.product || 'Unknown Product',
					icon: 'regular-info-circle',
					image: item.product_thumbnail || '',
					blurb: '',
				};
			}

			return {
				id: itemId,
				image: item.product_thumbnail || resolvedProduct.image,
				title: resolvedProduct.name,
				metadata: `${item.width}x${item.height}"`,
				url_slug: item.url_slug || resolvedProduct.id,
				width: item.width,
				height: item.height,
				qty: item.quantity,
				total: item.cost,
				sizeKey: `${item.width}x${item.height}`,
				sizeLabel: `${item.width}x${item.height}"`,
				customSizeLabel: '',
				rawItem: item,
				product: resolvedProduct,
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
		return items.value.find(item => {
			const currentId = item.id ? String(item.id) : (item.local_identity || 'unknown');
			return currentId === editing_item_id.value;
		}) ?? null;
	});

	const openEditModal = (itemId: string, mode: 'full' | 'size' = 'full') => {
		editing_item_id.value = itemId;
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
			const itemId = item.id ? String(item.id) : (item.local_identity || 'unknown');
			return !ids.includes(itemId);
		});
		selected_ids.value = selected_ids.value.filter(id => !ids.includes(id));
		updateTotals();
	};

	const updateItemQty = (itemId: string, qty: number) => {
		const index = items.value.findIndex(item => {
			const currentId = item.id ? String(item.id) : (item.local_identity || 'unknown');
			return currentId === itemId;
		});
		if (index !== -1 && items.value[index]) {
			const item = items.value[index];
			const unitPrice = item.quantity > 0 ? item.cost / item.quantity : 0;
			items.value[index] = {
				...item,
				quantity: qty,
				cost: unitPrice * qty
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

	const updateItemSize = (itemId: string, width: number, height: number) => {
		const index = items.value.findIndex(item => {
			const currentId = item.id ? String(item.id) : (item.local_identity || 'unknown');
			return currentId === itemId;
		});
		if (index !== -1 && items.value[index]) {
			items.value[index] = {
				...items.value[index],
				width,
				height,
			};
		}
	};

	const updateItemArtworkDetails = (itemId: string, details: {
		artworkName: string;
		artworkSizeLabel: string;
		artworkPreviewUrl: string;
		specialInstructions: string;
	}) => {
		const index = items.value.findIndex(item => {
			const currentId = item.id ? String(item.id) : (item.local_identity || 'unknown');
			return currentId === itemId;
		});
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
		key: 'mu_static_cart',
		storage: persistedState.localStorage,
		pick: ['items', 'number_of_items', 'grand_total', 'selected_ids', 'has_initialized_demo'],
	}
});