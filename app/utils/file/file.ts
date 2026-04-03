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


export function convertFileBase64(file: File): Promise<string> {
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
		reader.onerror = () => resolve('');
		reader.readAsDataURL(file);
	});
}


export function formatProductFileSize(bytes: number) {
	if (bytes <= 0) return '0 B';

	const units = ['B', 'KB', 'MB', 'GB'];
	const index = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1
	);
	const value = bytes / 1024 ** index;

	return `${value >= 10 || index === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[index]}`;
}