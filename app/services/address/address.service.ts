import type { AddressFormMap, AddressType } from "~/types/user-address";
import { fetchAddressValidation } from "./api.service";

export async function validateAddress(
	address: AddressFormMap[AddressType]
) {
	const payload = { ...address }
	try {
		const response = await fetchAddressValidation(payload)

		return response
	} catch(error) {
		console.log('error', error);
	}
}