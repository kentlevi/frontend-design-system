import { DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries';
import { useUsersStore } from '~/stores/users/users.store';
import { useAuthUser } from '~/composables/auth/useAuthUser';

export default defineNuxtRouteMiddleware(async (to) => {
	const { state } = storeToRefs(useUsersStore())
	if (state.value.email || state.value.id) return;

	const mockUser = useCookie<{
		firstName: string;
		lastName: string;
		email: string;
	} | null>('mock_user');
	if (mockUser.value?.email) return;

	const [firstSegment] = to.path.split('/').filter(Boolean);
	const country = resolveSupportedCountry(firstSegment || '') || DEFAULT_COUNTRY;

	try {
		const { fetchAndStoreUser } = useAuthUser()
		const restored = await fetchAndStoreUser()
		if (restored) return
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