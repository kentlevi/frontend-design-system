import { defineNuxtPlugin } from '#app'
import { useUserStore } from '@/stores/user'
import {
	COUNTRY_TO_API_COUNTRY,
	DEFAULT_COUNTRY,
	resolveSupportedCountry,
} from '~/constants/countries';
import { useRoute } from 'vue-router'

export default defineNuxtPlugin(async (nuxtApp) => {
	const route = useRoute();

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

	if (userStore.id || userStore.email) {
		return;
	}

	// Avoid calling `/user/me` for users that are clearly logged out.
	// HttpOnly auth cookies are not readable in JS, so we rely on safe client hints.
	const guestLoginMode = useCookie<string | number | null>('guest_login_mode', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	});
	const mockUser = useCookie<{ email?: string } | null>('mock_user', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	});
	const hasAuthHint = guestLoginMode.value !== null || Boolean(mockUser.value?.email);
	if (!hasAuthHint) return;

	const routeCountry = resolveSupportedCountry(route.params.country || '') || DEFAULT_COUNTRY;
	const apiCountry = COUNTRY_TO_API_COUNTRY[routeCountry];

	try {
		const response = await api<MeResponse>(`/${apiCountry}/user/me`, {
			method: 'GET',
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
	}
})
