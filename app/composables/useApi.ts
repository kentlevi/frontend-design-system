export const useApi = () => {
    const config = useRuntimeConfig()

    const api = $fetch.create({
        baseURL: config.public.apiBase,
        onRequest({ options }) {
            const token = useCookie<string | null>('auth_token').value
            // const token = localStorage.getItem('auth_token')
            if (!token) return

            // Normalize headers to Headers instance
            const headers = new Headers(options.headers || {})

            headers.set('Authorization', `Bearer ${token}`)

            options.headers = headers
        }
    })

    return api
}