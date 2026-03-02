import { DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries';

function resolveCountryFromPath(path: string) {
    const [firstSegment] = path.split('/').filter(Boolean);
    return resolveSupportedCountry(firstSegment || '') || DEFAULT_COUNTRY;
}

export default defineNuxtRouteMiddleware((to) => {
    const segments = to.path.split('/').filter(Boolean);
    const isAccountRoute =
        segments[0] === 'account' || segments[1] === 'account';
    if (!isAccountRoute) return;

    const authToken = useCookie<string | null>('auth_token');
    if (authToken.value) return;

    const mockUser = useCookie<{
        firstName: string;
        lastName: string;
        email: string;
    } | null>('mock_user');
    if (mockUser.value?.email) return;

    const country = resolveCountryFromPath(to.path);
    return navigateTo(`/${country}`);
});
