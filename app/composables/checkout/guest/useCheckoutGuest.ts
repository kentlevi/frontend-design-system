import { computed, onMounted, ref } from 'vue';
import { checkoutProvinceOptions } from '~/data/checkout/options';
import type { ProductItem } from '~/types/products/catalog';
import {
	readCheckoutSelectionIdsFromStorage,
	readStoredCartStateFromStorage,
	resolveStoredCartProduct,
	type LocalizedCatalogProduct,
	type StoredCartState,
} from '~/helpers/cart/cartState.helper';
import { useCountry } from '~/composables/app/country/useCountry';
import type { SupportedCountry } from '~/constants/countries';
import { formatCurrencyByCountry } from '~/utils/currency';
import { sizeDimOnly } from '~/utils/cart';

type CheckoutItem = {
	id: string;
	product: ProductItem | LocalizedCatalogProduct;
	sizeLabel: string;
	qty: number;
	total: number;
	artworkPreviewUrl: string;
};

type UseCheckoutGuestOptions = {
	labelCountry?: SupportedCountry;
};

function readNestedString(source: unknown, path: string[]) {
	let current: unknown = source;
	for (const segment of path) {
		if (!current || typeof current !== 'object' || !(segment in current)) return null;
		current = (current as Record<string, unknown>)[segment];
	}
	return typeof current === 'string' ? current : null;
}

export function useCheckoutGuest(options: UseCheckoutGuestOptions = {}) {
	const { t } = useI18n();
	const { $i18n } = useNuxtApp();
	const { country } = useCountry();

	function resolveSizeLabel(sizeKey: string) {
		if (!options.labelCountry) {
			return t(`product.sizes.${sizeKey}.label`);
		}

		const localizedLabel =
			typeof $i18n?.getLocaleMessage === 'function'
				? readNestedString($i18n.getLocaleMessage(options.labelCountry), [
					'product',
					'sizes',
					sizeKey,
					'label',
				])
				: null;

		return localizedLabel || t(`product.sizes.${sizeKey}.label`);
	}

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
				const product = resolveStoredCartProduct(
					entry,
					(productId) => t(`product.items.${productId}.name`)
				);
				if (!product) return null;

				return {
					id: entry.id,
					product,
					sizeLabel: resolveSizeLabel(entry.sizeKey),
					qty: entry.qty,
					total: entry.total,
					artworkPreviewUrl: entry.artworkPreviewUrl || '',
				};
			})
			.filter((item): item is CheckoutItem => Boolean(item))
	);

	const provinceOptions = computed(() =>
		checkoutProvinceOptions
			.filter((option) => option.enabled !== false)
			.map((option) => ({
				value: option.value,
				label: t(option.i18nKey),
			}))
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
		cartState.value = readStoredCartStateFromStorage();
		selectedItemIds.value = readCheckoutSelectionIdsFromStorage();
	});

	return {
		provinceOptions,
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
		formatPrice: (value: number) => formatCurrencyByCountry(value, country.value),
		sizeDimOnly,
	};
}