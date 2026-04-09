import { computed, onMounted, ref } from 'vue';
import { homeProductTypes } from '~/data/products/homeTypes';
import { productCatalog } from '~/data/products/catalog';
import { quantity_options, size_options } from '~/data/products/categoryExperience';
import { cartPaymentOptions } from '~/data/cart/page';
import { getProductSlugByCategory } from '~/helpers/products/productCategory.helper';
import type {
	StoredCartState,
	LocalizedCatalogProduct,
} from '~/helpers/cart/cartState.helper';
import { useCountry } from '~/composables/app/country/useCountry';
import { formatCurrencyByCountry } from '~/utils/currency';
import { sizeDimOnly } from '~/utils/cart';
import type { ProductCategoryKey } from '~/types/products/catalog';

export type CartRow = {
	id: string;
	category: StoredCartState['category'];
	product: LocalizedCatalogProduct;
	sizeKey: string;
	sizeLabel: string;
	customSizeLabel: string;
	qty: number;
	total: number;
	artworkName: string;
	artworkSizeLabel: string;
	specialInstructions: string;
	artworkPreviewUrl: string;
};

export type CartEmptyProduct = {
	id: string;
	label: string;
	image: string;
	to: string;
};

export function useCartPage() {
	const { t } = useI18n();
	const { withCountry, country } = useCountry();
	const router = useRouter();

	const cart_state = ref<CartRow[]>([
		{
			id: '1',
			category: 'stickers',
			product: { id: 'die-cut-sticker', name: 'Die Cut Sticker', icon: 'strong-star', image: '/illustrations/products/stickers/die-cut.svg', blurb: 'Precision-cut shape.' },
			sizeKey: '3x3',
			sizeLabel: '3x3"',
			customSizeLabel: '',
			qty: 50,
			total: 62.50,
			artworkName: 'my-cool-design.png',
			artworkSizeLabel: '1.2 MB',
			specialInstructions: 'Please make the border 2mm thick.',
			artworkPreviewUrl: '/illustrations/products/stickers/die-cut.svg',
		},
		{
			id: '2',
			category: 'stickers',
			product: { id: 'circle-sticker', name: 'Circle Sticker', icon: 'strong-stars', image: '/illustrations/products/stickers/circle.svg', blurb: 'Perfectly round.' },
			sizeKey: '2x2',
			sizeLabel: '2x2"',
			customSizeLabel: '',
			qty: 100,
			total: 85.00,
			artworkName: 'logo.svg',
			artworkSizeLabel: '800 KB',
			specialInstructions: '',
			artworkPreviewUrl: '/illustrations/products/stickers/circle.svg',
		}
	]);
	const selected_ids = ref<string[]>(['1', '2']);

	const rows = computed<CartRow[]>(() => cart_state.value);

	const all_selected = computed({
		get: () => rows.value.length > 0 && selected_ids.value.length === rows.value.length,
		set: (checked: boolean) => {
			selected_ids.value = checked ? rows.value.map((row) => row.id) : [];
		},
	});

	const selected_rows = computed(() =>
		rows.value.filter((row) => selected_ids.value.includes(row.id))
	);
	const featured_product_ids = homeProductTypes.map((item) => item.productId);
	const featured_product_id_set = new Set(featured_product_ids);
	const featured_empty_items = computed<CartEmptyProduct[]>(() =>
		homeProductTypes
			.map((item) => {
				for (const category of Object.values(productCatalog)) {
					const product = category.products.find((entry) => entry.id === item.productId);
					if (!product) continue;

					return {
						id: product.id,
						label: t(`product.items.${product.id}.name`),
						image: item.image,
						to: withCountry(item.to),
					};
				}

				return null;
			})
			.filter((item): item is CartEmptyProduct => Boolean(item))
	);
	const discover_empty_items = computed<CartEmptyProduct[]>(() =>
		(Object.entries(productCatalog) as Array<[ProductCategoryKey, (typeof productCatalog)[ProductCategoryKey]]>)
			.flatMap(([categoryKey, category]) =>
				category.products.map((product) => ({
					id: product.id,
					label: t(`product.items.${product.id}.name`),
					image: product.image,
					to: withCountry(`/${categoryKey}/${getProductSlugByCategory(product.id, categoryKey)}`),
				}))
			)
			.filter((item) => !featured_product_id_set.has(item.id))
	);

	const selected_total = computed(() =>
		selected_rows.value.reduce((sum, row) => sum + row.total, 0)
	);

	const qty_select_options = computed(() =>
		quantity_options.map((qty) => ({
			label: qty.toLocaleString(),
			value: qty,
		}))
	);
	const size_option_models = computed(() =>
		size_options.map((size) => {
			const label = t(`product.sizes.${size}.label`);
			const [name, ...rest] = label.split(' ');

			return {
				key: size,
				name: name || '',
				dim: rest.join(' '),
			};
		})
	);

	function toggleRowSelection(item_id: string, checked: boolean) {
		if (checked) {
			if (!selected_ids.value.includes(item_id)) {
				selected_ids.value = [...selected_ids.value, item_id];
			}
			return;
		}
		selected_ids.value = selected_ids.value.filter((id) => id !== item_id);
	}

	function updateQty(item_id: string, next_qty: number) {
		const qty = Number(next_qty);
		if (!Number.isFinite(qty) || qty <= 0) return;

		cart_state.value = cart_state.value.map((item) => {
			if (item.id !== item_id) return item;
			const unit_price = item.qty > 0 ? item.total / item.qty : 0;

			return {
				...item,
				qty,
				total: unit_price * qty,
			};
		});
	}

	function removeByIds(ids: string[]) {
		if (!ids.length) return;
		cart_state.value = cart_state.value.filter((item) => !ids.includes(item.id));
		selected_ids.value = selected_ids.value.filter((id) => !ids.includes(id));
	}

	function updateItemArtworkDetails(
		item_id: string,
		payload: {
			artworkName: string;
			artworkSizeLabel: string;
			artworkPreviewUrl: string;
			specialInstructions: string;
		}
	) {
		cart_state.value = cart_state.value.map((item) => (
			item.id !== item_id
				? item
				: {
					...item,
					artworkName: payload.artworkName,
					artworkSizeLabel: payload.artworkSizeLabel,
					artworkPreviewUrl: payload.artworkPreviewUrl,
					specialInstructions: payload.specialInstructions,
				}
		));
	}

	function updateSize(item_id: string, next_size_key: string, custom_size_label = '') {
		const normalized_size_key = size_options.includes(
			next_size_key as (typeof size_options)[number]
		)
			? next_size_key
			: 'custom';

		cart_state.value = cart_state.value.map((item) => {
			if (item.id !== item_id) return item;

			return {
				...item,
				sizeKey: normalized_size_key,
				customSizeLabel: normalized_size_key === 'custom' ? custom_size_label : '',
			};
		});
	}

	function goToCheckout() {
		if (!selected_rows.value.length) return;
		if (typeof window !== 'undefined') {
			window.localStorage.setItem('musticker-checkout-selection-v1', JSON.stringify(selected_rows.value.map((row) => row.id)));
		}
		void router.push(withCountry('/checkout'));
	}

	const continue_shopping_path = computed(() => withCountry('/'));

	onMounted(() => {
		// Mocked state already initialized, ignoring storage for now as requested
	});

	return {
		rows,
		selected_ids,
		all_selected,
		selected_rows,
		featured_empty_items,
		discover_empty_items,
		selected_total,
		size_option_models,
		qty_select_options,
		payment_options: cartPaymentOptions,
		continue_shopping_path,
		toggleRowSelection,
		updateQty,
		updateSize,
		updateItemArtworkDetails,
		removeByIds,
		goToCheckout,
		format_price: (value: number) =>
			formatCurrencyByCountry(value, country.value),
		size_dim_only: sizeDimOnly,
	};
}