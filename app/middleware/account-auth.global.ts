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

    const { withCountry } = useCountry();
    return navigateTo(withCountry('/'));
});
