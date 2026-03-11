export const useApi = () => {
	const config = useRuntimeConfig()

	const api = $fetch.create({
		baseURL: config.public.apiBase,
		credentials: 'include',
		onRequest({ options }) {
			const headers = new Headers(options.headers || {})
			const deviceUuid = useCookie('device_uuid').value
			const requestFrom = 'client-panel'

			headers.set('request-from', requestFrom)

			if (deviceUuid) {
				headers.set('x-device-uuid', deviceUuid)
			}

			if (import.meta.server) {
				const forwarded = useRequestHeaders(['cookie'])
				if (forwarded.cookie) {
					headers.set('cookie', forwarded.cookie)
				}
			}

			options.headers = headers
		}
	})

	return api
}