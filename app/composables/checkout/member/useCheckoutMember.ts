import { computed, ref } from 'vue';
import { useCheckoutBase } from '../shared/useCheckoutBase';
import { checkoutMemberPaymentBrands, checkoutPaymentMethods, checkoutShippingMethods } from '~/data/checkout/options';
import type {
	CheckoutPaymentMethodKey,
	CheckoutShippingMethodKey,
} from '~/types/checkout/options';
import { useUsersStore } from '~/stores/users/users.store';

export function useCheckoutMember() {
	const base = useCheckoutBase();
	const user_store = useUsersStore();
	const mock_user = useCookie<{ firstName?: string; lastName?: string; email?: string } | null>('mock_user');

	// Member specific email
	const member_email = computed(() => user_store.state.email || mock_user.value?.email || 'joy.love@musticker.com');

	const selected_shipping_method = ref<CheckoutShippingMethodKey>(
		checkoutShippingMethods.find((method) => method.defaultSelected)?.key || 'express'
	);
	const selected_payment_method = ref<CheckoutPaymentMethodKey>(
		checkoutPaymentMethods.find((method) => method.defaultSelected)?.key || 'credit-card'
	);
	const points_to_use = ref('');
	const points_available = ref(13.93);

	// Member specific payment pre-fills
	base.card_number.value = '4242 4242 4242 4242';
	base.expiry.value = '12/28';
	base.cvv.value = '123';

	const active_shipping_methods = computed(() =>
		checkoutShippingMethods.filter((method) => method.enabled !== false)
	);
	const active_payment_methods = computed(() =>
		checkoutPaymentMethods.filter((method) => method.enabled !== false)
	);

	function useAllPoints() {
		points_to_use.value = points_available.value.toFixed(2);
	}

	function clearPoints() {
		points_to_use.value = '';
	}

	return {
		...base,
		member_email,
		selected_shipping_method,
		selected_payment_method,
		active_shipping_methods,
		active_payment_methods,
		payment_brands: checkoutMemberPaymentBrands,
		points_available,
		points_to_use,
		useAllPoints,
		clearPoints,
	};
}