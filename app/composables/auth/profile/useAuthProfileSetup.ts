import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { accountProfileDefaults } from '~/data/account/profile';
import {
	getAuthErrorMessage,
	getAuthResponseMessage,
	isValidAuthEmail,
} from '~/helpers/auth/auth.helper';
import {
	getRemainingSecondsFromTimestamp,
	isTimestampExpired,
	useVerificationCooldown,
} from '~/composables/auth/verification/useVerificationCooldown';
import {
	getAccountInitials,
	getProfileFieldValue,
	processAccountAvatarFile,
	readFileAsDataUrl,
} from '~/utils/account/accountProfile';
import { useCountry } from '~/composables/app/country/useCountry';
import { sendEmailChangeOTP, verifyEmailChangeOtp } from '~/services/profile/changeEmail.service';
import { useUsersStore } from '~/stores/users/users.store';
import { useProfileFieldsStore } from '~/stores/profile_field';
import type { AccountMockUser } from '~/types/account/profile';
import { useAuthUser } from '../useAuthUser';
import { completeOnboarding } from '~/services/auth/auth.service';
import type { OnboardingPayload } from '~/types/auth/auth';

type ProfileStep = 1 | 2;
type ProfileUnit = 'millimeter' | 'inch';

type EmailVerificationSession = {
	email?: string;
	expires_at?: string | number | Date;
	resend_cooldown_until?: number;
	request_cooldown_until?: number;
};

const ACCOUNT_LOCAL_AVATAR_KEY = 'account_profile_avatar_data_url';
const ACCOUNT_AVATAR_UPDATED_EVENT = 'account-avatar-updated';
const ACCEPTED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png']);

