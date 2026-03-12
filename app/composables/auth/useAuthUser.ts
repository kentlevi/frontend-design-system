import { useUserStore } from '~/stores/user'
import { getCurrentAuthenticatedUser } from '~/services/auth/auth.service'

export function useAuthUser() {
    const userStore = useUserStore()

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

    return {
        fetchAndStoreUser
    }
}