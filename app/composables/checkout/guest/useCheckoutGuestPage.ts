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
		formatPrice,
		sizeDimOnly,
	} = useCheckoutGuest();

	const activeShippingMethods = computed(() =>
		checkoutShippingMethods
			.filter((method) => method.enabled !== false)
			.map((method) => ({ ...method }))
	);

	const activePaymentMethods = computed(() =>
		checkoutPaymentMethods
			.filter((method) => method.enabled !== false)
			.map((method) => ({ ...method }))
	);

	const selectedShippingMethod = ref<CheckoutShippingMethodKey>(
		activeShippingMethods.value.find((method) => method.defaultSelected)?.key || 'express'
	);

	const selectedPaymentMethod = ref<CheckoutPaymentMethodKey>(
		activePaymentMethods.value.find((method) => method.defaultSelected)?.key || 'credit-card'
	);

	const fieldValidationByKey = computed(() =>
		Object.fromEntries(checkoutFieldValidation.map((rule) => [rule.fieldKey, rule]))
	);

	const emailLabelText = computed(() => t('checkout.guest.fields.email.label'));

	const { completingCheckout, completeLoaderRef, completeCheckout } = useCheckoutCompletion({
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
		formatPrice,
		activeShippingMethods,
		activePaymentMethods,
		selectedShippingMethod,
		selectedPaymentMethod,
		fieldValidationByKey,
		emailLabelText,
		checkoutPaymentBrands,
		completingCheckout,
		completeLoaderRef,
		completeCheckout,
		itemMeta,
		isLoginModalOpen: is_login_modal_open,
		openLoginModal,
		closeLoginModal,
	};
}