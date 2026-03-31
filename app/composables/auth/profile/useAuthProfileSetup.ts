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
import { mapProfileToPersonalFormState } from '~/mappers/account/profile/personalForm.mapper';
import { useCountry } from '~/composables/app/country/useCountry';
import { sendEmailChangeOTP, verifyEmailChangeOtp } from '~/services/profile/changeEmail.service';
import { fetchPersonalFieldDefinitions } from '~/services/profile/personalForm.service';
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

type OnboardingDraft = {
	fields?: Record<string, string>;
	email?: string;
};

const ACCOUNT_AVATAR_UPDATED_EVENT = 'account-avatar-updated';
const ACCEPTED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png']);

export function useAuthProfileSetup() {
	const { withCountry } = useCountry();
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
	const show_welcome_toast = ref(is_new_onboarding_flow);
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

	const profile_field_values = computed(() =>
		state.value.profile?.user_field_values ?? []
	);
	const dynamic_profile_fields = computed(() =>
		Array.isArray(profile_fields_store.dynamic_profile_fields)
			? profile_fields_store.dynamic_profile_fields
			: []
	);
	const store_first_name = computed(() =>
		getProfileFieldValue(
			profile_field_values.value,
			'first_name',
			dynamic_profile_fields.value
		)
	);
	const store_last_name = computed(() =>
		getProfileFieldValue(
			profile_field_values.value,
			'last_name',
			dynamic_profile_fields.value
		)
	);
	const has_saved_email = computed(() =>
		Boolean((state.value.email ?? '').trim())
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
		store_first_name.value
		|| state.value.onboardingProfile?.firstName
		|| mock_user.value?.firstName
		|| accountProfileDefaults.firstName
	);
	const last_name_source = computed(() =>
		store_last_name.value
		|| state.value.onboardingProfile?.lastName
		|| mock_user.value?.lastName
		|| accountProfileDefaults.lastName
	);
	const email_source = computed(() =>
		state.value.email
		|| state.value.onboardingProfile?.email
		|| mock_user.value?.email
		|| accountProfileDefaults.email
	);
	const onboarding_draft = useCookie<OnboardingDraft>('auth_onboarding_draft', {
		default: () => ({
			fields: {},
			email: '',
		}),
		path: '/',
		sameSite: 'lax',
	});

	const profile_details_fields = ref<Record<string, string>>({});
	const initial_profile_details_fields = ref<Record<string, string>>({});
	const has_initialized_profile_fields = ref(false);
	const email = ref(onboarding_draft.value.email || email_source.value);
	const original_email_from_state = ref(normalizeEmail(state.value.email));
	const is_syncing_from_state = ref(false);
	const has_profile_fields_manual_input = ref(
		Object.keys(onboarding_draft.value.fields || {}).length > 0
	);
	const has_email_manual_input = ref(Boolean(onboarding_draft.value.email));

	function getNameFieldKey(possible_keys: string[]) {
		const matched_field = dynamic_profile_fields.value.find((field) =>
			possible_keys.includes(field.field_key)
		);
		return matched_field?.field_key || '';
	}

	function buildSourceProfileDetailsFields() {
		const source_fields: Record<string, string> = {};

		for (const field of dynamic_profile_fields.value) {
			source_fields[field.field_key] = '';
		}

		const mapped_fields = mapProfileToPersonalFormState(
			dynamic_profile_fields.value,
			state.value.profile
		).fields;
		Object.assign(source_fields, mapped_fields);

		const first_name_key = getNameFieldKey(['first_name', 'given_name']);
		if (first_name_key && !source_fields[first_name_key]) {
			source_fields[first_name_key] = first_name_source.value;
		}

		const last_name_key = getNameFieldKey(['last_name', 'family_name']);
		if (last_name_key && !source_fields[last_name_key]) {
			source_fields[last_name_key] = last_name_source.value;
		}

		return source_fields;
	}

	function buildProfileDetailsFieldsFromDefinitions(
		source_fields: Record<string, string>,
		draft_fields: Record<string, string> = {}
	) {
		const next_fields: Record<string, string> = {};

		for (const field of dynamic_profile_fields.value) {
			const field_key = field.field_key;
			const draft_value = draft_fields[field_key];
			next_fields[field_key] = typeof draft_value === 'string'
				? draft_value
				: (source_fields[field_key] || '');
		}

		return next_fields;
	}

	function syncProfileDetailsFromSource(force = false) {
		if (!dynamic_profile_fields.value.length) return;
		if (has_profile_fields_manual_input.value && !force) return;

		const source_fields = buildSourceProfileDetailsFields();
		const synced_fields = buildProfileDetailsFieldsFromDefinitions(source_fields);

		profile_details_fields.value = synced_fields;
		initial_profile_details_fields.value = { ...synced_fields };
	}

	function updateProfileDetailField(field_key: string, value: string) {
		profile_details_fields.value = {
			...profile_details_fields.value,
			[field_key]: value,
		};
		has_profile_fields_manual_input.value = true;
	}

	watch(
		[profile_details_fields, email],
		([fields_value, email_value]) => {
			onboarding_draft.value = {
				fields: { ...fields_value },
				email: email_value,
			};
		},
		{ deep: true }
	);

	const first_name_field_key = computed(() =>
		getNameFieldKey(['first_name', 'given_name'])
	);
	const last_name_field_key = computed(() =>
		getNameFieldKey(['last_name', 'family_name'])
	);
	const first_name = computed(() => {
		const field_key = first_name_field_key.value;
		if (!field_key) return first_name_source.value.trim();
		return (profile_details_fields.value[field_key] || '').trim();
	});
	const last_name = computed(() => {
		const field_key = last_name_field_key.value;
		if (!field_key) return last_name_source.value.trim();
		return (profile_details_fields.value[field_key] || '').trim();
	});

	const has_required_email = computed(() => {
		if (!email_required.value) return true;
		return isValidEmail(email.value);
	});
	const email_changed_from_state = computed(() =>
		normalizeEmail(email.value) !== original_email_from_state.value
	);
	const requires_email_verification = computed(() => {
		if (!state.value.id) return false;
		if (!has_required_email.value) return false;
		return email_changed_from_state.value;
	});

	const photo_url = ref<string | null>(null);
	const photo_error = ref('');

	const promotions = ref(true);
	const reviews = ref(true);
	const use_shipping_as_billing = ref(true);
	const unit = ref<ProfileUnit>('millimeter');

	const initials = computed(() =>
		getAccountInitials(first_name.value, last_name.value)
	);

	const has_edited_profile_details = computed(() => {
		const current_keys = Object.keys(profile_details_fields.value).sort();
		const initial_keys = Object.keys(initial_profile_details_fields.value).sort();

		if (current_keys.length !== initial_keys.length) return true;

		return current_keys.some((key, index) => {
			if (key !== initial_keys[index]) return true;
			return (profile_details_fields.value[key] || '').trim()
				!== (initial_profile_details_fields.value[key] || '').trim();
		});
	});

	const has_uploaded_photo = computed(() => Boolean(photo_url.value));
	const can_continue_profile_details = computed(() => {
		if (email_required.value) {
			return has_required_email.value;
		}

		return has_edited_profile_details.value || has_uploaded_photo.value;
	});

	function dismissToast() {
		show_welcome_toast.value = false;
	}

	function syncFieldFromState(target: { value: string }, value: string) {
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
			show_welcome_toast.value = false;
		}, 3500);
	}

	function revokePhotoUrl() {
		if (photo_url.value?.startsWith('blob:')) {
			URL.revokeObjectURL(photo_url.value);
		}
	}

	async function onPhotoFilePicked(file: File | null) {
		photo_error.value = '';
		if (!file) return;
		if (!ACCEPTED_IMAGE_MIME_TYPES.has(file.type.toLowerCase())) {
			photo_error.value = t('auth.profile.details.photoInvalidType');
			return;
		}

		let processed_file: File;
		try {
			processed_file = await processAccountAvatarFile(file);
		} catch {
			photo_error.value = t('auth.profile.details.photoProcessFailed');
			return;
		}

		revokePhotoUrl();
		try {
			photo_url.value = await readFileAsDataUrl(processed_file);
		} catch {
			photo_error.value = t('auth.profile.details.photoProcessFailed');
			return;
		}
	}

	function removePhoto() {
		revokePhotoUrl();
		photo_url.value = null;
		photo_error.value = '';
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
		syncProfileDetailsFromSource(true);
		syncFieldFromState(email, email_source.value);

		has_profile_fields_manual_input.value = false;
		has_email_manual_input.value = false;
		email_input_error.value = '';

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
				if (import.meta.client && photo_url.value) {
					window.dispatchEvent(
						new CustomEvent(ACCOUNT_AVATAR_UPDATED_EVENT, { detail: photo_url.value })
					);
				}
				const payload: OnboardingPayload = {
					fields: { ...profile_details_fields.value },
					offers_emails: promotions.value,
					reviews_emails: reviews.value,
				};

				if (email_required.value) payload.email = email.value.trim();

				const response = await completeOnboarding(payload);

				if (!response.success) {
					return;
				}

				const { fetchAndStoreUser } = useAuthUser();
				await fetchAndStoreUser();
				await navigateTo(withCountry('/'));

				step.value = 1;
				onboarding_draft.value = {};
				user_store.clearOnboardingProfile();
			} catch (error) {
				console.warn('Failed to finalize onboarding.', error);
			}
		} else {
			mock_user.value = {
				firstName: first_name.value || accountProfileDefaults.firstName,
				lastName: last_name.value || accountProfileDefaults.lastName,
				email: email.value.trim() || accountProfileDefaults.email,
			};
		}
		await navigateTo(withCountry('/'));

		step.value = 1;
		onboarding_draft.value = {};
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
		show_welcome_toast,
		(is_visible) => {
			if (is_visible) {
				startToastTimeout();
			} else {
				clearToastTimeout();
			}
		},
		{ immediate: true }
	);
	watch(
		dynamic_profile_fields,
		() => {
			if (!dynamic_profile_fields.value.length) return;

			if (!has_initialized_profile_fields.value) {
				const source_fields = buildSourceProfileDetailsFields();
				const draft_fields = onboarding_draft.value.fields || {};
				const has_draft_fields = Object.keys(draft_fields).length > 0;

				const initial_fields = buildProfileDetailsFieldsFromDefinitions(
					source_fields,
					has_draft_fields ? draft_fields : {}
				);

				profile_details_fields.value = initial_fields;
				initial_profile_details_fields.value = { ...initial_fields };
				has_profile_fields_manual_input.value = has_draft_fields;
				has_initialized_profile_fields.value = true;
				return;
			}

			syncProfileDetailsFromSource();
		},
		{ immediate: true }
	);
	watch(
		[first_name_source, last_name_source],
		() => {
			syncProfileDetailsFromSource();
		}
	);
	watch(email_source, (value) => {
		if (email_disabled.value || !has_email_manual_input.value) {
			syncFieldFromState(email, value);
		}
	}, { immediate: true });
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
	watch(is_email_verification_modal_open, (is_open) => {
		if (is_open) return;
		clearVerificationState();
	});

	async function loadDynamicProfileFields() {
		if (profile_fields_store.dynamic_profile_fields.length > 0) {
			return;
		}

		const country_id = state.value.country_id;
		if (country_id) {
			try {
				await profile_fields_store.ensureLoaded(country_id);
				if (profile_fields_store.dynamic_profile_fields.length > 0) {
					return;
				}
			} catch {
				// Fall through to direct fetch for parity with profile personal section.
			}
		}

		try {
			const response = await fetchPersonalFieldDefinitions();
			if (Array.isArray(response.data) && response.data.length > 0) {
				profile_fields_store.setDynamicProfileFields(response.data);
			}
		} catch {
			// Keep onboarding non-blocking if dynamic field metadata cannot be loaded.
		}
	}

	watch(
		() => state.value.country_id,
		() => {
			void loadDynamicProfileFields();
		},
		{ immediate: true }
	);

	onBeforeUnmount(() => {
		clearToastTimeout();
		revokePhotoUrl();
		resend_cooldown.clear();
		request_cooldown.clear();
	});

	onMounted(() => {
		void loadDynamicProfileFields();
		restoreCooldownsFromCache();
	});

	return {
		step,
		show_welcome_toast,
		profile_details_fields,
		dynamic_profile_fields,
		email,
		email_error: email_input_error,
		email_disabled,
		email_required,
		photo_url,
		photo_error,
		promotions,
		reviews,
		use_shipping_as_billing,
		unit,
		initials,
		can_continue_profile_details,
		can_skip_profile_details,
		dismissToast,
		onPhotoFilePicked,
		removePhoto,
		updateProfileDetailField,
		goNext,
		skipProfileDetails,
		goBack,
		is_email_verification_modal_open,
		verification_email,
		verification_code,
		verification_error,
		resend_limit_reached,
		is_verifying_email,
		verification_resend_cooldown_remaining: resend_cooldown_remaining,
		closeEmailVerificationModal,
		submitEmailVerification,
		resendEmailVerification,
		completeSetup,
	};
}