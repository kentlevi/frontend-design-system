import type { AddressType } from '~/types/user-address';
import { useUserAddressDataContext } from '~/composables/account/addressBook/context/useUserAddressDataContext';

export function useAddressBookSectionUI(props: { section: AddressType }) {

	/**
     * Contexts
     */
	const { shipping_address, billing_address, drop_address, is_loading } = useUserAddressDataContext()

	const { t: translate } = useI18n()

	const address_map = {
		shipping: shipping_address,
		billing: billing_address,
		drop: drop_address,
	}

	const items = computed(() => is_loading.value ? [] : address_map[props.section].value)
	const loading = computed(() => is_loading.value)

	return {
		translate,
		items,
		loading,
	}
}