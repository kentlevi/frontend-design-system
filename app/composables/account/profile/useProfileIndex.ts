import { ensureDynamicFields } from "~/services/profile-dynamic-fields/dynamic-fields.service";
import { useProfileFieldStore } from "~/stores/users/profile_field.store";

export function useProfileIndex() {
	/**
     * Stores
     */
	const profile_field_store = useProfileFieldStore()


	/**
     * Helpers
     */
	const { t: translate } = useI18n()


	/**
     * Computed
     */
	const is_fetching = computed(() => profile_field_store.isLoading('fetch'))


	ensureDynamicFields()

	return {
		translate,

		is_fetching_fields: is_fetching,
	}
}