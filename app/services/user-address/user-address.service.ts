import type { AddressType } from "~/types/user-address";
import { addUserAddress, deleteUserAddress, fetchUserAddresses, updateUserAddress } from "./api.service";
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

export async function createUserAddress(payload: Record<string, unknown>) {
	const store = useUserAddressStore()

	if (store.isLoading('create')) return

	store.startLoading('create')

	try {
		const response = await addUserAddress(payload)

		return response
	} catch (error) {
		console.log('error', error);
	} finally {
		store.stopLoading('create')
	}
}

export async function updateAddress(
	id: number,
	payload: Record<string, unknown>
) {
	const store = useUserAddressStore()

	if (store.isLoading('update')) return

	store.startLoading('update')

	try {
		const response = await updateUserAddress(id, payload)

		return response
	} catch (error) {
		console.log('error', error);
	} finally {
		store.stopLoading('update')
	}
}

export async function deleteAddress(id: number) {
	const store = useUserAddressStore()

	if (store.isLoading('delete')) return

	store.startLoading('delete')

	try {
		const response = await deleteUserAddress(id)

		return response
	} catch (error) {
		console.log('error', error);
	} finally {
		store.stopLoading('delete')
	}
}