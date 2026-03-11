import { defineNuxtPlugin } from '#app'
import { useUserStore } from '@/stores/user'

export default defineNuxtPlugin(async (nuxtApp) => {
	type MeUser = {
		id: number;
		code: string;
		email: string;
	};

	const { $api, $pinia } = useNuxtApp()
	const userStore = useUserStore($pinia);

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

	try {
		const response = await $api.get<{
			user?: MeUser;
			profile?: Record<string, unknown>;
		}>('user/me');

		const { user, profile } = response.data ?? {};

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