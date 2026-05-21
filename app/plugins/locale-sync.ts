import { DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries';

export default defineNuxtPlugin(async (nuxtApp) => {
	const route = useRoute();
	const preferredLocale = useCookie<string | null>('preferred_locale', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	});

	const routeLocale = resolveSupportedCountry(String(route.params.country || ''));
	const cookieLocale = resolveSupportedCountry(preferredLocale.value || '');
	const nextLocale = routeLocale || cookieLocale || DEFAULT_COUNTRY;
	const currentLocaleRaw =
		(typeof nuxtApp.$i18n?.locale === 'string'
			? nuxtApp.$i18n.locale
			: nuxtApp.$i18n?.locale?.value) || DEFAULT_COUNTRY;
	const currentLocale = resolveSupportedCountry(String(currentLocaleRaw)) || DEFAULT_COUNTRY;

	// Only write the cookie when the value actually changes — avoids
	// emitting redundant Set-Cookie headers (and Nuxt cookie-override warnings)
	// on every request.
	if (preferredLocale.value !== nextLocale) {
		preferredLocale.value = nextLocale;
	}

	if (currentLocale !== nextLocale && typeof nuxtApp.$i18n?.setLocale === 'function') {
		await nuxtApp.$i18n.setLocale(nextLocale);
	}
});