import { defineNuxtPlugin, useRuntimeConfig, useCookie } from '#app'
import type { ApiResponse, ApiOptions } from '../types/config/api'

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const token = useCookie<string | null>('token')
	const route = useRoute()

	const country = route.params.country

	const apiFetch = $fetch.create({
		baseURL: config.public.apiBase + '/' + country,
		onRequest({ options }) {
			// 1. Force the type to be a plain object so we can use the spread operator/assignment
			const headers = options.headers
			if (token.value) {
				headers.set('Authorization', `Bearer ${token.value}`)
			}
		},
		async onResponse({ response }) {
			const data = response._data
			// ⚠️ STRICT CHECK: Ensure the response has the required keys
			const is_valid = typeof data === 'object'
				&& data !== null
				&& 'success' in data
				&& 'data' in data

			if (!is_valid) {
				// 📌 If the server returns a plain array or malformed object,
				// - throw an error immediately to force backend compliance
				throw createError({
					statusCode: 500,
					statusMessage: 'API Response Contract Violation: Expected ApiResponse structure.',
				})
			}
		},
		async onResponseError({ response }) {
			// 🚫 1. Check for Unauthorized status
			if (response.status === 401) {
				// 📌 2. Clear the token (using the cookie ref from the outer scope)
				token.value = null

				// 🔥 Action or redirection will be added here.
				console.warn('Unauthorized action!')
			}

			// 🔥 5. Handle other common errors (Optional)
			if (response.status === 500) {
				// 🔥 You could trigger a global 'Toast' or 'Alert' here
				console.error('Critical Server Error. Please contact support.')
			}
		},
	})

	const api = {
		get: <T>(url: string, options?: ApiOptions) =>
			apiFetch<ApiResponse <T>>(url, { method: 'GET', ...options }),

		post: <T = unknown>(url: string, body?: Record<string, unknown>, options?: ApiOptions) =>
			apiFetch<ApiResponse <T>>(url, { method: 'POST', body, ...options }),

		put: <T>(url: string, body?: Record<string, unknown>, options?: ApiOptions) =>
			apiFetch<ApiResponse <T>>(url, { method: 'PUT', body, ...options }),

		delete: <T>(url: string, options?: ApiOptions) =>
			apiFetch<ApiResponse <T>>(url, { method: 'DELETE', ...options }),
	}

	return {
		provide: {
			api,
		},
	}
})