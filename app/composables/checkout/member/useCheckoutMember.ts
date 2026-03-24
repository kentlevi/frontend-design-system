import { computed, ref } from 'vue';
import { useCheckoutBase } from '../shared/useCheckoutBase';
import { useCheckoutAddressForm } from '../shared/useCheckoutAddressForm';
import { checkoutPaymentBrands, checkoutPaymentMethods, checkoutShippingMethods } from '~/data/checkout/options';
import { getProfileFieldValue, normalizeAccountName } from '~/utils/account/accountProfile';
import type {
	CheckoutPaymentMethodKey,
	CheckoutShippingMethodKey,
} from '~/types/checkout/options';
import { useUsersStore } from '~/stores/users/users.store';
import type { MemberAddress } from '~/types/checkout';

export function useCheckoutMember() {
	const base = useCheckoutBase();
	const addressForm = useCheckoutAddressForm();
	const userStore = useUsersStore();
	const mockUser = useCookie<{ firstName?: string; lastName?: string; email?: string } | null>('mock_user');

	const fields = computed(() => userStore.state.profile?.user_field_values ?? []);
	const normalizedName = computed(() =>
		normalizeAccountName(
			getProfileFieldValue(fields.value, 'first_name') || mockUser.value?.firstName || 'Joy',
			getProfileFieldValue(fields.value, 'last_name') || mockUser.value?.lastName || 'Love'
		)
	);

	// Member specific email
	const memberEmail = computed(() => userStore.state.email || mockUser.value?.email || 'joy.love@musticker.com');

	const savedShippingAddresses = computed<MemberAddress[]>(() => [
		{
			id: 'addr-default',
			recipient: `${normalizedName.value.firstName} ${normalizedName.value.lastName}`.trim() || 'Joy Love',
			line1: '176-6, Yusan-ri, Gusan-myeon',
			line2: 'Gaseong-si, Incheon 01000, Republic of Korea',
			isDefault: true,
		},
		{
			id: 'addr-2',
			recipient: 'Kevin Love',
			line1: '1485-3 U-dong, 15th Floor, Room 1502',
			line2: 'Haeundae-gu, Busan 48160, Republic of Korea',
		},
	]);

	const selectedShippingAddressId = ref(savedShippingAddresses.value[0]?.id || '');
	const shipToAnotherAddress = ref(false);

	const selectedShippingMethod = ref<CheckoutShippingMethodKey>(
		checkoutShippingMethods.find((method) => method.defaultSelected)?.key || 'express'
	);
	const selectedPaymentMethod = ref<CheckoutPaymentMethodKey>(
		checkoutPaymentMethods.find((method) => method.defaultSelected)?.key || 'credit-card'
	);

	const dropShippingEnabled = ref(false);
	const pointsToUse = ref('');
	const couponCode = ref('');
	const pointsAvailable = ref(13.93);

	// Member specific payment pre-fills
	base.cardNumber.value = '4242 4242 4242 4242';
	base.expiry.value = '12/28';
	base.cvv.value = '123';

	const selectedShippingAddress = computed(
		() => savedShippingAddresses.value.find((address) => address.id === selectedShippingAddressId.value) || null
	);

	const activeShippingMethods = computed(() =>
		checkoutShippingMethods.filter((method) => method.enabled !== false)
	);
	const activePaymentMethods = computed(() =>
		checkoutPaymentMethods.filter((method) => method.enabled !== false)
	);

	function useAllPoints() {
		pointsToUse.value = pointsAvailable.value.toFixed(2);
	}

	return {
		...base,
		...addressForm, // For "Ship to another address" fields
		memberEmail,
		savedShippingAddresses,
		selectedShippingAddress,
		selectedShippingAddressId,
		shipToAnotherAddress,
		selectedShippingMethod,
		selectedPaymentMethod,
		activeShippingMethods,
		activePaymentMethods,
		paymentBrands: checkoutPaymentBrands,
		dropShippingEnabled,
		pointsAvailable,
		pointsToUse,
		couponCode,
		useAllPoints,
	};
}