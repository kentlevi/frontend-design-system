import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import {
	getCooldownSecondsFromResponse,
	isTimestampExpired,
} from '~/composables/auth/verification/useVerificationCooldown';
import { accountProfileDefaults } from '~/data/account/profile';
import {
	getAuthResponseMessage,
	isValidAuthEmail,
} from '~/helpers/auth/auth.helper';
import { mapProfileToPersonalFormState } from '~/mappers/account/profile/personalForm.mapper';
import { useAuthOnboardingService } from '~/services/auth/onboarding.service';
import { useAuthOnboardingStore } from '~/stores/auth/onboarding.store';
import { useUsersStore } from '~/stores/users/users.store';
import { useProfileFieldsStore } from '~/stores/users/profile_field';
import { getProfileFieldValue } from '~/utils/account/accountProfile';

function normalizeEmail(value: string | null | undefined) {
	return (value || '').trim().toLowerCase();
}

function getFirstError(
	payload: Record<string, unknown> | null | undefined,
	key: string
) {
	const field_errors = payload?.[key];
	if (!Array.isArray(field_errors) || field_errors.length === 0) {
		return '';
	}

	return String(field_errors[0]).trim();
}

function getWelcomeName(
	fields: Record<string, string>,
	visible_dynamic_fields: Array<{ field_key: string }>
) {
	const first_name_field_aliases = new Set(['first_name', 'given_name']);

	for (const field of visible_dynamic_fields) {
		if (!first_name_field_aliases.has(field.field_key)) continue;
		const value = fields[field.field_key]?.trim();
		if (value) return value;
	}

	for (const field of visible_dynamic_fields) {
		const value = fields[field.field_key]?.trim();
		if (value) return value;
	}

	return '';
}

function fieldsMatch(
	first_fields: Record<string, string>,
	second_fields: Record<string, string>
) {
	const first_keys = Object.keys(first_fields).sort();
	const second_keys = Object.keys(second_fields).sort();

	if (first_keys.length !== second_keys.length) {
		return false;
	}

	return first_keys.every((key, index) => {
		if (key !== second_keys[index]) {
			return false;
		}

		return (
			(first_fields[key] || '').trim() ===
			(second_fields[key] || '').trim()
		);
	});
}

