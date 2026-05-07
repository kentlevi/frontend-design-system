import { useUsersStore } from "~/stores/users/users.store";
import type { UpdatePersonalFormPayload } from "~/types/account/profile";
import { updatePersonalForm } from "./api.service";

export async function editPersonalDetails(
	payload: UpdatePersonalFormPayload
) {
	const store = useUsersStore()

	if (store.isLoading('update', 'dynamic_fields')) return

	store.startLoading('update', 'dynamic_fields')

	try {
		const response = await updatePersonalForm(payload)

		return response
	} catch (_error: unknown) {
		console.log(_error)
	} finally {
		store.stopLoading('update', 'dynamic_fields')
	}
}