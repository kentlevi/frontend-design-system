export const useApi = () => {
	const config = useRuntimeConfig()
	const DEVICE_ID_STORAGE_KEY = 'musticker_device_id'

	function isValidDeviceId(value: string) {
		return /^[0-9a-fA-F-]{16,64}$/.test(value)
	}

	function getOrCreateDeviceId() {
		if (!import.meta.client) return ''

		const existing = String(window.localStorage.getItem(DEVICE_ID_STORAGE_KEY) || '').trim()
		if (existing && isValidDeviceId(existing)) {
			return existing.toLowerCase()
		}

		const generated = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
			? crypto.randomUUID()
			: `${Date.now().toString(16)}-${Math.random().toString(16).slice(2, 14)}`

		window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, generated)
		return generated.toLowerCase()
	}

	const api = $fetch.create({
		baseURL: config.public.apiBase,
		onRequest({ options }) {
			const token = useCookie<string | null>('auth_token').value
			const headers = new Headers(options.headers || {})
			const deviceId = getOrCreateDeviceId()

			if (deviceId) {
				headers.set('X-Device-Id', deviceId)
			}

			if (token) {
				headers.set('Authorization', `Bearer ${token}`)
			}

			options.headers = headers
		}
	})

	return api
}