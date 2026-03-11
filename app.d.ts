// app.d.ts
import type { ApiResponse, ApiOptions } from './app/types/config/api' // Import your interface

declare module '#app' {
	interface NuxtApp {
		$api: {
			get: <T>(url: string, options?: ApiOptions) => Promise<ApiResponse<T>>
			post: <T>(url: string, body?: Record<string, unknown >, options?: ApiOptions) => Promise<ApiResponse<T>>
			put: <T>(url: string, body?: Record<string, unknown >, options?: ApiOptions) => Promise<ApiResponse<T>>
			delete: <T>(url: string, options?: ApiOptions) => Promise<ApiResponse<T>>
		}
	}
}

// Ensure the project treats this as a module
export {}