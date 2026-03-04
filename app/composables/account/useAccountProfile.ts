import { computed, onBeforeUnmount, ref } from 'vue';
import {
	accountProfileDefaults,
	type AccountMockUser,
	type AccountUnit,
} from '~/data/account/profile';
import { useCountry } from '~/composables/app/useCountry';

const ACCOUNT_LOCAL_AVATAR_KEY = 'account_profile_avatar_data_url';
const ACCOUNT_AVATAR_UPDATED_EVENT = 'account-avatar-updated';
const ACCEPTED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png']);
const AVATAR_TARGET_SIZE_PX = 800;
const AVATAR_JPEG_QUALITY = 0.82;

interface ApiErrorPayload {
	data?: {
		message?: string;
	};
}

export function useAccountProfile() {
	const { withCountry, apiCountry } = useCountry();
	const { resolveFileUrl } = useFileBaseUrl();
	const api = useApi();
	const userStore = useUserStore();
	const { t } = useI18n();
	const mockUser = useCookie<AccountMockUser | null>('mock_user');
	const authToken = useCookie<string | null>('auth_token');

	const profileFieldValues = computed(
		() => userStore.profile?.user_field_values ?? []
	);
	function getFieldValueByKey(key: 'first_name' | 'last_name') {
		const legacyId = key === 'first_name' ? 1 : 2;
		const directMatch =
			profileFieldValues.value.find(
				(field) =>
					field.country_field?.field_key === key ||
                    (field.country_field_id ?? field.country_field_ids ?? field.country_fields_id) === legacyId
			)?.value?.trim() || '';
		if (directMatch) return directMatch;

		// Fallback for environments where field keys are not returned in API payload.
		const fallbackRows = [...profileFieldValues.value]
			.filter((field) => typeof field.value === 'string' && field.value.trim())
			.sort(
				(a, b) =>
					(a.country_field_id ?? a.country_field_ids ?? a.country_fields_id ?? Number.MAX_SAFE_INTEGER) -
                    (b.country_field_id ?? b.country_field_ids ?? b.country_fields_id ?? Number.MAX_SAFE_INTEGER)
			)
			.slice(0, 2);
		if (fallbackRows.length < 2) return '';
		return key === 'first_name'
			? (fallbackRows[0]?.value?.trim() || '')
			: (fallbackRows[1]?.value?.trim() || '');
	}
	const storeFirstName = computed(
		() => getFieldValueByKey('first_name')
	);
	const storeLastName = computed(
		() => getFieldValueByKey('last_name')
	);

	function normalizeName(first: string, last: string) {
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

	const rawFirstName =
		storeFirstName.value ||
        userStore.onboardingProfile?.firstName ||
        mockUser.value?.firstName ||
        accountProfileDefaults.firstName;
	const rawLastName =
		storeLastName.value ||
        userStore.onboardingProfile?.lastName ||
        mockUser.value?.lastName ||
        accountProfileDefaults.lastName;
	const normalizedName = normalizeName(rawFirstName, rawLastName);

	const firstName = ref(normalizedName.firstName || accountProfileDefaults.firstName);
	const lastName = ref(normalizedName.lastName || accountProfileDefaults.lastName);
	const email = ref(userStore.email || mockUser.value?.email || accountProfileDefaults.email);
	const currentPassword = ref('');
	const newPassword = ref('');
	const confirmPassword = ref('');

	const promotions = ref(false);
	const reviews = ref(false);
	const confirmations = ref(false);
	const unit = ref<AccountUnit>('millimeter');

	const photoUrl = ref<string | null>(null);
	const photoFile = ref<File | null>(null);
	const photoError = ref('');
	const fileInput = ref<HTMLInputElement | null>(null);
	const localAvatarDataUrl = ref<string | null>(null);

	const persistedPhotoUrl = computed(() => {
		const fileName = String(userStore.profile?.file_name || '').trim();
		if (!fileName) return null;
		return resolveFileUrl(`uploads/profile/${fileName}`);
	});
	const avatarDisplayUrl = computed(() => photoUrl.value || localAvatarDataUrl.value || persistedPhotoUrl.value);

	const initials = computed(() => {
		const firstInitial = (firstName.value?.charAt(0) || 'U').toUpperCase();
		const lastInitial = (lastName.value?.charAt(0) || '').toUpperCase();
		return `${firstInitial}${lastInitial}`;
	});

	function openFilePicker() {
		fileInput.value?.click();
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

	async function processAvatarFile(file: File): Promise<File> {
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

	function revokePhotoUrl() {
		if (photoUrl.value?.startsWith('blob:')) {
			URL.revokeObjectURL(photoUrl.value);
		}
	}

	function readFileAsDataUrl(file: File): Promise<string> {
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

	async function onFilePicked(event: Event) {
		photoError.value = '';
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		if (!ACCEPTED_IMAGE_MIME_TYPES.has(file.type.toLowerCase())) {
			photoError.value = t('auth.profile.details.photoInvalidType');
			return;
		}

		let processedFile: File;
		try {
			processedFile = await processAvatarFile(file);
		} catch {
			photoError.value = t('auth.profile.details.photoProcessFailed');
			return;
		}

		revokePhotoUrl();
		try {
			photoUrl.value = await readFileAsDataUrl(processedFile);
		} catch {
			photoError.value = t('auth.profile.details.photoProcessFailed');
			return;
		}
		photoFile.value = processedFile;
	}

	function removePhoto() {
		revokePhotoUrl();
		photoUrl.value = null;
		localAvatarDataUrl.value = null;
		photoFile.value = null;
		photoError.value = '';
		if (import.meta.client) {
			window.localStorage.removeItem(ACCOUNT_LOCAL_AVATAR_KEY);
			window.dispatchEvent(new CustomEvent(ACCOUNT_AVATAR_UPDATED_EVENT, { detail: null }));
		}
	}

	async function saveProfile() {
		const trimmedFirstName = firstName.value.trim() || accountProfileDefaults.firstName;
		const trimmedLastName = lastName.value.trim() || accountProfileDefaults.lastName;
		const trimmedEmail = email.value.trim() || accountProfileDefaults.email;

		try {
			if (import.meta.client && photoUrl.value) {
				window.localStorage.setItem(ACCOUNT_LOCAL_AVATAR_KEY, photoUrl.value);
				localAvatarDataUrl.value = photoUrl.value;
				window.dispatchEvent(
					new CustomEvent(ACCOUNT_AVATAR_UPDATED_EVENT, { detail: photoUrl.value })
				);
			}

			mockUser.value = {
				firstName: trimmedFirstName,
				lastName: trimmedLastName,
				email: trimmedEmail,
			};
		} catch (error: unknown) {
			const apiError = error as ApiErrorPayload;
			photoError.value = apiError?.data?.message || 'Failed to save profile. Please try again.';
		}
	}

	async function signOut() {
		try {
			await api(`/${apiCountry.value}/auth/logout`, {
				method: 'POST',
			});
		} catch {
			// Continue with local sign-out cleanup even if API logout fails.
		} finally {
			mockUser.value = null;
			authToken.value = null;
			userStore.clearUser();
			userStore.clearOnboardingProfile();
			await navigateTo(withCountry('/'));
		}
	}

	if (import.meta.client) {
		const storedAvatar = window.localStorage.getItem(ACCOUNT_LOCAL_AVATAR_KEY);
		if (storedAvatar) {
			localAvatarDataUrl.value = storedAvatar;
		}
	}

	onBeforeUnmount(() => {
		revokePhotoUrl();
	});

	return {
		firstName,
		lastName,
		email,
		currentPassword,
		newPassword,
		confirmPassword,
		promotions,
		reviews,
		confirmations,
		unit,
		photoUrl,
		avatarDisplayUrl,
		photoError,
		fileInput,
		initials,
		openFilePicker,
		onFilePicked,
		removePhoto,
		saveProfile,
		signOut,
	};
}