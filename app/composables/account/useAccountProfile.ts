import { computed, onBeforeUnmount, ref } from 'vue';
import {
	accountProfileDefaults,
	type AccountMockUser,
	type AccountUnit,
} from '~/data/account/profile';
import {
	getAccountInitials,
	getProfileFieldValue,
	normalizeAccountName,
	processAccountAvatarFile,
	readFileAsDataUrl,
} from '~/composables/account/accountProfile.helpers';
import { useCountry } from '~/composables/app/useCountry';

const ACCOUNT_LOCAL_AVATAR_KEY = 'account_profile_avatar_data_url';
const ACCOUNT_AVATAR_UPDATED_EVENT = 'account-avatar-updated';
const ACCEPTED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png']);
const PROFILE_SAVE_OVERLAY_DELAY_MS = 700;

interface ApiErrorPayload {
	data?: {
		message?: string;
	};
}

export function useAccountProfile() {
	const { withCountry, apiCountry } = useCountry();
	const api = useApi();
	const userStore = useUserStore();
	const { t } = useI18n();
	const mockUser = useCookie<AccountMockUser | null>('mock_user');
	const authToken = useCookie<string | null>('auth_token');

	const profileFieldValues = computed(
		() => userStore.profile?.user_field_values ?? []
	);
	const storeFirstName = computed(
		() => getProfileFieldValue(profileFieldValues.value, 'first_name')
	);
	const storeLastName = computed(
		() => getProfileFieldValue(profileFieldValues.value, 'last_name')
	);

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
	const normalizedName = normalizeAccountName(rawFirstName, rawLastName);

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
	const photoError = ref('');
	const fileInput = ref<HTMLInputElement | null>(null);
	const localAvatarDataUrl = ref<string | null>(null);
	const savingProfile = ref(false);

	const avatarDisplayUrl = computed(() => photoUrl.value || localAvatarDataUrl.value);

	const initials = computed(() => {
		return getAccountInitials(firstName.value, lastName.value);
	});

	function openFilePicker() {
		fileInput.value?.click();
	}

	function revokePhotoUrl() {
		if (photoUrl.value?.startsWith('blob:')) {
			URL.revokeObjectURL(photoUrl.value);
		}
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
			processedFile = await processAccountAvatarFile(file);
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
		localAvatarDataUrl.value = null;
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

		savingProfile.value = true;
		try {
			await new Promise((resolve) => setTimeout(resolve, PROFILE_SAVE_OVERLAY_DELAY_MS));

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
			return true;
		} catch (error: unknown) {
			const apiError = error as ApiErrorPayload;
			photoError.value = apiError?.data?.message || 'Failed to save profile. Please try again.';
			return false;
		} finally {
			savingProfile.value = false;
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
		savingProfile,
		fileInput,
		initials,
		openFilePicker,
		onFilePicked,
		removePhoto,
		saveProfile,
		signOut,
	};
}