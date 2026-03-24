const AVATAR_TARGET_SIZE_PX = 800;
const AVATAR_JPEG_QUALITY = 0.82;

type ProfileFieldKey = 'first_name' | 'last_name';
type ProfileFieldAlias = 'first_name' | 'given_name' | 'last_name' | 'family_name';

type ProfileFieldValue = {
	value?: string | null;
	sort_order?: number | null;
	country_field?: {
		field_key?: string | null;
	} | null;
	country_field_id?: number | null;
	country_field_ids?: number | null;
	country_fields_id?: number | null;
};

type DynamicProfileField = {
	id?: number | null;
	field_key?: string | null;
	sort_order?: number | null;
};

const profile_field_aliases: Record<ProfileFieldKey, ProfileFieldAlias[]> = {
	first_name: ['first_name', 'given_name'],
	last_name: ['last_name', 'family_name'],
};

function getLegacyFieldId(key: ProfileFieldKey) {
	return key === 'first_name' ? 1 : 2;
}

function getFieldIdentifier(field: ProfileFieldValue) {
	return field.country_field_id ?? field.country_field_ids ?? field.country_fields_id;
}

function normalizeFieldKey(value: string | null | undefined) {
	return (value || '').trim().toLowerCase();
}

function getFieldKeyFromDefinitions(
	field_definitions: DynamicProfileField[],
	field_identifier: number | null | undefined
) {
	if (!field_identifier) return '';
	const matched_definition = field_definitions.find(
		(field_definition) => field_definition.id === field_identifier
	);
	return normalizeFieldKey(matched_definition?.field_key);
}

function getFieldSortOrder(field: ProfileFieldValue) {
	if (typeof field.sort_order === 'number') {
		return field.sort_order;
	}

	return getFieldIdentifier(field) ?? Number.MAX_SAFE_INTEGER;
}

export function getProfileFieldValue(
	field_values: ProfileFieldValue[],
	key: ProfileFieldKey,
	field_definitions: DynamicProfileField[] = []
) {
	const normalized_aliases = profile_field_aliases[key];
	const legacy_id = getLegacyFieldId(key);
	const direct_match =
		field_values.find(
			(field) => {
				const field_identifier = getFieldIdentifier(field);
				const field_key_from_payload = normalizeFieldKey(field.country_field?.field_key);
				const field_key_from_state = getFieldKeyFromDefinitions(
					field_definitions,
					field_identifier
				);
				const normalized_field_key = field_key_from_payload || field_key_from_state;
				const is_key_match = normalized_aliases.some(
					(field_alias) => field_alias === normalized_field_key
				);

				return (
					is_key_match
					|| field_identifier === legacy_id
				);
			}
		)?.value?.trim() || '';

	if (direct_match) return direct_match;

	const fallback_rows = [...field_values]
		.filter((field) => typeof field.value === 'string' && field.value.trim())
		.sort(
			(a, b) =>
				getFieldSortOrder(a) - getFieldSortOrder(b)
		)
		.slice(0, 2)
		.map((field) => field.value?.trim() || '');

	if (key === 'first_name') return fallback_rows[0] || '';
	return fallback_rows[1] || '';
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