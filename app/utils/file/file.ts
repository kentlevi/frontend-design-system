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