import { computed, ref } from 'vue';
import { useCheckoutCompletion } from '~/composables/checkout/completion/useCheckoutCompletion';
import { useCheckoutGuest } from '~/composables/checkout/guest/useCheckoutGuest';
import { useCountry } from '~/composables/app/country/useCountry';
import {
	checkoutFieldValidation,
	checkoutPaymentBrands,
	checkoutPaymentMethods,
	checkoutShippingMethods,
} from '~/data/checkout/options';
import type {
	CheckoutPaymentMethodKey,
	CheckoutShippingMethodKey,
} from '~/types/checkout/options';

export function useCheckoutGuestPage() {
	const { t } = useI18n();
	const { withCountry } = useCountry();
	const is_login_modal_open = ref(false);

	const {
		province_options,
		email,
		full_name,
		company,
		address_1,
		address_2,
		province,
		city,
		postal_code,
		phone,
		card_number,
		expiry,
		cvv,
		use_shipping_as_billing,
		selected_checkout_items,
		order_total,
		order_discount,
		order_shipping_fee,
		order_subtotal,
		formatPrice,
		sizeDimOnly,
	} = useCheckoutGuest();

	const active_shipping_methods = computed(() =>
		checkoutShippingMethods
			.filter((method) => method.enabled !== false)
			.map((method) => ({ ...method }))
	);

	const active_payment_methods = computed(() =>
		checkoutPaymentMethods
			.filter((method) => method.enabled !== false)
			.map((method) => ({ ...method }))
	);

	const selected_shipping_method = ref<CheckoutShippingMethodKey>(
		active_shipping_methods.value.find((method) => method.defaultSelected)?.key || 'express'
	);

	const selected_payment_method = ref<CheckoutPaymentMethodKey>(
		active_payment_methods.value.find((method) => method.defaultSelected)?.key || 'credit-card'
	);

	const field_validation_by_key = computed(() =>
		Object.fromEntries(checkoutFieldValidation.map((rule) => [rule.fieldKey, rule]))
	);

	const email_label_text = computed(() => t('checkout.guest.fields.email.label'));

	const { completing_checkout, complete_loader_ref, completeCheckout } = useCheckoutCompletion({
		redirectPath: withCountry('/checkout/confirmation'),
	});

	function itemMeta(sizeLabel: string, qty: number) {
		return t('checkout.guest.summary.itemMeta', {
			size: sizeDimOnly(sizeLabel),
			qty: qty.toLocaleString(),
		});
	}

	function openLoginModal() {
		is_login_modal_open.value = true;
	}

	function closeLoginModal() {
		is_login_modal_open.value = false;
	}

	return {
		t,
		withCountry,
		province_options,
		email,
		full_name,
		company,
		address_1,
		address_2,
		province,
		city,
		postal_code,
		phone,
		card_number,
		expiry,
		cvv,
		use_shipping_as_billing,
		selected_checkout_items,
		order_total,
		order_discount,
		order_shipping_fee,
		order_subtotal,
		formatPrice,
		active_shipping_methods,
		active_payment_methods,
		selected_shipping_method,
		selected_payment_method,
		field_validation_by_key,
		email_label_text,
		checkout_payment_brands: checkoutPaymentBrands,
		completing_checkout,
		complete_loader_ref,
		completeCheckout,
		itemMeta,
		is_login_modal_open,
		openLoginModal,
		closeLoginModal,
	};
}