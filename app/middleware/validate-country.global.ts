import { isSupportedCountry } from '~/constants/countries'

export default defineNuxtRouteMiddleware((to) => {
    // public routes that should NOT be treated as country codes
    const publicRoutes = new Set(['login', 'register', 'forgot-password'])

    const first = to.path.split('/').filter(Boolean)[0]?.toLowerCase()

    // allow root
    if (!first) return

    // allow internal/framework
    if (first === '_nuxt' || first === 'api') return

    // allow public routes (no country prefix)
    if (publicRoutes.has(first)) return

    // allow supported countries
    if (isSupportedCountry(first)) return

    // block unsupported 2-letter "country-like" segments
    if (/^[a-z]{2}$/.test(first)) {
        return navigateTo({ path: '/', query: { unsupported: first, nogeo: '1' } })
    }
})
