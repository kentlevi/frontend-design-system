const AVATAR_TARGET_SIZE_PX = 800;
const AVATAR_JPEG_QUALITY = 0.82;

type ProfileFieldKey = 'first_name' | 'last_name';

type ProfileFieldValue = {
	value?: string | null;
	country_field?: {
		field_key?: string | null;
	} | null;
	country_field_id?: number | null;
	country_field_ids?: number | null;
	country_fields_id?: number | null;
};

function getLegacyFieldId(key: ProfileFieldKey) {
	return key === 'first_name' ? 1 : 2;
}

function getFieldIdentifier(field: ProfileFieldValue) {
	return field.country_field_id ?? field.country_field_ids ?? field.country_fields_id;
}

export function getProfileFieldValue(
	fieldValues: ProfileFieldValue[],
	key: ProfileFieldKey
) {
	const legacyId = getLegacyFieldId(key);
	const directMatch =
		fieldValues.find(
			(field) =>
				field.country_field?.field_key === key ||
				getFieldIdentifier(field) === legacyId
		)?.value?.trim() || '';

	if (directMatch) return directMatch;

	const fallbackRows = [...fieldValues]
		.filter((field) => typeof field.value === 'string' && field.value.trim())
		.sort(
			(a, b) =>
				(getFieldIdentifier(a) ?? Number.MAX_SAFE_INTEGER) -
				(getFieldIdentifier(b) ?? Number.MAX_SAFE_INTEGER)
		)
		.slice(0, 2);

	if (fallbackRows.length < 2) return '';

	return key === 'first_name'
		? (fallbackRows[0]?.value?.trim() || '')
		: (fallbackRows[1]?.value?.trim() || '');
}

export function normalizeAccountName(first: string, last: string) {
	const firstTrimmed = first.trim();
	const lastTrimmed = last.trim();

	if (lastTrimmed || !firstTrimmed.includes(' ')) {
		return { firstName: firstTrimmed, lastName: lastTrimmed };
	}

	const parts = firstTrimmed.split(/\s+/).filter(Boolean);
	if (parts.length < 2) {
		return { firstName: firstTrimmed, lastName: lastTrimmed };
	}

	return {
		firstName: parts.slice(0, -1).join(' '),
		lastName: parts[parts.length - 1] || '',
	};
}

export function getAccountInitials(firstName: string, lastName: string) {
	const firstInitial = (firstName.charAt(0) || 'U').toUpperCase();
	const lastInitial = (lastName.charAt(0) || '').toUpperCase();
	return `${firstInitial}${lastInitial}`;
}

function createImageElement(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const objectUrl = URL.createObjectURL(file);
		const image = new Image();
		image.onload = () => {
			URL.revokeObjectURL(objectUrl);
			resolve(image);
		};
		image.onerror = () => {
			URL.revokeObjectURL(objectUrl);
			reject(new Error('Failed to decode image file.'));
		};
		image.src = objectUrl;
	});
}

function canvasToBlob(canvas: HTMLCanvasElement, outputType: string, quality?: number): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (!blob) {
					reject(new Error('Failed to encode image.'));
					return;
				}
				resolve(blob);
			},
			outputType,
			quality
		);
	});
}

export async function processAccountAvatarFile(file: File): Promise<File> {
	const image = await createImageElement(file);
	const width = image.naturalWidth;
	const height = image.naturalHeight;
	const hasLargeDimension = width > AVATAR_TARGET_SIZE_PX || height > AVATAR_TARGET_SIZE_PX;
	const isSquare = width === height;

	let sourceX = 0;
	let sourceY = 0;
	let sourceWidth = width;
	let sourceHeight = height;
	let targetWidth = width;
	let targetHeight = height;

	if (hasLargeDimension) {
		if (!isSquare) {
			const cropSize = Math.min(width, height);
			sourceX = Math.floor((width - cropSize) / 2);
			sourceY = Math.floor((height - cropSize) / 2);
			sourceWidth = cropSize;
			sourceHeight = cropSize;
		}

		targetWidth = AVATAR_TARGET_SIZE_PX;
		targetHeight = AVATAR_TARGET_SIZE_PX;
	}

	const canvas = document.createElement('canvas');
	canvas.width = targetWidth;
	canvas.height = targetHeight;
	const context = canvas.getContext('2d');
	if (!context) {
		throw new Error('Canvas context is unavailable.');
	}

	context.drawImage(
		image,
		sourceX,
		sourceY,
		sourceWidth,
		sourceHeight,
		0,
		0,
		targetWidth,
		targetHeight
	);

	const inputType = file.type.toLowerCase();
	const outputType = inputType === 'image/png' ? 'image/png' : 'image/jpeg';
	const blob = await canvasToBlob(
		canvas,
		outputType,
		outputType === 'image/jpeg' ? AVATAR_JPEG_QUALITY : undefined
	);

	const extension = outputType === 'image/png' ? 'png' : 'jpg';
	return new File([blob], `avatar-${Date.now()}.${extension}`, {
		type: outputType,
		lastModified: Date.now(),
	});
}

export function readFileAsDataUrl(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				resolve(reader.result);
				return;
			}
			reject(new Error('Failed to read file as data URL.'));
		};
		reader.onerror = () => reject(new Error('Failed to read file.'));
		reader.readAsDataURL(file);
	});
}