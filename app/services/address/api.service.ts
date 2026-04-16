import type { ApiResponse } from "~/types/config/api";

export async function fetchAddressValidation(
	params: Record<string, unknown>
): Promise<ApiResponse> {
	const { $api } = useNuxtApp()

	return $api.post('/address/validate', params)
}