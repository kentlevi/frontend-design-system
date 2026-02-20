import { SUPPORTED_COUNTRY_SET } from '~/constants/countries'

export default defineEventHandler(async (event) => {
    const url = getRequestURL(event)
    const path = url.pathname

    // Only intercept root
    if (path !== '/') return

    // If redirected from unsupported route, DO NOT geo redirect
    if (url.searchParams.get('nogeo') === '1') {
        console.log('[geo] skip redirect (nogeo=1)')
        return
    }

    // 1) Cookie
    const countryCookie = getCookie(event, 'country')
    if (countryCookie && SUPPORTED_COUNTRY_SET.has(countryCookie as any)) {
        return sendRedirect(event, `/${countryCookie}`, 302)
    }

    // 2) Infra header
    const hdr =
        getHeader(event, 'cloudfront-viewer-country') ||
        getHeader(event, 'cf-ipcountry') ||
        getHeader(event, 'x-vercel-ip-country')

    if (hdr) {
        const code = hdr.toLowerCase()
        if (SUPPORTED_COUNTRY_SET.has(code as any)) {
            setCookie(event, 'country', code, { path: '/', maxAge: 60 * 60 * 24 * 30 })
            return sendRedirect(event, `/${code}`, 302)
        }

        return
    }

    // 3) External lookup
    try {
        let userIp = getRequestIP(event, { xForwardedFor: true })

        if (userIp?.includes(',')) userIp = userIp.split(',')[0].trim()

        if (!userIp || userIp === '127.0.0.1' || userIp === '::1') {
            const ipify: any = await $fetch('https://api.ipify.org?format=json', { timeout: 2000 })
            userIp = ipify.ip
        }

        const geo: any = await $fetch(
            `http://ip-api.com/json/${userIp}?fields=countryCode`,
            { timeout: 2000 }
        )

        const code = geo?.countryCode?.toLowerCase()
        if (code && SUPPORTED_COUNTRY_SET.has(code as any)) {
            setCookie(event, 'country', code, { path: '/', maxAge: 60 * 60 * 24 * 30 })
            return sendRedirect(event, `/${code}`, 302)
        }
    } catch (e: any) {
        console.log('[geo] external lookup failed:', e?.message || e)
    }
})