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
import type { MemberAddress, MemberDropShippingAddress } from '~/types/checkout';

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
		{
			id: 'addr-office',
			recipient: `${normalized_name.value.firstName} ${normalized_name.value.lastName}`.trim() || 'Joy Love',
			phone: '+1 (818) 922-5542',
			line1: '9F, 310 Teheran-ro, Gangnam-gu,',
			line2: 'Seoul 06241, Republic of Korea',
			company: 'Lock&Lock Inc.',
			label: 'Office',
		},
		{
			id: 'addr-client',
			recipient: `${normalized_name.value.firstName} ${normalized_name.value.lastName}`.trim() || 'Joy Love',
			phone: '+1 (963) 524-8858',
			line1: '18F, 45 Gwanggyo Jungang-ro, Yeongtong-gu,',
			line2: 'Suwon-si, Gyeonggi-do 41577, Republic of Korea',
			company: 'Lock&Lock Inc.',
			label: 'Client',
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
	const drop_shipping_ship_to_another_address = ref(false);
	const drop_shipping_name = ref(`${normalized_name.value.firstName} ${normalized_name.value.lastName}`.trim() || '');
	const drop_shipping_company = ref('');
	const drop_shipping_addresses = computed<MemberDropShippingAddress[]>(() => [
		{
			id: 'drop-default',
			recipient: 'Donna Miller',
			company: 'Femme Inc.',
			label: 'Client',
			isDefault: true,
		},
		{
			id: 'drop-maria',
			recipient: 'Maria Isabel Santos',
			company: 'Golden Harvest Foods Inc.',
			label: 'Client',
		},
		{
			id: 'drop-jonathan',
			recipient: 'Jonathan Reyes',
			company: '',
			label: 'Home',
		},
		{
			id: 'drop-camille',
			recipient: 'Camille Dela Torre',
			company: '',
			label: 'Office',
		},
		{
			id: 'drop-daniel',
			recipient: 'Daniel Navarro',
			company: 'Vertex Financial Solutions',
			label: 'Client',
		},
		{
			id: 'drop-sophia',
			recipient: 'Sophia Villanueva',
			company: 'EcoSphere Innovations',
			label: 'Client',
		},
	]);
	const selected_drop_shipping_address_id = ref(drop_shipping_addresses.value[0]?.id || '');
	const points_to_use = ref('');
	const coupon_code = ref('');
	const points_available = ref(13.93);
	const billing_addresses = computed<MemberAddress[]>(() => [
		{
			id: 'billing-default',
			recipient: `${normalized_name.value.firstName} ${normalized_name.value.lastName}`.trim() || 'Joy Love',
			phone: '+82 (551) 236-4533',
			line1: '7F, 221 Jungang-daero, Dong-gu,',
			line2: 'Busan 48912, Republic of Korea',
			company: 'Summit Inc.',
			label: 'Home',
			isDefault: true,
			badgeLabel: 'Default Billing',
		},
		{
			id: 'billing-office-1',
			recipient: `${normalized_name.value.firstName} ${normalized_name.value.lastName}`.trim() || 'Joy Love',
			line1: '12F, 45 Teheran-ro, Gangnam-gu,',
			line2: 'Seoul 06133, Republic of Korea',
			company: 'Haneul Tech Co., Ltd.',
			label: 'Office',
		},
		{
			id: 'billing-office-2',
			recipient: `${normalized_name.value.firstName} ${normalized_name.value.lastName}`.trim() || 'Joy Love',
			line1: '5F, 88 Jungang-daero, Jung-gu,',
			line2: 'Busan 48942, Republic of Korea',
			company: 'Busan Marine Logistics Inc.',
			label: 'Office',
		},
		{
			id: 'billing-client',
			recipient: 'Davy Jones',
			line1: '9F, 102 Digital-ro, Guro-gu,',
			line2: 'Seoul 08390, Republic of Korea',
			company: 'Daehan Electronics Co., Ltd.',
			label: 'Client',
		},
	]);
	const selected_billing_address_id = ref(billing_addresses.value[0]?.id || '');
	const billing_use_different_address = ref(false);
	const billing_full_name = ref(`${normalized_name.value.firstName} ${normalized_name.value.lastName}`.trim() || 'Joy Love');
	const billing_company = ref('Summit Inc.');
	const billing_address_1 = ref('176-6, Yusan-ri, Gusan-myeon');
	const billing_address_2 = ref('');
	const billing_province = ref('incheon');
	const billing_city = ref('Gaseong-si');
	const billing_postal_code = ref('01000');

	// Member specific payment pre-fills
	base.card_number.value = '4242 4242 4242 4242';
	base.expiry.value = '12/28';
	base.cvv.value = '123';

	const selected_shipping_address = computed(
		() => saved_shipping_addresses.value.find((address) => address.id === selected_shipping_address_id.value) || null
	);
	const selected_drop_shipping_address = computed(
		() => drop_shipping_addresses.value.find((address) => address.id === selected_drop_shipping_address_id.value) || null
	);
	const selected_billing_address = computed(
		() => billing_addresses.value.find((address) => address.id === selected_billing_address_id.value) || null
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

	function clearPoints() {
		points_to_use.value = '';
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
		drop_shipping_ship_to_another_address,
		drop_shipping_name,
		drop_shipping_company,
		drop_shipping_addresses,
		selected_drop_shipping_address,
		selected_drop_shipping_address_id,
		points_available,
		points_to_use,
		coupon_code,
		billing_addresses,
		selected_billing_address,
		selected_billing_address_id,
		billing_use_different_address,
		billing_full_name,
		billing_company,
		billing_address_1,
		billing_address_2,
		billing_province,
		billing_city,
		billing_postal_code,
		useAllPoints,
		clearPoints,
	};
}