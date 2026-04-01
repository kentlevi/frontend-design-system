import type { AddressDynamicFields, AddressMap, AddressType } from "~/types/address";
import type { ApiResponse } from "~/types/config/api";

/**
 * Cal backend to fetch user addresses
 */
export async function fetchUserAddresses(
	params: Record<string, string>
): Promise<ApiResponse<AddressMap[AddressType][]>> {
	const { $api } = useNuxtApp();

	return $api.get(`/address`, { params })
}

/**
 * Fetch dynamic fields
 */
export async function fetchDynamicFields(
): Promise<ApiResponse<AddressDynamicFields[]>> {
	const { $api } = useNuxtApp();

	return $api.get('/address/fields');
}

export async function addUserAddress(
	params: Record<string, unknown>
): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return $api.post('/address', params);
}