export function useAuthProfileSetup() {
	const { withCountry, apiCountry } = useCountry();
	const api = useApi();
	const { t } = useI18n();
	const mock_user = useCookie<AccountMockUser | null>('mock_user', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	});
	const user_store = useUsersStore();
	const profile_fields_store = useProfileFieldsStore();
	const { state } = storeToRefs(user_store);

	const step = useCookie<ProfileStep>('auth_onboarding_step', {
		default: () => 1,
		path: '/',
		sameSite: 'lax',
	});
	const is_new_onboarding_flow = Boolean(state.value.onboardingProfile?.onboarding);
	const showWelcomeToast = ref(is_new_onboarding_flow);
	let toast_timeout: ReturnType<typeof setTimeout> | null = null;

	const email_verification_session = ref<EmailVerificationSession | null>(null);
	const is_email_verification_modal_open = ref(false);
	const verification_email = ref('');
	const verification_code = ref('');
	const verification_error = ref('');
	const resend_limit_reached = ref('');
	const email_input_error = ref('');
	const is_verifying_email = ref(false);
	const resend_cooldown = useVerificationCooldown();
	const request_cooldown = useVerificationCooldown();
	const resend_cooldown_remaining = resend_cooldown.remaining;
	const request_cooldown_remaining = request_cooldown.remaining;

	const profile_field_values = computed(
		() => state.value.profile?.user_field_values ?? []
	);
	const dynamic_profile_fields = computed(
		() => profile_fields_store.dynamic_profile_fields
	);
	const store_first_name = computed(
		() => getProfileFieldValue(
			profile_field_values.value,
			'first_name',
			dynamic_profile_fields.value
		)
	);
	const store_last_name = computed(
		() => getProfileFieldValue(
			profile_field_values.value,
			'last_name',
			dynamic_profile_fields.value
		)
	);
	const has_saved_email = computed(
		() => Boolean((state.value.email ?? '').trim())
	);
	const email_disabled = computed(() => has_saved_email.value);
	const email_required = computed(() => !has_saved_email.value);
	const can_skip_profile_details = computed(() => !email_required.value);

	function normalizeEmail(value: string | null | undefined) {
		return (value || '').trim().toLowerCase();
	}

	function isValidEmail(value: string) {
		return isValidAuthEmail(value.trim());
	}

	const first_name_source = computed(() =>
		store_first_name.value ||
		state.value.onboardingProfile?.firstName ||
		mock_user.value?.firstName ||
		accountProfileDefaults.firstName
	);
	const last_name_source = computed(() =>
		store_last_name.value ||
		state.value.onboardingProfile?.lastName ||
		mock_user.value?.lastName ||
		accountProfileDefaults.lastName
	);
	const email_source = computed(() =>
		state.value.email ||
		state.value.onboardingProfile?.email ||
		mock_user.value?.email ||
		accountProfileDefaults.email
	);
	const onboardingDraft = useCookie<Record<string, any>>('auth_onboarding_draft', {
		default: () => ({}),
		path: '/',
		sameSite: 'lax',
	});

	const firstName = ref(onboardingDraft.value.firstName || first_name_source.value);
	const lastName = ref(onboardingDraft.value.lastName || last_name_source.value);
	const email = ref(onboardingDraft.value.email || email_source.value);
	const original_email_from_state = ref(normalizeEmail(state.value.email));
	const is_syncing_from_state = ref(false);
	const has_first_name_manual_input = ref(Boolean(onboardingDraft.value.firstName));
	const has_last_name_manual_input = ref(Boolean(onboardingDraft.value.lastName));
	const has_email_manual_input = ref(Boolean(onboardingDraft.value.email));

	watch([firstName, lastName, email], ([f, l, e]) => {
		onboardingDraft.value = { ...onboardingDraft.value, firstName: f, lastName: l, email: e };
	});
	const has_required_email = computed(() => {
		if (!email_required.value) return true;
		return isValidEmail(email.value);
	});
	const email_changed_from_state = computed(() => {
		return normalizeEmail(email.value) !== original_email_from_state.value;
	});
	const requires_email_verification = computed(() => {
		if (!state.value.id) return false;
		if (!has_required_email.value) return false;
		return email_changed_from_state.value;
	});

	const photoUrl = ref<string | null>(null);
	const photoError = ref('');

	const promotions = ref(true);
	const reviews = ref(true);
	const useShippingAsBilling = ref(true);
	const unit = ref<ProfileUnit>('millimeter');

	const initial_first_name = ref(firstName.value.trim());
	const initial_last_name = ref(lastName.value.trim());

	const initials = computed(() => {
		return getAccountInitials(firstName.value.trim(), lastName.value.trim());
	});

	const has_edited_profile_details = computed(() => {
		return (
			firstName.value.trim() !== initial_first_name.value
			|| lastName.value.trim() !== initial_last_name.value
		);
	});

	const has_uploaded_photo = computed(() => Boolean(photoUrl.value));
	const canContinueProfileDetails = computed(() => {
		if (email_required.value) {
			return has_required_email.value;
		}

		return has_edited_profile_details.value || has_uploaded_photo.value;
	});

	function dismissToast() {
		showWelcomeToast.value = false;
	}

	function syncFieldFromState(target: typeof firstName, value: string) {
		is_syncing_from_state.value = true;
		target.value = value;
		queueMicrotask(() => {
			is_syncing_from_state.value = false;
		});
	}

	function clearToastTimeout() {
		if (!toast_timeout) return;
		clearTimeout(toast_timeout);
		toast_timeout = null;
	}

	function startToastTimeout() {
		clearToastTimeout();
		toast_timeout = setTimeout(() => {
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

	function getFirstError(payload: Record<string, unknown> | null | undefined, key: string): string {
		const field_errors = payload?.[key];
		if (!Array.isArray(field_errors) || field_errors.length === 0) {
			return '';
		}

		return String(field_errors[0]).trim();
	}

	function isVerificationSessionExpired() {
		return isTimestampExpired(email_verification_session.value?.expires_at);
	}

	function clearResendCooldownCache() {
		if (!email_verification_session.value) return;
		const { resend_cooldown_until: _resend_cooldown_until, ...rest } = email_verification_session.value;
		email_verification_session.value = Object.keys(rest).length > 0 ? rest : null;
	}

	function clearRequestCooldownCache() {
		if (!email_verification_session.value) return;
		const { request_cooldown_until: _request_cooldown_until, ...rest } = email_verification_session.value;
		email_verification_session.value = Object.keys(rest).length > 0 ? rest : null;
	}

	function setResendCooldownCache(seconds: number) {
		const now = Date.now();
		const cooldown_until = now + Math.max(0, Math.floor(seconds)) * 1000;
		email_verification_session.value = {
			...(email_verification_session.value || {}),
			resend_cooldown_until: cooldown_until,
		};
	}

	function setRequestCooldownCache(seconds: number) {
		const now = Date.now();
		const cooldown_until = now + Math.max(0, Math.floor(seconds)) * 1000;
		email_verification_session.value = {
			...(email_verification_session.value || {}),
			request_cooldown_until: cooldown_until,
		};
	}

	function applyResendCooldownFromResponse(response: unknown) {
		const seconds = resend_cooldown.applyFromResponse(response);
		if (seconds <= 0) {
			resend_cooldown.clear();
			clearResendCooldownCache();
			return;
		}

		setResendCooldownCache(seconds);
	}

	function applyRequestCooldownFromResponse(response: unknown) {
		const seconds = request_cooldown.applyFromResponse(response);
		if (seconds <= 0) {
			request_cooldown.clear();
			clearRequestCooldownCache();
			return;
		}

		setRequestCooldownCache(seconds);
	}

	function restoreCooldownsFromCache() {
		const resend_remaining = getRemainingSecondsFromTimestamp(
			email_verification_session.value?.resend_cooldown_until
		);
		if (resend_remaining > 0) {
			resend_cooldown.start(resend_remaining);
		} else {
			clearResendCooldownCache();
		}

		const request_remaining = getRemainingSecondsFromTimestamp(
			email_verification_session.value?.request_cooldown_until
		);
		if (request_remaining > 0) {
			request_cooldown.start(request_remaining);
		} else {
			clearRequestCooldownCache();
		}
	}

	function clearVerificationState() {
		verification_code.value = '';
		verification_error.value = '';
		resend_limit_reached.value = '';
		is_verifying_email.value = false;
	}

	function closeEmailVerificationModal() {
		is_email_verification_modal_open.value = false;
	}

	function canReusePendingVerification(email_value: string) {
		if (request_cooldown_remaining.value <= 0) return false;
		if (isVerificationSessionExpired()) return false;
		const session_email = normalizeEmail(email_verification_session.value?.email);
		return session_email === normalizeEmail(email_value);
	}

	async function requestEmailVerification(is_resend: boolean) {
		const target_email = email.value.trim();
		verification_email.value = target_email;
		const response = await sendEmailChangeOTP({
			email: target_email,
			is_resend,
		});

		applyRequestCooldownFromResponse(response);
		applyResendCooldownFromResponse(response);

		if (!response.success) {
			const meta_code = (response.meta as { code?: string } | null)?.code || '';
			const response_message = getAuthResponseMessage(response);

			if (meta_code === 'max_resend_reached') {
				resend_limit_reached.value = response_message || t('auth.verification.invalidCode');
				verification_error.value = '';
				return response;
			}

			const first_email_error = getFirstError(
				response.data as Record<string, unknown> | null | undefined,
				'email'
			);
			const fallback_error = first_email_error || response_message || t('auth.register.validation.emailInvalid');

			if (is_resend) {
				verification_error.value = fallback_error;
			} else {
				email_input_error.value = fallback_error;
			}

			return response;
		}

		const resolved_email =
			typeof response.data?.email === 'string' && response.data.email.trim()
				? response.data.email.trim()
				: target_email;

		verification_email.value = resolved_email;
		verification_code.value = '';
		verification_error.value = '';
		resend_limit_reached.value = '';
		email_verification_session.value = {
			...(email_verification_session.value || {}),
			email: resolved_email,
			expires_at: response.data?.expires_in,
		};

		return response;
	}

	async function goNext() {
		if (requires_email_verification.value) {
			const target_email = email.value.trim();
			if (canReusePendingVerification(target_email)) {
				verification_email.value = target_email;
				clearVerificationState();
				is_email_verification_modal_open.value = true;
				return;
			}
		}

		step.value = 2;
	}

	function resetFirstStepDraftToOriginalState() {
		syncFieldFromState(firstName, first_name_source.value);
		syncFieldFromState(lastName, last_name_source.value);
		syncFieldFromState(email, email_source.value);

		initial_first_name.value = first_name_source.value.trim();
		initial_last_name.value = last_name_source.value.trim();

		has_first_name_manual_input.value = false;
		has_last_name_manual_input.value = false;
		has_email_manual_input.value = false;
		email_input_error.value = '';

		// Skip means "discard first-step edits", including temporary avatar choice.
		removePhoto();
		clearVerificationState();
		is_email_verification_modal_open.value = false;
		email_verification_session.value = null;
		request_cooldown.clear();
		resend_cooldown.clear();
	}

	function skipProfileDetails() {
		resetFirstStepDraftToOriginalState();
		step.value = 2;
	}

	function goBack() {
		step.value = 1;
	}

	async function completeSetup() {
		if (email_required.value && !has_required_email.value) {
			step.value = 1;
			return;
		}

		if (state.value.id) {
			try {
				if (import.meta.client && photoUrl.value) {
					window.localStorage.setItem(ACCOUNT_LOCAL_AVATAR_KEY, photoUrl.value);
					window.dispatchEvent(
						new CustomEvent(ACCOUNT_AVATAR_UPDATED_EVENT, { detail: photoUrl.value })
					);
				}

				const payload: OnboardingPayload = {
					given_name: firstName.value.trim(),
					family_name: lastName.value.trim(),
					offers_emails: promotions.value,
					reviews_emails: reviews.value,
				};

				if (email_required.value) payload.email = email.value.trim()

				const response = await completeOnboarding(payload)

				if (!response.success) {
					return
				}

				const { fetchAndStoreUser } = useAuthUser()
				await fetchAndStoreUser()
				await navigateTo(withCountry('/'));
		
				// Clear Draft State
				step.value = 1;
				onboardingDraft.value = {};
				user_store.clearOnboardingProfile();
			} catch (error) {
				console.warn('Failed to finalize onboarding.', error);
			}
		} else {
			mock_user.value = {
				firstName: firstName.value.trim() || accountProfileDefaults.firstName,
				lastName: lastName.value.trim() || accountProfileDefaults.lastName,
				email: email.value.trim() || accountProfileDefaults.email,
			};
		}
		await navigateTo(withCountry('/'));

		// Clear Draft State
		step.value = 1;
		onboardingDraft.value = {};
		user_store.clearOnboardingProfile();
	}

	async function submitEmailVerification() {
		if (is_verifying_email.value) return;
		is_verifying_email.value = true;
		verification_error.value = '';

		try {
			const response = await verifyEmailChangeOtp({
				email: verification_email.value.trim() || email.value.trim(),
				otp: verification_code.value.trim(),
			});

			if (!response.success) {
				const otp_error = getFirstError(
					response.data as Record<string, unknown> | null | undefined,
					'otp'
				);
				verification_error.value =
					otp_error
					|| getAuthResponseMessage(response)
					|| t('auth.verification.invalidCode');
				return;
			}

			const verified_email = (verification_email.value || email.value).trim();
			user_store.patchUser({ email: verified_email });
			email.value = verified_email;
			original_email_from_state.value = normalizeEmail(verified_email);

			email_verification_session.value = null;
			request_cooldown.clear();
			resend_cooldown.clear();
			clearVerificationState();
			closeEmailVerificationModal();
			step.value = 2;
		} catch (error: unknown) {
			verification_error.value =
				getAuthErrorMessage(error)
				|| t('auth.verification.invalidCode');
		} finally {
			is_verifying_email.value = false;
		}
	}

	async function resendEmailVerification() {
		if (resend_cooldown_remaining.value > 0) return;
		verification_error.value = '';
		resend_limit_reached.value = '';

		try {
			const response = await requestEmailVerification(true);
			if (!response?.success) return;
		} catch (error: unknown) {
			verification_error.value =
				getAuthErrorMessage(error)
				|| t('auth.verification.invalidCode');
		}
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
	watch(first_name_source, (value) => {
		if (has_first_name_manual_input.value) return;
		syncFieldFromState(firstName, value);
		initial_first_name.value = value.trim();
	}, { immediate: true });
	watch(last_name_source, (value) => {
		if (has_last_name_manual_input.value) return;
		syncFieldFromState(lastName, value);
		initial_last_name.value = value.trim();
	}, { immediate: true });
	watch(email_source, (value) => {
		if (email_disabled.value || !has_email_manual_input.value) {
			syncFieldFromState(email, value);
		}
	}, { immediate: true });
	watch(firstName, () => {
		if (!is_syncing_from_state.value) {
			has_first_name_manual_input.value = true;
		}
	});
	watch(lastName, () => {
		if (!is_syncing_from_state.value) {
			has_last_name_manual_input.value = true;
		}
	});
	watch(email, () => {
		if (!is_syncing_from_state.value && !email_disabled.value) {
			has_email_manual_input.value = true;
		}
	});
	watch(email, () => {
		if (email_input_error.value) {
			email_input_error.value = '';
		}
	});
	watch(resend_cooldown_remaining, (value) => {
		if (value <= 0) {
			clearResendCooldownCache();
		}
	});
	watch(request_cooldown_remaining, (value) => {
		if (value <= 0) {
			clearRequestCooldownCache();
		}
	});
	watch(is_email_verification_modal_open, (open) => {
		if (open) return;
		clearVerificationState();
	});

	onBeforeUnmount(() => {
		clearToastTimeout();
		revokePhotoUrl();
		resend_cooldown.clear();
		request_cooldown.clear();
	});

	onMounted(() => {
		const country_id = state.value.country_id;
		if (country_id && profile_fields_store.dynamic_profile_fields.length === 0) {
			void profile_fields_store.ensureLoaded(country_id).catch(() => {
				// Keep onboarding non-blocking if dynamic field metadata cannot be loaded.
			});
		}

		restoreCooldownsFromCache();
	});



	return {
		step,
		showWelcomeToast,
		firstName,
		lastName,
		email,
		emailError: email_input_error,
		emailDisabled: email_disabled,
		emailRequired: email_required,
		photoUrl,
		photoError,
		promotions,
		reviews,
		useShippingAsBilling,
		unit,
		initials,
		canContinueProfileDetails,
		canSkipProfileDetails: can_skip_profile_details,
		dismissToast,
		onPhotoFilePicked,
		removePhoto,
		goNext,
		skipProfileDetails,
		goBack,
		isEmailVerificationModalOpen: is_email_verification_modal_open,
		verificationEmail: verification_email,
		verificationCode: verification_code,
		verificationError: verification_error,
		resendLimitReached: resend_limit_reached,
		isVerifyingEmail: is_verifying_email,
		verificationResendCooldownRemaining: resend_cooldown_remaining,
		closeEmailVerificationModal,
		submitEmailVerification,
		resendEmailVerification,
		completeSetup,
	};
}