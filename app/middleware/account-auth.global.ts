export default defineNuxtRouteMiddleware((to) => {
    if (!to.path.includes('/account')) return;

    const authToken = useCookie<string | null>('auth_token');
    if (authToken.value) return;

    const mockUser = useCookie<{
        firstName: string;
        lastName: string;
        email: string;
    } | null>('mock_user');
    if (mockUser.value?.email) return;

    const localePath = useLocalePath();
    return navigateTo(localePath('/'));
});
