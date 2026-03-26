import { getUploadPath } from "~/services/file/file.service";
import type { UploadPathResolvePayload, UploadPathResolveResult } from "~/types/file/file";

export async function resolveUploadPath(
	payload: UploadPathResolvePayload
): Promise<UploadPathResolveResult> {
	/** Resolve final storage path */
	const resolved_file_path = await getUploadPath(payload)

	/** Get full path from response */
	const full_path = resolved_file_path.data?.full_path

	const file_name = resolved_file_path.data?.file_name

	/** Stop if full path or file name was not returned */
	if (!full_path || !file_name) {
		throw new Error('Full path was not resolved.')
	}

	return {
		full_path,
		file_name
	}
}

export function isValidImage(file: File) {
	/** Stop if file is missing or not an image */
	if (!file?.type?.startsWith('image/')) {
		return false
	}

	/** Block unsupported image types */
	const blocked_types = [
		'image/gif',
		'image/svg+xml',
		'image/bmp',
		'image/tiff',
		'image/heif',
	]

	return !blocked_types.includes(file.type)
}