import type { PersonalFormApiResponse, UpdatePersonalFormPayload } from "~/types/account/profile";
import type { ApiResponse } from "~/types/config/api";

/**
 * Update personal form fields
 */
export async function updatePersonalForm(
	payload: UpdatePersonalFormPayload
): Promise<ApiResponse<PersonalFormApiResponse>> {
	const { $api } = useNuxtApp();

	return $api.put(`/profile/fields`, payload)
}