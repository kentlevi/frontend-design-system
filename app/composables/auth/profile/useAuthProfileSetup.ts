import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { accountProfileDefaults } from '~/data/account/profile';
import {
	getAccountInitials,
	getProfileFieldValue,
	processAccountAvatarFile,
	readFileAsDataUrl,
} from '~/utils/account/accountProfile';
import { useCountry } from '~/composables/app/country/useCountry';
import { useUserStore } from '~/stores/user';
import type { AccountMockUser } from '~/types/account/profile';

type ProfileStep = 1 | 2;
type ProfileUnit = 'millimeter' | 'inch';

const ACCOUNT_LOCAL_AVATAR_KEY = 'account_profile_avatar_data_url';
const ACCOUNT_AVATAR_UPDATED_EVENT = 'account-avatar-updated';
const ACCEPTED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png']);

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
	const storeFirstName = computed(
		() => getProfileFieldValue(profileFieldValues.value, 'first_name')
	);
	const storeLastName = computed(
		() => getProfileFieldValue(profileFieldValues.value, 'last_name')
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
		return getAccountInitials(firstName.value.trim(), lastName.value.trim());
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

	async function onPhotoFilePicked(file: File | null) {
		photoError.value = '';
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
				body.append('given_name', firstName.value.trim());
				body.append('family_name', lastName.value.trim());
				body.append('offers_emails', promotions.value ? '1' : '0');
				body.append('reviews_emails', reviews.value ? '1' : '0');
				body.append('confirmations_emails', confirmations.value ? '1' : '0');

				await api(`/${apiCountry.value}/user/complete-onboarding`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${authToken.value}`
					},
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