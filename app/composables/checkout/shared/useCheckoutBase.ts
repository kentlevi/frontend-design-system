import { computed, onMounted, ref } from 'vue';
import {
	readCheckoutSelectionIdsFromStorage,
	readStoredCartStateFromStorage,
	resolveStoredCartProduct,
	type StoredCartState,
} from '~/helpers/cart/cartState.helper';
import { useCountry } from '~/composables/app/country/useCountry';
import type { SupportedCountry } from '~/constants/countries';
import { formatCurrencyByCountry } from '~/utils/currency';
import { sizeDimOnly } from '~/utils/cart';
import type { CheckoutItem } from '~/types/checkout';

type UseCheckoutBaseOptions = {
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

export function useCheckoutBase(options: UseCheckoutBaseOptions = {}) {
	const { t: translate } = useI18n();
	const { $i18n } = useNuxtApp();
	const { country } = useCountry();

	function resolveSizeLabel(sizeKey: string) {
		if (sizeKey === 'custom') return '';

		if (!options.labelCountry) {
			return translate(`product.sizes.${sizeKey}.label`);
		}

		const localized_label =
			typeof $i18n?.getLocaleMessage === 'function'
				? readNestedString($i18n.getLocaleMessage(options.labelCountry), [
					'product',
					'sizes',
					sizeKey,
					'label',
				])
				: null;

		return localized_label || translate(`product.sizes.${sizeKey}.label`);
	}

	const cart_state = ref<StoredCartState[]>([]);
	const selected_item_ids = ref<string[]>([]);

	// Generic Payment Refs (shared by all)
	const card_number = ref('');
	const expiry = ref('');
	const cvv = ref('');

	const checkout_items = computed<CheckoutItem[]>(() =>
		cart_state.value
			.map((entry) => {
				const product = resolveStoredCartProduct(
					entry,
					(productId) => translate(`product.items.${productId}.name`)
				);
				if (!product) return null;

				return {
					id: entry.id,
					product,
					sizeLabel: entry.customSizeLabel || resolveSizeLabel(entry.sizeKey),
					qty: entry.qty,
					total: entry.total,
					artworkPreviewUrl: entry.artworkPreviewUrl || '',
				};
			})
			.filter((item): item is CheckoutItem => Boolean(item))
	);

	const selected_checkout_items = computed(() => {
		if (!selected_item_ids.value.length) return checkout_items.value;
		const selected = checkout_items.value.filter((item) =>
			selected_item_ids.value.includes(item.id)
		);
		return selected.length ? selected : checkout_items.value;
	});

	const order_total = computed(() =>
		selected_checkout_items.value.reduce((sum, item) => sum + item.total, 0)
	);
	const order_discount = computed(() => 0);
	const order_shipping_fee = computed(() => 0);
	const order_subtotal = computed(
		() => order_total.value + order_discount.value - order_shipping_fee.value
	);

	const formatPrice = (value: number) => formatCurrencyByCountry(value, country.value);

	onMounted(() => {
		cart_state.value = readStoredCartStateFromStorage();
		selected_item_ids.value = readCheckoutSelectionIdsFromStorage();
	});

	return {
		t,
		country,
		selected_checkout_items,
		order_total,
		order_discount,
		order_shipping_fee,
		order_subtotal,
		formatPrice,
		sizeDimOnly,
		resolveSizeLabel,
		card_number,
		expiry,
		cvv,
	};
}