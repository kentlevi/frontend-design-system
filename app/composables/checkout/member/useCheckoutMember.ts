import { computed, ref } from 'vue';
import { checkoutPaymentBrands, checkoutPaymentMethods, checkoutShippingMethods } from '~/data/checkout/options';
import { useCheckoutGuest } from '~/composables/checkout/guest/useCheckoutGuest';
import { getProfileFieldValue, normalizeAccountName } from '~/utils/account/accountProfile';
import type {
	CheckoutPaymentMethodKey,
	CheckoutShippingMethodKey,
} from '~/types/checkout/options';

type MemberAddress = {
	id: string;
	recipient: string;
	line1: string;
	line2: string;
	isDefault?: boolean;
};

export function useCheckoutMember() {
	const { t } = useI18n();
	const userStore = useUserStore();
	const mockUser = useCookie<{ firstName?: string; lastName?: string; email?: string } | null>('mock_user');

	const fields = computed(() => userStore.profile?.user_field_values ?? []);
	const normalizedName = computed(() =>
		normalizeAccountName(
			getProfileFieldValue(fields.value, 'first_name') || mockUser.value?.firstName || 'Joy',
			getProfileFieldValue(fields.value, 'last_name') || mockUser.value?.lastName || 'Love'
		)
	);

	const guestCheckout = useCheckoutGuest();

	const memberEmail = computed(() => userStore.email || mockUser.value?.email || 'joy.love@musticker.com');
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
	const useShippingAsBilling = ref(true);
	const pointsToUse = ref('');
	const couponCode = ref('');
	const cardNumber = ref('4242 4242 4242 4242');
	const expiry = ref('12/28');
	const cvv = ref('123');

	const pointsAvailable = ref(13.93);
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
		...guestCheckout,
		t,
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
		useShippingAsBilling,
		pointsAvailable,
		pointsToUse,
		couponCode,
		cardNumber,
		expiry,
		cvv,
		useAllPoints,
	};
}