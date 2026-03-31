import type { AddressMap, AddressType } from "~/types/address";
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