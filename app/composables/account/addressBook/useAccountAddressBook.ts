import { fetchUserAddresses } from "~/services/profile/address.service";
import { useAddressStore } from "~/stores/address/address.store";
import type { AddressType } from "~/types/address";

export function useAccountAddressBook() {
	const address_store = useAddressStore()

	const shipping_address = computed(() => address_store.shipping_address)
	const billing_address = computed(() => address_store.billing_address)
	const drop_address = computed(() => address_store.drop_address)

	async function getAddresses(type: AddressType) {
		try {
			const params = { type }

			const response = await fetchUserAddresses(params)

			if (response.success) {
				if (response.data) {
					address_store.setAddresses(type, response.data)
				}
			}
		} catch {
			console.log('error');
		}
	}

	return {
		shipping_address,
		billing_address,
		drop_address,

		getAddresses
	}
}