export default defineNuxtRouteMiddleware((to) => {
    if (!to.path.includes('/account')) return;

    const authToken = useCookie<string | null>('auth_token');
    if (authToken.value) return;

    const localePath = useLocalePath();
    return navigateTo(localePath('/'));
});
