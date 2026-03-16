import { computed } from 'vue';
import { useCountry } from '~/composables/app/country/useCountry';
import { useCheckoutCompletion } from '~/composables/checkout/completion/useCheckoutCompletion';
import { useCheckoutMember } from '~/composables/checkout/member/useCheckoutMember';

export function useCheckoutMemberPage() {
	const { withCountry } = useCountry();
	const {
		t,
		selectedCheckoutItems,
		orderTotal,
		orderDiscount,
		orderShippingFee,
		orderSubtotal,
		formatPrice,
		sizeDimOnly,
		savedShippingAddresses,
		selectedShippingAddressId,
		shipToAnotherAddress,
		selectedShippingMethod,
		selectedPaymentMethod,
		activeShippingMethods,
		activePaymentMethods,
		paymentBrands,
		dropShippingEnabled,
		useShippingAsBilling,
		pointsAvailable,
		pointsToUse,
		couponCode,
		cardNumber,
		expiry,
		cvv,
		useAllPoints,
	} = useCheckoutMember();

	const { completingCheckout, completeLoaderRef, completeCheckout } = useCheckoutCompletion({
		redirectPath: withCountry('/checkout/confirmation'),
	});

	const shippingMethodDetails = computed(() =>
		Object.fromEntries(
			activeShippingMethods.value.map((method) => [
				method.key,
				{
					name: t(`${method.i18nKey}.name`),
					date: t(`${method.i18nKey}.date`),
					price: t(`${method.i18nKey}.price`),
				},
			])
		)
	);

	function itemMeta(sizeLabel: string, qty: number) {
		return `${sizeDimOnly(sizeLabel)} / ${qty.toLocaleString()}pcs.`;
	}

	return {
		withCountry,
		t,
		selectedCheckoutItems,
		orderTotal,
		orderDiscount,
		orderShippingFee,
		orderSubtotal,
		formatPrice,
		sizeDimOnly,
		savedShippingAddresses,
		selectedShippingAddressId,
		shipToAnotherAddress,
		selectedShippingMethod,
		selectedPaymentMethod,
		activeShippingMethods,
		activePaymentMethods,
		paymentBrands,
		dropShippingEnabled,
		useShippingAsBilling,
		pointsAvailable,
		pointsToUse,
		couponCode,
		cardNumber,
		expiry,
		cvv,
		useAllPoints,
		completingCheckout,
		completeLoaderRef,
		completeCheckout,
		shippingMethodDetails,
		itemMeta,
	};
}