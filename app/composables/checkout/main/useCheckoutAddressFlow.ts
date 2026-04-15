import { fetchUserAddresses } from "~/services/address/api.service"
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import type { AddressMap, AddressType } from "~/types/address";

export const useCheckoutAddressFlow = () => {

	const checkout_store = useMainCheckOutStore()
	const {
		ship_to_another_address,
		// is_shipping_billing
	} = storeToRefs(checkout_store)

	const getShippingAddress = async () => {
		try {
			const response = await fetchUserAddresses({ type: 'shipping' });
			const addresses = response?.data || []
			checkout_store.setSavedShippingAddresses(addresses)

			const default_address = addresses.find((addr: AddressMap[AddressType]) => addr.is_default === true)
			const selected = default_address || addresses[0] || null

			// if (is_shipping_billing)
			// checkout_store.setBillingAddress(selected)

			ship_to_another_address.value = !selected

			return response;

		} catch (error) {
			console.error(error);
		}
	};

	return {
		getShippingAddress
	}


}