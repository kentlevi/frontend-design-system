import { defineNuxtPlugin } from '#app'
import { useUserStore } from '@/stores/user'

export default defineNuxtPlugin(async () => {
    interface MeResponse {
        success: boolean;
        message: string;
        data: {
            user?: {
                id: number;
                code: string;
                email: string;
            }
            profile?: {}
        };
        meta: {};
        error: {};
    }

    const api = useApi()
    const userStore = useUserStore()

    const token = useCookie<string | null>('auth_token')

    if (!token.value) {
        userStore.clearUser()
        return
    }

    try {
        const response = await api<MeResponse>('/kr/user/me', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        })

        const { user, profile } = response.data

        if (!user) {
            userStore.clearUser()
            return
        }

        userStore.setUser({
            ...user,
            profile
        })
    } catch (error) {
        userStore.clearUser()
        token.value = null
    }
})