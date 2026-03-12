import { COUNTRY_TO_API_COUNTRY, DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries';
import type { UserProfile } from '~/stores/user';

export default defineNuxtRouteMiddleware(async (to) => {
	const userStore = useUserStore();
	if (userStore.email || userStore.id) return;

	const mockUser = useCookie<{
		firstName: string;
		lastName: string;
		email: string;
	} | null>('mock_user');
	if (mockUser.value?.email) return;

	const api = useApi();
	const [firstSegment] = to.path.split('/').filter(Boolean);
	const country = resolveSupportedCountry(firstSegment || '') || DEFAULT_COUNTRY;
	const apiCountry = COUNTRY_TO_API_COUNTRY[country];

	try {
		const me = await api<{
			success: boolean;
			data?: { user?: { id: number; code: string; email: string }; profile?: unknown };
		}>(`/${apiCountry}/user/me`, { method: 'GET' });

		if (me?.success && me.data?.user) {
			userStore.setUser({
				...(me.data.user as { id: number; code: string; email: string }),
				profile: (me.data.profile as UserProfile | null | undefined) ?? null,
			});
			return;
		}
	} catch {
		// ignore
	}

	return navigateTo(
		{
			path: `/${country}/auth/login`,
			query: {
				redirect: to.fullPath,
			},
		},
		{ replace: true }
	);
});