import { DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries'

export default defineNuxtRouteMiddleware(async (to) => {
    const { $i18n } = useNuxtApp()
    const currentLocaleRaw =
        (typeof $i18n?.locale === 'string' ? $i18n.locale : $i18n?.locale?.value) || DEFAULT_COUNTRY
    const currentLocale = resolveSupportedCountry(String(currentLocaleRaw)) || DEFAULT_COUNTRY
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

    if (firstSegment === 'guide') {
        return
    }

    if (resolvedFirstSegment && secondSegment === 'guide') {
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
        await $i18n.setLocale(resolvedFirstSegment)
    }
})
