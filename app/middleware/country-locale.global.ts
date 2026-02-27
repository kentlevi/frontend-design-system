import { DEFAULT_COUNTRY, isSupportedCountry } from '~/constants/countries'

export default defineNuxtRouteMiddleware(async (to) => {
    const { $i18n } = useNuxtApp()
    const currentLocale =
        (typeof $i18n?.locale === 'string' ? $i18n.locale : $i18n?.locale?.value) ||
        DEFAULT_COUNTRY
    const path = to.path || '/'
    const [_, firstSegment, secondSegment] = path.split('/')

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

    if (isSupportedCountry(firstSegment) && secondSegment === 'guide') {
        if (currentLocale !== firstSegment && typeof $i18n?.setLocale === 'function') {
            await $i18n.setLocale(firstSegment)
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

    if (!isSupportedCountry(firstSegment)) {
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

    if (currentLocale !== firstSegment && typeof $i18n?.setLocale === 'function') {
        await $i18n.setLocale(firstSegment)
    }
})
