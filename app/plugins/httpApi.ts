import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#app'
import { useCountry } from '~/composables/app/country/useCountry'
import type { ApiResponse, ApiOptions } from '../types/config/api'

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const authToken = useCookie<string | null>('auth_token')
	const token = useCookie<string | null>('token')
	const device_uuid = useCookie<string | null>('device_uuid', { maxAge: 10 * 365 * 24 * 60 * 60 })

	const { country } = useCountry()

	const apiFetch = $fetch.create({
		baseURL: config.public.api_url + '/' + country.value,
		credentials: 'include',
		onRequest({ options }) {
			const headers = options.headers

			if (!device_uuid.value) {
				device_uuid.value = crypto.randomUUID()
			}

			headers.set('x-device-uuid', device_uuid.value)
			headers.set('request-from', 'client-panel')

			if (import.meta.server) {
				const forwarded = useRequestHeaders(['cookie'])
				if (forwarded.cookie) {
					headers.set('cookie', forwarded.cookie)
				}
			}
		},
		async onResponse({ response }) {
			const data = response._data
			const is_valid = typeof data === 'object'
				&& data !== null
				&& 'success' in data
				&& 'data' in data

			if (!is_valid) {
				throw createError({
					statusCode: 500,
					statusMessage: 'API Response Contract Violation: Expected ApiResponse structure.',
				})
			}
		},
		async onResponseError({ request, response }) {
			if (response.status === 401) {
				authToken.value = null
				token.value = null

				const request_path = typeof request === 'string'
					? request
					: request instanceof Request
						? request.url
						: ''

				if (!request_path.includes('user/me')) {
					console.warn('Unauthorized action!')
				}
			}

			if (response.status === 500) {
				console.error('Critical Server Error. Please contact support.')
			}
		},
	})

	const api = {
		get: <T>(url: string, options?: ApiOptions) =>
			apiFetch<ApiResponse<T>>(url, { method: 'GET', ...options }),

		post: <T = unknown>(url: string, body?: Record<string, unknown>, options?: ApiOptions) =>
			apiFetch<ApiResponse<T>>(url, { method: 'POST', body, ...options }),

		put: <T>(url: string, body?: Record<string, unknown>, options?: ApiOptions) =>
			apiFetch<ApiResponse<T>>(url, { method: 'PUT', body, ...options }),

		delete: <T>(url: string, options?: ApiOptions) =>
			apiFetch<ApiResponse<T>>(url, { method: 'DELETE', ...options }),
	}

	return {
		provide: {
			api,
		},
	}
})