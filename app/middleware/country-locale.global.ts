const SUPPORTED_COUNTRIES = new Set(['en', 'kr']);

export default defineNuxtRouteMiddleware(async (to) => {
    const { $i18n } = useNuxtApp();
    const currentLocale =
        (typeof $i18n?.locale === 'string' ? $i18n.locale : $i18n?.locale?.value) || 'en';
    const path = to.path || '/';
    const [_, firstSegment] = path.split('/');

    if (!firstSegment) {
        return navigateTo(`/${currentLocale}`, { replace: true });
    }

    if (!SUPPORTED_COUNTRIES.has(firstSegment)) {
        return navigateTo(`/${currentLocale}${path.startsWith('/') ? path : `/${path}`}`, {
            replace: true,
        });
    }

    if (currentLocale !== firstSegment && typeof $i18n?.setLocale === 'function') {
        await $i18n.setLocale(firstSegment);
    }
});