export function useAuthProfileDetailsStep() {
	const { t: translate } = useI18n();
	const onboarding_service = useAuthOnboardingService();
	const onboarding_store = useAuthOnboardingStore();
	const users_store = useUsersStore();
	const profile_fields_store = useProfileFieldsStore();
	const { dynamic_profile_fields: profile_fields } =
		storeToRefs(profile_fields_store);
	const {
		mock_user,
		email,
		profile_details_fields,
		request_cooldown_remaining,
		email_verification_session,
	} = storeToRefs(onboarding_store);
	const { state: user_state } = storeToRefs(users_store);

	function getDynamicProfileFields() {
		return Array.isArray(profile_fields.value) ? profile_fields.value : [];
	}

	function getVisibleDynamicFields() {
		return getDynamicProfileFields().filter((field) =>
			Boolean(field.field_key)
		);
	}

	function getProfileFieldValues() {
		return user_state.value.profile?.user_field_values ?? [];
	}

	function getStoreName(field_key: 'first_name' | 'last_name') {
		return getProfileFieldValue(
			getProfileFieldValues(),
			field_key,
			getDynamicProfileFields()
		);
	}

	function getSourceName(field_key: 'first_name' | 'last_name') {
		const store_value = getStoreName(field_key);
		if (store_value) return store_value;

		if (field_key === 'first_name') {
			return (
				user_state.value.onboardingProfile?.firstName ||
				mock_user.value?.firstName ||
				accountProfileDefaults.firstName
			);
		}

		return (
			user_state.value.onboardingProfile?.lastName ||
			mock_user.value?.lastName ||
			accountProfileDefaults.lastName
		);
	}

	function getNameFieldKey(possible_keys: string[]) {
		return (
			getDynamicProfileFields().find((field) =>
				possible_keys.includes(field.field_key)
			)?.field_key || ''
		);
	}

	function buildSourceProfileDetailsFields() {
		const source_fields: Record<string, string> = {};
		const dynamic_profile_fields = getDynamicProfileFields();
		const first_name_field_key = getNameFieldKey([
			'first_name',
			'given_name',
		]);
		const last_name_field_key = getNameFieldKey([
			'last_name',
			'family_name',
		]);

		for (const field of dynamic_profile_fields) {
			source_fields[field.field_key] = '';
		}

		const mapped_fields = mapProfileToPersonalFormState(
			dynamic_profile_fields,
			user_state.value.profile
		).fields;
		Object.assign(source_fields, mapped_fields);

		if (first_name_field_key && !source_fields[first_name_field_key]) {
			source_fields[first_name_field_key] = getSourceName('first_name');
		}

		if (last_name_field_key && !source_fields[last_name_field_key]) {
			source_fields[last_name_field_key] = getSourceName('last_name');
		}

		return source_fields;
	}

	function isEmailRequired() {
		return !Boolean((user_state.value.email || '').trim());
	}

	function hasRequiredEmail() {
		if (!isEmailRequired()) return true;
		return isValidAuthEmail(email.value.trim());
	}

	function hasEditedProfileDetails() {
		return !fieldsMatch(
			profile_details_fields.value,
			buildSourceProfileDetailsFields()
		);
	}

	function hasProfilePhoto() {
		return Boolean(user_state.value.profile?.file_name);
	}

	function requiresEmailVerification() {
		if (!isEmailRequired()) return false;
		if (!user_state.value.id) return false;
		if (!hasRequiredEmail()) return false;

		return (
			normalizeEmail(email.value) !==
			normalizeEmail(user_state.value.email)
		);
	}

	const can_skip_profile_details = computed(() => !isEmailRequired());
	const can_continue_profile_details = computed(() => {
		if (isEmailRequired()) {
			return hasRequiredEmail();
		}

		return hasEditedProfileDetails() || hasProfilePhoto();
	});
	const welcome_name = computed(() =>
		getWelcomeName(profile_details_fields.value, getVisibleDynamicFields())
	);

	function clearVerificationState() {
		onboarding_store.setVerificationCode('');
		onboarding_store.setVerificationError('');
		onboarding_store.setResendLimitReached('');
		onboarding_store.setIsVerifyingEmail(false);
	}

	function syncEmailFromSource(value: string) {
		onboarding_store.setEmail(value);
	}

	function setVerificationSessionPatch(
		patch: Record<string, unknown> | null
	) {
		if (!patch) {
			onboarding_store.setEmailVerificationSession(null);
			return;
		}

		onboarding_store.setEmailVerificationSession({
			...(email_verification_session.value || {}),
			...patch,
		});
	}

	function syncProfileDetailsFromSource() {
		onboarding_store.setProfileDetailsFields(
			buildSourceProfileDetailsFields()
		);
	}

	function canReusePendingVerification(email_value: string) {
		if (request_cooldown_remaining.value <= 0) return false;
		if (isTimestampExpired(email_verification_session.value?.expires_at)) {
			return false;
		}

		const session_email = normalizeEmail(
			email_verification_session.value?.email
		);
		return session_email === normalizeEmail(email_value);
	}

	function applyCooldownFromResponse(response: unknown) {
		const seconds = getCooldownSecondsFromResponse(response);
		if (seconds <= 0) {
			onboarding_store.setResendCooldownRemaining(0);
			onboarding_store.setRequestCooldownRemaining(0);
			return;
		}

		const cooldown_until = Date.now() + Math.floor(seconds) * 1000;
		setVerificationSessionPatch({
			resend_cooldown_until: cooldown_until,
			request_cooldown_until: cooldown_until,
		});
		onboarding_store.setResendCooldownRemaining(seconds);
		onboarding_store.setRequestCooldownRemaining(seconds);
	}

	async function requestEmailVerification(is_resend: boolean) {
		const target_email = email.value.trim();
		const response = await onboarding_service.sendVerificationRequest({
			email: target_email,
			is_resend,
		});

		applyCooldownFromResponse(response);

		if (!response.success) {
			const meta_code =
				(response.meta as { code?: string } | null)?.code || '';
			const response_message = getAuthResponseMessage(response);

			if (meta_code === 'max_resend_reached') {
				onboarding_store.setResendLimitReached(
					response_message ||
						translate('auth.verification.invalidCode')
				);
				onboarding_store.setVerificationError('');
				return response;
			}

			const first_email_error = getFirstError(
				response.data as Record<string, unknown> | null | undefined,
				'email'
			);
			const fallback_error =
				first_email_error ||
				response_message ||
				translate('auth.register.validation.emailInvalid');

			if (is_resend) {
				onboarding_store.setVerificationError(fallback_error);
			} else {
				onboarding_store.setEmailInputError(fallback_error);
			}

			return response;
		}

		const resolved_email =
			typeof response.data?.email === 'string' &&
			response.data.email.trim()
				? response.data.email.trim()
				: target_email;

		onboarding_store.setVerificationEmail(resolved_email);
		onboarding_store.setVerificationCode('');
		onboarding_store.setVerificationError('');
		onboarding_store.setResendLimitReached('');
		setVerificationSessionPatch({
			email: resolved_email,
			expires_at: response.data?.expires_in,
		});

		return response;
	}

	async function goNext() {
		if (requiresEmailVerification()) {
			const loading_overlay_store = useLoadingOverlayStore();
			loading_overlay_store.startLoading('set_default', {
				showCopy: true,
				testId: 'onboarding-set-default-overlay',
				position: 'fixed',
			});

			try {
				const target_email = email.value.trim();

				if (canReusePendingVerification(target_email)) {
					onboarding_store.setVerificationEmail(target_email);
					clearVerificationState();
					onboarding_store.setEmailVerificationModalOpen(true);
					return;
				}

				clearVerificationState();
				const response = await requestEmailVerification(false);

				if (!response?.success) {
					const meta_code =
						(response.meta as { code?: string } | null)?.code || '';
					if (meta_code === 'max_resend_reached') {
						onboarding_store.setEmailVerificationModalOpen(true);
					}
					return;
				}

				onboarding_store.setEmailVerificationModalOpen(true);
				return;
			} finally {
				loading_overlay_store.stopLoading('set_default');
			}
		}

		onboarding_store.setStep(2);
	}

	function skipProfileDetails() {
		syncProfileDetailsFromSource();
		syncEmailFromSource(user_state.value.email || '');
		onboarding_store.setEmailInputError('');
		clearVerificationState();
		onboarding_store.setEmailVerificationModalOpen(false);
		onboarding_store.setEmailVerificationSession(null);
		onboarding_store.setResendCooldownRemaining(0);
		onboarding_store.setRequestCooldownRemaining(0);
		onboarding_store.setStep(2);
	}

	return {
		can_continue_profile_details,
		can_skip_profile_details,
		welcome_name,
		goNext,
		skipProfileDetails,
	};
}
