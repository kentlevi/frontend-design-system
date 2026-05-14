import type { OverviewApiResponse, OverviewData, PersonalFormApiResponse, UpdatePersonalFormPayload } from "~/types/account/profile";
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


export async function fetchOverview(): Promise<OverviewApiResponse> {
	const { $api } = useNuxtApp()
	const response = await $api.get<OverviewData>(`/profile/overview`)
	return response
}