import { computed, ref } from 'vue';
import { useCheckoutBase } from '../shared/useCheckoutBase';
import { useCheckoutAddressForm } from '../shared/useCheckoutAddressForm';
import { checkoutMemberPaymentBrands, checkoutPaymentMethods, checkoutShippingMethods } from '~/data/checkout/options';
import { getProfileFieldValue, normalizeAccountName } from '~/utils/account/accountProfile';
import type {
	CheckoutPaymentMethodKey,
	CheckoutShippingMethodKey,
} from '~/types/checkout/options';
import { useUsersStore } from '~/stores/users/users.store';
import type { MemberAddress } from '~/types/checkout';

export function useCheckoutMember() {
	const base = useCheckoutBase();
	const address_form = useCheckoutAddressForm();
	const user_store = useUsersStore();
	const mock_user = useCookie<{ firstName?: string; lastName?: string; email?: string } | null>('mock_user');

	const fields = computed(() => user_store.state.profile?.user_field_values ?? []);
	const normalized_name = computed(() =>
		normalizeAccountName(
			getProfileFieldValue(fields.value, 'first_name') || mock_user.value?.firstName || 'Joy',
			getProfileFieldValue(fields.value, 'last_name') || mock_user.value?.lastName || 'Love'
		)
	);

	// Member specific email
	const member_email = computed(() => user_store.state.email || mock_user.value?.email || 'joy.love@musticker.com');

	const saved_shipping_addresses = computed<MemberAddress[]>(() => [
		{
			id: 'addr-default',
			recipient: `${normalized_name.value.firstName} ${normalized_name.value.lastName}`.trim() || 'Joy Love',
			phone: '+82 (551) 236-4533',
			line1: '176-6, Yusan-ri, Gusan-myeon,',
			line2: 'Gaseong-si, Incheon 01000, Republic of Korea',
			company: 'Summit Inc.',
			label: 'Home',
			isDefault: true,
		},
	]);

	const selected_shipping_address_id = ref(saved_shipping_addresses.value[0]?.id || '');
	const ship_to_another_address = ref(false);

	const selected_shipping_method = ref<CheckoutShippingMethodKey>(
		checkoutShippingMethods.find((method) => method.defaultSelected)?.key || 'express'
	);
	const selected_payment_method = ref<CheckoutPaymentMethodKey>(
		checkoutPaymentMethods.find((method) => method.defaultSelected)?.key || 'credit-card'
	);

	const drop_shipping_enabled = ref(false);
	const points_to_use = ref('');
	const coupon_code = ref('');
	const points_available = ref(13.93);

	// Member specific payment pre-fills
	base.card_number.value = '4242 4242 4242 4242';
	base.expiry.value = '12/28';
	base.cvv.value = '123';

	const selected_shipping_address = computed(
		() => saved_shipping_addresses.value.find((address) => address.id === selected_shipping_address_id.value) || null
	);

	const active_shipping_methods = computed(() =>
		checkoutShippingMethods.filter((method) => method.enabled !== false)
	);
	const active_payment_methods = computed(() =>
		checkoutPaymentMethods.filter((method) => method.enabled !== false)
	);

	function useAllPoints() {
		points_to_use.value = points_available.value.toFixed(2);
	}

	return {
		...base,
		...address_form, // For "Ship to another address" fields
		member_email,
		saved_shipping_addresses,
		selected_shipping_address,
		selected_shipping_address_id,
		ship_to_another_address,
		selected_shipping_method,
		selected_payment_method,
		active_shipping_methods,
		active_payment_methods,
		payment_brands: checkoutMemberPaymentBrands,
		drop_shipping_enabled,
		points_available,
		points_to_use,
		coupon_code,
		useAllPoints,
	};
}
