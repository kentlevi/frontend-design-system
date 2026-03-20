/** THE FILE PATH CODE IS FROM THE DATABASE; file_paths TABLE */
export type UploadPathResolvePayload = Record<
	'file_path_code' | 'image_type',
	string
>

export interface UploadPathResolveResult {
	full_path: string
	file_name: string
}