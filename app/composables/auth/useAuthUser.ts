import { useUsersStore } from '~/stores/users/users.store';
import { getCurrentAuthenticatedUser, logout } from '~/services/auth/auth.service'

export function useAuthUser() {
	const userStore = useUsersStore()

	/**
     * Fetch authenticated user and store it
     */
	async function fetchAndStoreUser(): Promise<boolean> {
		try {
			const response = await getCurrentAuthenticatedUser()

			const user = response.data?.user
			const profile = response.data?.profile ?? null

			if (!user) {
				userStore.clearUser()
				return false
			}

			userStore.setUser({
				...user,
				profile
			})

			return true
		} catch {
			userStore.clearUser()
			return false
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

			userStore.clearUser()

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