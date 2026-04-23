import type { AddressDynamicFields, AddressMap, AddressType } from "~/types/user-address";
import type { ApiResponse } from "~/types/config/api";

/**
 * Cal backend to fetch user addresses
 */
export async function fetchUserAddresses(
	params: Record<string, string>
): Promise<ApiResponse<AddressMap[AddressType][]>> {
	const { $api } = useNuxtApp();

	return $api.get(`/user-address`, { params })
}

/**
 * Fetch dynamic fields
 */
export async function fetchDynamicFields(
): Promise<ApiResponse<AddressDynamicFields[]>> {
	const { $api } = useNuxtApp();

	return $api.get('/user-address/fields');
}

/**
 * Add user address
 */
export async function addUserAddress(
	params: Record<string, unknown>
): Promise<ApiResponse<AddressMap[AddressType]>> {
	const { $api } = useNuxtApp()

	return $api.post('/user-address', params);
}

/**
 * Update user address
 */
export async function updateUserAddress(
	id: number,
	params: Record<string, unknown>
): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return $api.put(`/user-address/${id}`, params);
}

/**
 * Delete user address
 */
export async function deleteUserAddress(
	id: number,
): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return $api.delete(`/user-address/${id}`);
}

/**
 * Set user address to default
 */
export async function setDefault(
	id: number,
): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return $api.put(`/user-address/${id}/default`);
}