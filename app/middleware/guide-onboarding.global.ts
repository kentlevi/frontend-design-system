const GUIDE_ONBOARDING_COOKIE = 'guide_onboarding_completed_v1';

const normalizePath = (value: string) => {
    if (value.length > 1 && value.endsWith('/')) {
        return value.slice(0, -1);
    }
    return value;
};

export default defineNuxtRouteMiddleware((to) => {
    if (!import.meta.dev) return;

    const path = normalizePath(to.path);
    const match = path.match(/^(?<prefix>.*?)(\/guide)(?:\/.*)?$/i);

    if (!match) return;

    const prefix = match.groups?.prefix ?? '';
    const onboardingPath = normalizePath(`${prefix}/guide/onboarding`);
    const isOnboardingRoute = path.toLowerCase() === onboardingPath.toLowerCase();

    const onboardingCookie = useCookie<string | null>(GUIDE_ONBOARDING_COOKIE, {
        path: '/',
        sameSite: 'lax',
    });

    if (!onboardingCookie.value && !isOnboardingRoute) {
        return navigateTo({
            path: onboardingPath,
            query: { redirect: to.fullPath },
        });
    }
});
