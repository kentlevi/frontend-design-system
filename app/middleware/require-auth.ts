import { DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries';

export default defineNuxtRouteMiddleware((to) => {
    const authToken = useCookie<string | null>('auth_token');
    if (authToken.value) return;

    const mockUser = useCookie<{
        firstName: string;
        lastName: string;
        email: string;
    } | null>('mock_user');
    if (mockUser.value?.email) return;

    const [firstSegment] = to.path.split('/').filter(Boolean);
    const country = resolveSupportedCountry(firstSegment || '') || DEFAULT_COUNTRY;

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
