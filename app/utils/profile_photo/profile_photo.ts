import { useUsersStore } from "~/stores/users/users.store"

export const user_initial = computed(() => {
	/** Store */
	const user_store = useUsersStore()

	/**
     * Get all dynamic field values from profile
     */
	const user_field_values = user_store.state.profile?.user_field_values ?? []

	/**
     * Build initials from the first letter of each field
     */
	return [...user_field_values]
		.sort(
			(first_value, second_value) =>
				(first_value.sort_order ?? 0) - (second_value.sort_order ?? 0)
		)
		.map((val) => val.value?.trim() ?? '')
		.filter((value) => value.length > 0)
		.map((value) => value.charAt(0).toUpperCase())
		.join('')
})

export const display_avatar = computed(() => {
	/** Store */
	const user_store = useUsersStore()
	const config = useRuntimeConfig()

	/** Get avatar path parts */
	const base_url = config.public.s3_file_url
	const folder_path = user_store.state.profile?.file_path?.file_path
	const file_name = user_store.state.profile?.file_name

	/** Return empty string if avatar is incomplete */
	if (!base_url || !folder_path || !file_name) {
		return ''
	}

	/** Normalize URL parts */
	const normalized_base = base_url.endsWith('/') ? base_url : `${base_url}/`
	const normalized_path = folder_path.startsWith('/') ? folder_path.slice(1) : folder_path

	return `${normalized_base}${normalized_path}${file_name}`
})