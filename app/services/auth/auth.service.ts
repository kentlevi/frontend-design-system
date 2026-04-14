import { useUsersStore } from '~/stores/users/users.store';
import { getCurrentAuthenticatedUser, logout } from '~/services/auth/api.service'

export const fetchAndStoreUser = async () => {
    const user_store = useUsersStore()
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

export const logoutUser = async () => {
    const user_store = useUsersStore()

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