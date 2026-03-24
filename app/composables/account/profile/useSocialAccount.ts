import { useUsersStore } from "~/stores/users/users.store";

export function useSocialAccount() {

	/** Store */
	const user_store = useUsersStore()

	const account_type = computed(() => user_store.state.account_type ?? 'musticker')

	return {
		account_type
	}
}