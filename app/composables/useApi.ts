export const useApi = () => {
	const config = useRuntimeConfig()

	const api = $fetch.create({
		baseURL: config.public.api_url,
		credentials: 'include',
		onRequest({ options }) {
			const headers = new Headers(options.headers || {})
			const device_uuid = useCookie('device_uuid').value
			const request_from = 'client-panel'

			headers.set('request-from', request_from)

			if (device_uuid) {
				headers.set('x-device-uuid', device_uuid)
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