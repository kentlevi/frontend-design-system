import { DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries'

export default defineNuxtRouteMiddleware(async (to) => {
	const { $i18n } = useNuxtApp()
	const preferredLocale = useCookie<string | null>('preferred_locale', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	})

	// Guarded setter — avoids emitting a fresh Set-Cookie header (and Nuxt
	// cookie-override warnings) when the value isn't actually changing.
	const setPreferredLocale = (next: string) => {
		if (preferredLocale.value !== next) preferredLocale.value = next
	}
	const preferredLocaleResolved =
		resolveSupportedCountry(preferredLocale.value || '') || null
	const currentLocaleRaw =
		(typeof $i18n?.locale === 'string' ? $i18n.locale : $i18n?.locale?.value) || DEFAULT_COUNTRY
	const currentLocale =
		preferredLocaleResolved ||
		resolveSupportedCountry(String(currentLocaleRaw)) ||
		DEFAULT_COUNTRY
	const path = to.path || '/'
	const [_, firstSegment, secondSegment] = path.split('/')
	const resolvedFirstSegment = resolveSupportedCountry(firstSegment)

	if (!firstSegment) {
		return navigateTo(
			{
				path: `/${currentLocale}`,
				query: to.query,
				hash: to.hash,
			},
			{ replace: true }
		)
	}

	if (firstSegment === 'guide' || firstSegment === 'static') {
		return
	}

	if (resolvedFirstSegment && secondSegment === 'guide') {
		setPreferredLocale(resolvedFirstSegment)
		if (currentLocale !== resolvedFirstSegment && typeof $i18n?.setLocale === 'function') {
			await $i18n.setLocale(resolvedFirstSegment)
		}

		const unprefixedGuidePath = path.replace(new RegExp(`^/${firstSegment}`), '')
		return navigateTo(
			{
				path: unprefixedGuidePath || '/guide',
				query: to.query,
				hash: to.hash,
			},
			{ replace: true }
		)
	}

	if (!resolvedFirstSegment) {
		const normalizedPath = path.startsWith('/') ? path : `/${path}`
		return navigateTo(
			{
				path: `/${currentLocale}${normalizedPath}`,
				query: to.query,
				hash: to.hash,
			},
			{
				replace: true,
			}
		)
	}

	if (firstSegment !== resolvedFirstSegment) {
		const normalizedPath = path.replace(new RegExp(`^/${firstSegment}`), `/${resolvedFirstSegment}`)
		return navigateTo(
			{
				path: normalizedPath || `/${resolvedFirstSegment}`,
				query: to.query,
				hash: to.hash,
			},
			{ replace: true }
		)
	}

	if (currentLocale !== resolvedFirstSegment && typeof $i18n?.setLocale === 'function') {
		setPreferredLocale(resolvedFirstSegment)
		await $i18n.setLocale(resolvedFirstSegment)
		return
	}

	setPreferredLocale(resolvedFirstSegment)
})