import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { CART_UPDATED_EVENT } from '~/data/cart/page';
import { quantityOptions, sizeOptions } from '~/data/products/categoryExperience';
import { productCatalog } from '~/data/products/catalog';
import { homeProductTypes } from '~/data/products/homeTypes';
import { defaultStartPriceByProductId } from '~/data/products/pricing';
import { useCountry } from '~/composables/app/country/useCountry';
import {
	readStoredCartStateFromStorage,
	writeStoredCartStateToStorage,
	type StoredCartState,
} from '~/helpers/cart/cartState.helper';
import { normalizeAppPath } from '~/utils/auth/redirect';
import { formatCurrencyByCountry } from '~/utils/currency';
import type { ProductItem } from '~/types/products/catalog';

export function useAppHeaderCartPreview(params: {
	closeAccountMenu: () => void;
	closeLocaleModal: () => void;
	closeSearchModal: () => void;
}) {
	const { t } = useI18n();
	const route = useRoute();
	const { country, withCountry } = useCountry();

	const cart_preview_open = ref(false);
	const cart_featured_open = ref(true);
	const cart_state = ref<StoredCartState[]>([]);

	const all_catalog_products = Object.values(productCatalog).flatMap((category) => category.products);
	const cart_featured_items = computed(() =>
		homeProductTypes
			.map((type_item) => all_catalog_products.find((product) => product.id === type_item.productId))
			.filter((item): item is ProductItem => Boolean(item))
	);

	const cart_items = computed(() =>
		cart_state.value
			.map((entry) => {
				for (const category of Object.values(productCatalog)) {
					const product = category.products.find((item) => item.id === entry.productId);
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

	const cart_grand_total = computed(() =>
		cart_items.value.reduce((sum, item) => sum + item.total, 0)
	);
	const cart_item_count = computed(() => cart_items.value.length);
	const is_cart_page = computed(
		() => normalizeAppPath(route.path) === normalizeAppPath(withCountry('/cart'))
	);
	const cart_size_option_models = computed(() =>
		sizeOptions.map((size) => {
			const label = t(`product.sizes.${size}.label`);
			const [name, ...rest] = label.split(' ');

			return {
				key: size,
				name: name || '',
				dim: rest.join(' '),
			};
		})
	);
	const cart_quantity_options = computed<number[]>(() => [...quantityOptions]);

	function formatCartPrice(value: number) {
		return formatCurrencyByCountry(value, country.value);
	}

	function getCartProductName(product: ProductItem) {
		return t(`product.items.${product.id}.name`);
	}

	function cartFeaturedStartPrice(product: ProductItem) {
		return formatCartPrice(defaultStartPriceByProductId(product.id));
	}

	function syncCartFromStorage() {
		cart_state.value = readStoredCartStateFromStorage();
	}

	function writeCartState(next: StoredCartState[]) {
		cart_state.value = next;
		writeStoredCartStateToStorage(next);
	}

	function openCartPreview() {
		if (is_cart_page.value) {
			if (typeof window !== 'undefined') {
				window.location.assign(withCountry('/cart'));
			}
			return;
		}

		params.closeAccountMenu();
		params.closeLocaleModal();
		params.closeSearchModal();
		cart_featured_open.value = true;
		cart_preview_open.value = true;
	}

	function closeCartPreview() {
		cart_preview_open.value = false;
	}

	function closeCartFeatured() {
		cart_featured_open.value = false;
	}

	function removeCartItem(item_id: string) {
		writeCartState(cart_state.value.filter((item) => item.id !== item_id));
	}

	function updateCartItem(item_id: string, next_size_key: string, next_qty: number) {
		const qty = Number(next_qty);
		if (!Number.isFinite(qty) || qty <= 0) return;

		const normalized_size_key = sizeOptions.includes(
			next_size_key as (typeof sizeOptions)[number]
		)
			? next_size_key
			: sizeOptions[0];

		writeCartState(
			cart_state.value.map((item) => {
				if (item.id !== item_id) return item;
				const unit_price = item.qty > 0 ? item.total / item.qty : 0;

				return {
					...item,
					sizeKey: normalized_size_key,
					qty,
					total: unit_price * qty,
				};
			})
		);
	}

	function handleStorage(event: StorageEvent) {
		if (event.key && event.key !== 'musticker-product-cart-v1') return;
		syncCartFromStorage();
	}

	onMounted(() => {
		if (typeof window === 'undefined') return;

		syncCartFromStorage();
		window.addEventListener('storage', handleStorage);
		window.addEventListener(
			CART_UPDATED_EVENT,
			syncCartFromStorage as EventListener
		);
	});

	onBeforeUnmount(() => {
		if (typeof window === 'undefined') return;

		window.removeEventListener('storage', handleStorage);
		window.removeEventListener(
			CART_UPDATED_EVENT,
			syncCartFromStorage as EventListener
		);
	});

	return {
		cartPreviewOpen: cart_preview_open,
		cartFeaturedOpen: cart_featured_open,
		cartFeaturedItems: cart_featured_items,
		cartItems: cart_items,
		cartGrandTotal: cart_grand_total,
		cartItemCount: cart_item_count,
		cartSizeOptionModels: cart_size_option_models,
		cartQuantityOptions: cart_quantity_options,
		getCartProductName: getCartProductName,
		formatCartPrice: formatCartPrice,
		cartFeaturedStartPrice: cartFeaturedStartPrice,
		openCartPreview: openCartPreview,
		closeCartPreview: closeCartPreview,
		closeCartFeatured: closeCartFeatured,
		removeCartItem: removeCartItem,
		updateCartItem: updateCartItem,
	};
}