export type UploadWithPresignedUrlPayload = Record<'full_path', string>

export interface UploadWithPresignedUrlParams {
	payload: Record<string, string>
	// on_progress?: (loaded: number, total: number) => void
	// signal?: AbortSignal
}

export interface UploadWithPresignedUrlResult {
	presigned_url: string
}