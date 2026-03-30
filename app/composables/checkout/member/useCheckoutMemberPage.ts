import { computed } from 'vue';
import { useCountry } from '~/composables/app/country/useCountry';
import { useCheckoutCompletion } from '~/composables/checkout/completion/useCheckoutCompletion';
import { useCheckoutMember } from '~/composables/checkout/member/useCheckoutMember';

export function useCheckoutMemberPage() {
	const { withCountry } = useCountry();
	const {
		t,
		selected_checkout_items,
		order_total,
		order_discount,
		order_shipping_fee,
		order_subtotal,
		formatPrice,
		sizeDimOnly,
		saved_shipping_addresses,
		selected_shipping_address_id,
		ship_to_another_address,
		selected_shipping_method,
		selected_payment_method,
		active_shipping_methods,
		active_payment_methods,
		payment_brands,
		drop_shipping_enabled,
		full_name,
		company,
		address_1,
		address_2,
		province,
		city,
		postal_code,
		phone,
		province_options,
		use_shipping_as_billing,
		points_available,
		points_to_use,
		coupon_code,
		card_number,
		expiry,
		cvv,
		useAllPoints,
	} = useCheckoutMember();

	const { completing_checkout, complete_loader_ref, completeCheckout } = useCheckoutCompletion({
		redirectPath: withCountry('/checkout/confirmation'),
	});

	const shipping_method_details = computed(() =>
		Object.fromEntries(
			active_shipping_methods.value.map((method) => [
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
		selected_checkout_items,
		order_total,
		order_discount,
		order_shipping_fee,
		order_subtotal,
		formatPrice,
		sizeDimOnly,
		saved_shipping_addresses,
		selected_shipping_address_id,
		ship_to_another_address,
		selected_shipping_method,
		selected_payment_method,
		active_shipping_methods,
		active_payment_methods,
		payment_brands,
		drop_shipping_enabled,
		full_name,
		company,
		address_1,
		address_2,
		province,
		city,
		postal_code,
		phone,
		province_options,
		use_shipping_as_billing,
		points_available,
		points_to_use,
		coupon_code,
		card_number,
		expiry,
		cvv,
		useAllPoints,
		completing_checkout,
		complete_loader_ref,
		completeCheckout,
		shipping_method_details,
		itemMeta,
	};
}
