import { computed } from "vue"
import { useUsersStore } from "~/stores/users/users.store"

/**
 * Get ordered, cleaned profile field values
 */
function getOrderedProfileValues(
	user_store: ReturnType<typeof useUsersStore>
): string[] {
	/** Get all user field values safely */
	const user_field_values = user_store.state.profile?.user_field_values ?? []

	/** Sort, clean, and keep only non-empty values */
	return [...user_field_values]
		.sort(
			(first_value, second_value) =>
				(first_value.sort_order ?? 0) - (second_value.sort_order ?? 0)
		)
		.map((value_item) => value_item.value?.trim() ?? "")
		.filter((value_item) => value_item.length > 0)
}

export function useProfilePhotoDisplay() {
	const user_store = useUsersStore()
	const config = useRuntimeConfig()

	/**
	 * Display full name
	 */
	const display_name = computed(() => {
		return getOrderedProfileValues(user_store).join(" ")
	})

	/**
	 * Display initials
	 */
	const user_initial = computed(() => {
		return getOrderedProfileValues(user_store)
			.map((value_item) => value_item.charAt(0).toUpperCase())
			.join("")
	})

	const user_rank = computed(() => user_store.state.rank ?? null)

	const display_name_rank = computed(() => {
		const name = user_store.state.rank?.name
		const level = user_store.state.rank?.level
		if (!name) return ""
		if (!level) return name
		return `${name} (Level ${level})`
	})

	const rank_src = computed(() => {
		const rank = user_rank.value?.code

		switch (rank) {
			case 'MUSCOUT':
				return '/icons/custom/account/points/badges/badge-sticker-scout.svg'
			case 'MULEADER':
				return '/icons/custom/account/points/badges/badge-label-leader.svg'
			case 'MUBOSS':
				return '/icons/custom/account/points/badges/badge-decal-dynamo.svg'
			case 'MUDYNAMO':
				return '/icons/custom/account/points/badges/badge-bumper-boss.svg'
			default:
				return ''
		}
	})

	/**
	 * Display avatar url
	 */
	const display_avatar = computed(() => {
		/** Get avatar path parts */
		const base_url = config.public.s3_file_url
		const folder_path = user_store.state.profile?.file_path?.file_path
		const file_name = user_store.state.profile?.file_name

		/** Return empty string if avatar is incomplete */
		if (!base_url || !folder_path || !file_name) {
			return ""
		}

		/** Normalize URL parts */
		const normalized_base = base_url.endsWith("/") ? base_url : `${base_url}/`
		const normalized_path = folder_path.startsWith("/") ? folder_path.slice(1) : folder_path

		return `${normalized_base}${normalized_path}${file_name}`
	})

	return {
		display_name,
		display_name_rank,
		rank_src,
		user_initial,
		display_avatar,
		user_rank
	}
}