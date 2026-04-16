import type { AddressType } from "~/types/user-address";
import { fetchUserAddresses } from "./api.service";
import { useUserAddressStore } from "~/stores/user-address";

export async function loadAddresses(type: AddressType) {
	const store = useUserAddressStore()

	if (store.isLoading('fetch', type)) return

	store.startLoading('fetch', type)

	try {
		const response = await fetchUserAddresses({ type })

		if (response.success && response.data) {
			store.setAddresses(type, response.data)
		}
	} catch (error) {
		console.log('error', error)
	} finally {
		store.stopLoading('fetch', type)
	}
}