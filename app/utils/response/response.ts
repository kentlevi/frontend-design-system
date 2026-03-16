import type { ApiResponse } from "~/types/config/api"

export type ValidationErrors = Record<string, string[]>


/** Normalized error result */
export interface NormalizedResponseError {
	message: string | null
	errors: ValidationErrors | null
}

/** Normalized error result */
export interface NormalizedResponseError {
	message: string | null
	errors: ValidationErrors | null
}

/**
 * Normalize failed API response
 *
 * Rules:
 * 1. Return null if success
 * 2. Return field errors if data contains validation errors
 * 3. Return only message if no field errors exist
 */
export function normalizeResponseError(
	response: ApiResponse<unknown>
): NormalizedResponseError | null {
	/** Success case */
	if (response.success) {
		return null
	}

	/** Check if data contains field errors */
	const has_errors =
		response.data !== null &&
		typeof response.data === 'object' &&
		!Array.isArray(response.data) &&
		Object.keys(response.data as Record<string, unknown>).length > 0

	return {
		message: response.message,
		errors: has_errors ? (response.data as ValidationErrors) : null
	}
}