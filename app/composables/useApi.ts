export const useApi = () => {
	const config = useRuntimeConfig()

	const api = $fetch.create({
		baseURL: config.public.apiBase,
		onRequest({ options }) {
			const token = useCookie<string | null>('auth_token').value
			const headers = new Headers(options.headers || {})
			const deviceUuid = useCookie('device_uuid').value
			const requestFrom = 'client-panel'

			headers.set('request-from', requestFrom)

			if (deviceUuid) {
				headers.set('x-device-uuid', deviceUuid)
			}

			if (token) {
				headers.set('Authorization', `Bearer ${token}`)
			}


			options.headers = headers
		}
	})

	return api
}