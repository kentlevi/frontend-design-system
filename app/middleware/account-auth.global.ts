import { DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries';
import { fetchAndStoreUser } from '~/services/auth/auth.service';
import { useUsersStore } from '~/stores/users/users.store';

function resolveCountryFromPath(path: string) {
	const [firstSegment] = path.split('/').filter(Boolean);
	return resolveSupportedCountry(firstSegment || '') || DEFAULT_COUNTRY;
}

export default defineNuxtRouteMiddleware(async (to) => {
	const segments = to.path.split('/').filter(Boolean);
	const isAccountRoute =
		segments[0] === 'account' || segments[1] === 'account';
	if (!isAccountRoute) return;

	const { state } = storeToRefs(useUsersStore())
	if (state.value.email || state.value.id) return;

	const mockUser = useCookie<{
		firstName: string;
		lastName: string;
		email: string;
	} | null>('mock_user');
	if (mockUser.value?.email) return;

	const country = resolveCountryFromPath(to.path);

	try {
		const restored = await fetchAndStoreUser()
		if (restored) return
	} catch {
		// ignore
	}

	return navigateTo(`/${country}`);
});