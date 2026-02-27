import { defineNuxtPlugin } from '#app'
import { useUserStore } from '@/stores/user'
import {
    COUNTRY_TO_API_COUNTRY,
    DEFAULT_COUNTRY,
    resolveSupportedCountry,
} from '~/constants/countries';

export default defineNuxtPlugin(async (nuxtApp) => {
    type MeUser = {
        id: number;
        code: string;
        email: string;
    };

    interface MeResponse {
        success: boolean;
        message: string;
        data: {
            user?: MeUser;
            profile?: Record<string, unknown>;
        };
        meta: Record<string, unknown>;
        error: unknown;
    }

    const api = useApi();
    const userStore = useUserStore(nuxtApp.$pinia);

    const token = useCookie<string | null>('auth_token');
    const countryCookie = useCookie<string | null>('country');

    if (!token.value) {
        userStore.clearUser();
        return;
    }

    const routeCountry = resolveSupportedCountry(countryCookie.value) || DEFAULT_COUNTRY;
    const apiCountry = COUNTRY_TO_API_COUNTRY[routeCountry];

    try {
        const response = await api<MeResponse>(`/${apiCountry}/user/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        });

        const { user, profile } = response.data;

        if (!user) {
            userStore.clearUser();
            return;
        }

        userStore.setUser({
            ...user,
            profile
        });
    } catch {
        userStore.clearUser();
        token.value = null;
    }
})
