import { useUsersStore } from '~/stores/users/users.store';
import { getCurrentAuthenticatedUser, logout } from '~/services/auth/auth.service'

export function useAuthUser() {
	const user_store = useUsersStore()

	/**
     * Fetch authenticated user and store it
     */
	async function fetchAndStoreUser(): Promise<boolean> {
		user_store.auth_state_loading = true
		try {
			const response = await getCurrentAuthenticatedUser()

			const user = response.data?.user
			const profile = response.data?.profile ?? null

			if (!user) {
				user_store.clearUser()
				return false
			}

			user_store.setUser({
				...user,
				profile
			})

			return true
		} catch {
			user_store.clearUser()
			return false
		} finally {
			user_store.auth_state_loading = false
			user_store.auth_state_ready = true
		}
	}

	/**
	 * Logout user
	 */
	async function logoutUser(): Promise<boolean> {
		try {
			const response = await logout()

			if (!response.success) {
				return false
			}

			user_store.clearUser()
			user_store.auth_state_loading = false
			user_store.auth_state_ready = true

			await navigateTo('/')

			return true
		} catch (error) {
			console.error(error)
			return false
		}
	}

	return {
		fetchAndStoreUser,
		logoutUser
	}
}