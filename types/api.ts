export interface ApiResponse<T = unknown> {
	success: boolean
	message: string | null
	data: T | null
	meta: Record<string, unknown> |null
}
export interface ApiOptions {
	params?: Record<string, unknown >
	headers?: Record<string, string>
}