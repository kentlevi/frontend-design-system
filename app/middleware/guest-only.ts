import { DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries';

function resolveCountryFromPath(path: string) {
	const [firstSegment] = path.split('/').filter(Boolean);
	return resolveSupportedCountry(firstSegment || '') || DEFAULT_COUNTRY;
}

export default defineNuxtRouteMiddleware((to) => {
	const userStore = useUserStore();
	const mockUser = useCookie<{
		firstName: string;
		lastName: string;
		email: string;
	} | null>('mock_user');
	const isAuthenticated = Boolean(userStore.email || userStore.id || mockUser.value?.email);

	if (!isAuthenticated) return;

	const country = resolveCountryFromPath(to.path);
	return navigateTo(`/${country}`, { replace: true });
});