import type { AddressDynamicFields } from "~/types/user-address";
import type { ApiResponse } from "~/types/config/api";

/**
 * Fetch dynamic fields
 */
export async function fetchDynamicFields(
): Promise<ApiResponse<AddressDynamicFields[]>> {
	const { $api } = useNuxtApp();

	return $api.get('/user-address/fields');
}