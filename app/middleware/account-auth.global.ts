import { COUNTRY_TO_API_COUNTRY, DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries';

function resolveCountryFromPath(path: string) {
	const [firstSegment] = path.split('/').filter(Boolean);
	return resolveSupportedCountry(firstSegment || '') || DEFAULT_COUNTRY;
}

export default defineNuxtRouteMiddleware(async (to) => {
	const segments = to.path.split('/').filter(Boolean);
	const isAccountRoute =
		segments[0] === 'account' || segments[1] === 'account';
	if (!isAccountRoute) return;

	const userStore = useUserStore();
	if (userStore.email || userStore.id) return;

	const mockUser = useCookie<{
		firstName: string;
		lastName: string;
		email: string;
	} | null>('mock_user');
	if (mockUser.value?.email) return;

	const country = resolveCountryFromPath(to.path);
	const apiCountry = COUNTRY_TO_API_COUNTRY[country];
	const api = useApi();

	try {
		const me = await api<{
			success: boolean;
			data?: { user?: { id: number; code: string; email: string }; profile?: unknown };
		}>(`/${apiCountry}/user/me`, { method: 'GET' });

		if (me?.success && me.data?.user) {
			userStore.setUser({
				...(me.data.user as { id: number; code: string; email: string }),
				profile: (me.data.profile as any) ?? null,
			});
			return;
		}
	} catch {
		// ignore
	}

	return navigateTo(`/${country}`);
});