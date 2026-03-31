import { useUsersStore } from "~/stores/users/users.store";

export function useSocialAccount() {

	/** Store */
	const user_store = useUsersStore()

	const social = computed(() => user_store.state.social)

	return {
		social
	}
}