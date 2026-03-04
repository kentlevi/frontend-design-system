import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { accountProfileDefaults, type AccountMockUser } from '~/data/account/profile';
import { useCountry } from '~/composables/app/useCountry';
import { useUserStore } from '~/stores/user';

type ProfileStep = 1 | 2;
type ProfileUnit = 'millimeter' | 'inch';

const ACCOUNT_LOCAL_AVATAR_KEY = 'account_profile_avatar_data_url';
const ACCOUNT_AVATAR_UPDATED_EVENT = 'account-avatar-updated';
const ACCEPTED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png']);
const AVATAR_TARGET_SIZE_PX = 800;
const AVATAR_JPEG_QUALITY = 0.82;

interface UserMeResponse {
	success: boolean;
	data?: {
		user?: {
			id: number;
			code: string;
			email: string;
		};
		profile?: {
			id: number;
			user_id: number;
			file_path_id: number;
			file_name: string | null;
			user_field_values: Array<{
				id: number;
				user_profile_id: number;
				country_field_id?: number;
				country_field_ids?: number;
				country_fields_id?: number;
				country_field?: {
					field_key?: string;
				};
				value: string;
			}>;
		} | null;
	};
}

export function useAuthProfileSetup() {
	const { withCountry, apiCountry } = useCountry();
	const api = useApi();
	const userStore = useUserStore();
	const { t } = useI18n();
	const mockUser = useCookie<AccountMockUser | null>('mock_user', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	});

	const step = ref<ProfileStep>(1);
	const isNewOnboardingFlow = Boolean(userStore.onboardingProfile?.onboarding);
	const showWelcomeToast = ref(isNewOnboardingFlow);
	let toastTimeout: ReturnType<typeof setTimeout> | null = null;

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

	const firstName = ref(
		storeFirstName.value ||
            userStore.onboardingProfile?.firstName ||
            mockUser.value?.firstName ||
            accountProfileDefaults.firstName
	);
	const lastName = ref(
		storeLastName.value ||
            userStore.onboardingProfile?.lastName ||
            mockUser.value?.lastName ||
            accountProfileDefaults.lastName
	);
	const email = ref(
		userStore.email ||
            userStore.onboardingProfile?.email ||
            mockUser.value?.email ||
            accountProfileDefaults.email
	);

	const photoUrl = ref<string | null>(null);
	const photoError = ref('');

	const promotions = ref(true);
	const reviews = ref(true);
	const confirmations = ref(true);
	const useShippingAsBilling = ref(true);
	const unit = ref<ProfileUnit>('millimeter');

	const initialFirstName = ref(firstName.value.trim());
	const initialLastName = ref(lastName.value.trim());

	const initials = computed(() => {
		const first = firstName.value.trim().charAt(0).toUpperCase();
		const last = lastName.value.trim().charAt(0).toUpperCase();
		if (first && last) return `${first}${last}`;
		if (first) return first;
		if (last) return last;
		return 'U';
	});

	const hasEditedProfileDetails = computed(() => {
		return (
			firstName.value.trim() !== initialFirstName.value
			|| lastName.value.trim() !== initialLastName.value
		);
	});

	const hasUploadedPhoto = computed(() => Boolean(photoUrl.value));
	const canContinueProfileDetails = computed(() => hasEditedProfileDetails.value || hasUploadedPhoto.value);

	function dismissToast() {
		showWelcomeToast.value = false;
	}

	function clearToastTimeout() {
		if (!toastTimeout) return;
		clearTimeout(toastTimeout);
		toastTimeout = null;
	}

	function startToastTimeout() {
		clearToastTimeout();
		toastTimeout = setTimeout(() => {
			showWelcomeToast.value = false;
		}, 3500);
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

	async function onPhotoFilePicked(file: File | null) {
		photoError.value = '';
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
	}

	function removePhoto() {
		revokePhotoUrl();
		photoUrl.value = null;
		photoError.value = '';
	}

	function goNext() {
		step.value = 2;
	}

	function goBack() {
		step.value = 1;
	}

	async function completeSetup() {
		const authToken = useCookie<string | null>('auth_token');
		if (authToken.value && userStore.id) {
			try {
				if (import.meta.client && photoUrl.value) {
					window.localStorage.setItem(ACCOUNT_LOCAL_AVATAR_KEY, photoUrl.value);
					window.dispatchEvent(
						new CustomEvent(ACCOUNT_AVATAR_UPDATED_EVENT, { detail: photoUrl.value })
					);
				}

				const body = new FormData();
				body.append('first_name', firstName.value.trim());
				body.append('last_name', lastName.value.trim());

				await api(`/${apiCountry.value}/profile/${userStore.id}/complete-onboarding`, {
					method: 'POST',
					body,
				});

				const meResponse = await api<UserMeResponse>(`/${apiCountry.value}/user/me`);
				if (meResponse?.success && meResponse.data?.user) {
					userStore.setUser({
						...meResponse.data.user,
						profile: meResponse.data.profile ?? null,
					});
				}
			} catch (error) {
				console.warn('Failed to finalize onboarding.', error);
			}
		} else {
			mockUser.value = {
				firstName: firstName.value.trim() || accountProfileDefaults.firstName,
				lastName: lastName.value.trim() || accountProfileDefaults.lastName,
				email: email.value.trim() || accountProfileDefaults.email,
			};
		}
		await navigateTo(withCountry('/'));
	}

	watch(
		showWelcomeToast,
		(isVisible) => {
			if (isVisible) {
				startToastTimeout();
			} else {
				clearToastTimeout();
			}
		},
		{ immediate: true }
	);

	onBeforeUnmount(() => {
		clearToastTimeout();
		revokePhotoUrl();
	});

	userStore.clearOnboardingProfile();

	return {
		step,
		showWelcomeToast,
		firstName,
		lastName,
		email,
		photoUrl,
		photoError,
		promotions,
		reviews,
		confirmations,
		useShippingAsBilling,
		unit,
		initials,
		canContinueProfileDetails,
		dismissToast,
		onPhotoFilePicked,
		removePhoto,
		goNext,
		goBack,
		completeSetup,
	};
}