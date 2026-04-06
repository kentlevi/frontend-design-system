import { setDefault } from "~/services/profile/address.service";
import { useAddressStore } from "~/stores/address";
import type { AddressType } from "~/types/address";

export function useAddressDefaultFlow() {

	/**
     * Store
     */
	const address_store = useAddressStore()

	async function setAddressDefault(type: AddressType, id: number) {
		try {
			const response = await setDefault(id)

			if (response.success) {
				address_store.setDefault(type, id)
			}
		} catch (_error: unknown) {
			console.log(_error);
		}
	}

	return {
		setAddressDefault
	}
}