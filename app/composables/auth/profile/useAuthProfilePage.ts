import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import {
	getCooldownSecondsFromResponse,
	getRemainingSecondsFromTimestamp,
} from '~/composables/auth/verification/useVerificationCooldown';
import { accountProfileDefaults } from '~/data/account/profile';
import {
	getAuthErrorMessage,
	getAuthResponseMessage,
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

function getNameFieldKey(
	dynamic_profile_fields: Array<{ field_key: string }>,
	possible_keys: string[]
) {
	const matched_field = dynamic_profile_fields.find((field) =>
		possible_keys.includes(field.field_key)
	);
	return matched_field?.field_key || '';
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

function setVerificationSessionPatch(
	onboarding_store: ReturnType<typeof useAuthOnboardingStore>,
	current_session: Record<string, unknown> | null | undefined,
	patch: Record<string, unknown> | null
) {
	if (!patch) {
		onboarding_store.setEmailVerificationSession(null);
		return;
	}

	onboarding_store.setEmailVerificationSession({
		...(current_session || {}),
		...patch,
	});
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

export function useAuthProfilePage() {
	const { t: translate } = useI18n();
	const onboarding_service = useAuthOnboardingService();
	const onboarding_store = useAuthOnboardingStore();
	const users_store = useUsersStore();
	const profile_fields_store = useProfileFieldsStore();

	const {
		step,
		profile_details_fields,
		email,
		show_welcome_toast,
		is_email_verification_modal_open,
		email_verification_session,
		verification_email,
		verification_code,
		is_verifying_email,
		verification_error,
		mock_user,
		onboarding_draft,
		resend_limit_reached,
		resend_cooldown_remaining,
		request_cooldown_remaining,
		email_input_error,
	} = storeToRefs(onboarding_store);
	const { state: user_state } = storeToRefs(users_store);
	const { dynamic_profile_fields: profile_fields } =
		storeToRefs(profile_fields_store);

	const has_initialized_profile_fields = ref(false);
	const has_email_manual_input = ref(Boolean(onboarding_draft.value.email));
	const is_syncing_email_from_state = ref(false);

	const dynamic_profile_fields = computed(() =>
		Array.isArray(profile_fields.value) ? profile_fields.value : []
	);
	const user_email = computed(() => user_state.value.email || '');
	const email_disabled = computed(() => Boolean(user_email.value.trim()));
	const email_source = computed(
		() =>
			user_email.value ||
			user_state.value.onboardingProfile?.email ||
			mock_user.value?.email ||
			accountProfileDefaults.email
	);
	const should_show_welcome_toast = computed(() =>
		Boolean(user_state.value.onboardingProfile?.onboarding)
	);
	const profile_field_values = computed(
		() => user_state.value.profile?.user_field_values ?? []
	);
	const first_name_source = computed(
		() =>
			getProfileFieldValue(
				profile_field_values.value,
				'first_name',
				dynamic_profile_fields.value
			) ||
			user_state.value.onboardingProfile?.firstName ||
			mock_user.value?.firstName ||
			accountProfileDefaults.firstName
	);
	const last_name_source = computed(
		() =>
			getProfileFieldValue(
				profile_field_values.value,
				'last_name',
				dynamic_profile_fields.value
			) ||
			user_state.value.onboardingProfile?.lastName ||
			mock_user.value?.lastName ||
			accountProfileDefaults.lastName
	);

	let toast_timeout: ReturnType<typeof setTimeout> | null = null;
	let resend_timer: ReturnType<typeof setInterval> | null = null;
	let request_timer: ReturnType<typeof setInterval> | null = null;

	function clearToastTimeout() {
		if (!toast_timeout) return;
		clearTimeout(toast_timeout);
		toast_timeout = null;
	}

	function startToastTimeout() {
		clearToastTimeout();
		toast_timeout = setTimeout(() => {
			onboarding_store.setShowWelcomeToast(false);
		}, 3500);
	}

	function clearCountdownTimer(type: 'resend' | 'request') {
		if (type === 'resend') {
			if (!resend_timer) return;
			clearInterval(resend_timer);
			resend_timer = null;
			return;
		}

		if (!request_timer) return;
		clearInterval(request_timer);
		request_timer = null;
	}

	function startCountdownTimer(type: 'resend' | 'request', seconds: number) {
		clearCountdownTimer(type);

		if (type === 'resend') {
			onboarding_store.setResendCooldownRemaining(seconds);
		} else {
			onboarding_store.setRequestCooldownRemaining(seconds);
		}

		if (seconds <= 0) return;

		const timer = setInterval(() => {
			const remaining =
				type === 'resend'
					? resend_cooldown_remaining.value
					: request_cooldown_remaining.value;

			if (remaining <= 1) {
				clearCountdownTimer(type);
				if (type === 'resend') {
					onboarding_store.setResendCooldownRemaining(0);
				} else {
					onboarding_store.setRequestCooldownRemaining(0);
				}
				return;
			}

			if (type === 'resend') {
				onboarding_store.setResendCooldownRemaining(remaining - 1);
			} else {
				onboarding_store.setRequestCooldownRemaining(remaining - 1);
			}
		}, 1000);

		if (type === 'resend') {
			resend_timer = timer;
			return;
		}

		request_timer = timer;
	}

	function buildSourceProfileDetailsFields() {
		const source_fields: Record<string, string> = {};
		const first_name_field_key = getNameFieldKey(
			dynamic_profile_fields.value,
			['first_name', 'given_name']
		);
		const last_name_field_key = getNameFieldKey(
			dynamic_profile_fields.value,
			['last_name', 'family_name']
		);

		for (const field of dynamic_profile_fields.value) {
			source_fields[field.field_key] = '';
		}

		const mapped_fields = mapProfileToPersonalFormState(
			dynamic_profile_fields.value,
			user_state.value.profile
		).fields;
		Object.assign(source_fields, mapped_fields);

		if (first_name_field_key && !source_fields[first_name_field_key]) {
			source_fields[first_name_field_key] = first_name_source.value;
		}

		if (last_name_field_key && !source_fields[last_name_field_key]) {
			source_fields[last_name_field_key] = last_name_source.value;
		}

		return source_fields;
	}

	function buildProfileDetailsFieldsFromDefinitions(
		source_fields: Record<string, string>,
		override_fields: Record<string, string> = {}
	) {
		const next_fields: Record<string, string> = {};

		for (const field of dynamic_profile_fields.value) {
			const field_key = field.field_key;
			const override_value = override_fields[field_key];
			next_fields[field_key] =
				typeof override_value === 'string'
					? override_value
					: source_fields[field_key] || '';
		}

		return next_fields;
	}

	function syncProfileDetailsFromSource(force = false) {
		if (!dynamic_profile_fields.value.length) return;

		const source_fields = buildSourceProfileDetailsFields();
		if (
			!force &&
			has_initialized_profile_fields.value &&
			!fieldsMatch(profile_details_fields.value, source_fields)
		) {
			return;
		}

		onboarding_store.setProfileDetailsFields(source_fields);
	}

	function syncEmailFromSource(value: string) {
		is_syncing_email_from_state.value = true;
		onboarding_store.setEmail(value);
		queueMicrotask(() => {
			is_syncing_email_from_state.value = false;
		});
	}

	async function loadDynamicProfileFields() {
		if (dynamic_profile_fields.value.length > 0) return;

		try {
			await onboarding_service.getDynamicProfileFields();
		} catch {
			// Keep onboarding non-blocking if field metadata fails to load.
		}
	}

	function restoreCooldownsFromSession() {
		const resend_remaining = getRemainingSecondsFromTimestamp(
			email_verification_session.value?.resend_cooldown_until
		);
		const request_remaining = getRemainingSecondsFromTimestamp(
			email_verification_session.value?.request_cooldown_until
		);

		onboarding_store.setResendCooldownRemaining(resend_remaining);
		onboarding_store.setRequestCooldownRemaining(request_remaining);
	}

	function clearVerificationState() {
		onboarding_store.setVerificationCode('');
		onboarding_store.setVerificationError('');
		onboarding_store.setResendLimitReached('');
		onboarding_store.setIsVerifyingEmail(false);
	}

	async function submitEmailVerification() {
		if (is_verifying_email.value) return;

		onboarding_store.setIsVerifyingEmail(true);
		onboarding_store.setVerificationError('');

		try {
			const response = await onboarding_service.verifyOtp({
				email: verification_email.value.trim() || email.value.trim(),
				otp: verification_code.value.trim(),
			});

			if (!response.success) {
				const otp_error = getFirstError(
					response.data as Record<string, unknown> | null | undefined,
					'otp'
				);
				onboarding_store.setVerificationError(
					otp_error ||
						getAuthResponseMessage(response) ||
						translate('auth.verification.invalidCode')
				);
				return;
			}

			onboarding_store.setEmailVerificationSession(null);
			onboarding_store.setResendCooldownRemaining(0);
			onboarding_store.setRequestCooldownRemaining(0);
			onboarding_store.setVerificationCode('');
			onboarding_store.setVerificationError('');
			onboarding_store.setResendLimitReached('');
			onboarding_store.setEmailVerificationModalOpen(false);
			onboarding_store.setStep(2);
		} catch (error: unknown) {
			onboarding_store.setVerificationError(
				getAuthErrorMessage(error) ||
					translate('auth.verification.invalidCode')
			);
		} finally {
			onboarding_store.setIsVerifyingEmail(false);
		}
	}

	async function resendEmailVerification() {
		if (resend_cooldown_remaining.value > 0) return;

		onboarding_store.setVerificationError('');
		onboarding_store.setResendLimitReached('');

		try {
			const response = await onboarding_service.sendVerificationRequest({
				email: email.value.trim(),
				is_resend: true,
			});

			const seconds = getCooldownSecondsFromResponse(response);
			if (seconds > 0) {
				const cooldown_until = Date.now() + Math.floor(seconds) * 1000;
				setVerificationSessionPatch(
					onboarding_store,
					email_verification_session.value,
					{
						resend_cooldown_until: cooldown_until,
						request_cooldown_until: cooldown_until,
					}
				);
				onboarding_store.setResendCooldownRemaining(seconds);
				onboarding_store.setRequestCooldownRemaining(seconds);
			} else {
				onboarding_store.setResendCooldownRemaining(0);
				onboarding_store.setRequestCooldownRemaining(0);
			}

			if (!response.success) {
				const meta_code =
					(response.meta as { code?: string } | null)?.code || '';
				const first_email_error = getFirstError(
					response.data as Record<string, unknown> | null | undefined,
					'email'
				);
				const fallback_error =
					first_email_error ||
					getAuthResponseMessage(response) ||
					translate('auth.verification.invalidCode');

				if (meta_code === 'max_resend_reached') {
					onboarding_store.setResendLimitReached(fallback_error);
					onboarding_store.setVerificationError('');
					return;
				}

				onboarding_store.setVerificationError(fallback_error);
				return;
			}

			const resolved_email =
				typeof response.data?.email === 'string' &&
				response.data.email.trim()
					? response.data.email.trim()
					: email.value.trim();

			onboarding_store.setVerificationEmail(resolved_email);
			onboarding_store.setVerificationCode('');
			onboarding_store.setVerificationError('');
			onboarding_store.setResendLimitReached('');
			setVerificationSessionPatch(
				onboarding_store,
				email_verification_session.value,
				{
					email: resolved_email,
					expires_at: response.data?.expires_in,
				}
			);
		} catch (error: unknown) {
			onboarding_store.setVerificationError(
				getAuthErrorMessage(error) ||
					translate('auth.verification.invalidCode')
			);
		}
	}

	async function initialize() {
		onboarding_store.setShowWelcomeToast(should_show_welcome_toast.value);

		if (!email.value) {
			onboarding_store.setEmail(
				onboarding_draft.value.email || email_source.value
			);
		}

		await loadDynamicProfileFields();
		restoreCooldownsFromSession();
		startCountdownTimer('resend', resend_cooldown_remaining.value);
		startCountdownTimer('request', request_cooldown_remaining.value);
	}

	function dispose() {
		clearToastTimeout();
		clearCountdownTimer('resend');
		clearCountdownTimer('request');
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
		[profile_details_fields, email],
		([fields_value, email_value]) => {
			onboarding_store.setOnboardingDraft({
				fields: { ...fields_value },
				email: email_value,
			});
		},
		{ deep: true }
	);

	watch(
		dynamic_profile_fields,
		() => {
			if (!dynamic_profile_fields.value.length) return;

			if (!has_initialized_profile_fields.value) {
				const source_fields = buildSourceProfileDetailsFields();
				const draft_fields = onboarding_draft.value.fields || {};
				const initial_fields = buildProfileDetailsFieldsFromDefinitions(
					source_fields,
					draft_fields
				);

				onboarding_store.setProfileDetailsFields(initial_fields);
				has_initialized_profile_fields.value = true;
				return;
			}

			syncProfileDetailsFromSource();
		},
		{ immediate: true }
	);

	watch([first_name_source, last_name_source], () => {
		syncProfileDetailsFromSource();
	});

	watch(
		email_source,
		(value) => {
			const normalized_source = normalizeEmail(value);
			const normalized_email = normalizeEmail(email.value);

			if (
				email_disabled.value ||
				!has_email_manual_input.value ||
				!normalized_email ||
				normalized_email === normalized_source
			) {
				syncEmailFromSource(value);
			}
		},
		{ immediate: true }
	);

	watch(email, () => {
		if (!is_syncing_email_from_state.value && !email_disabled.value) {
			has_email_manual_input.value = true;
		}
	});

	watch(email, () => {
		if (email_input_error.value) {
			onboarding_store.setEmailInputError('');
		}
	});

	watch(
		() => email_verification_session.value?.resend_cooldown_until,
		() => {
			restoreCooldownsFromSession();
			startCountdownTimer('resend', resend_cooldown_remaining.value);
		},
		{ immediate: true }
	);

	watch(
		() => email_verification_session.value?.request_cooldown_until,
		() => {
			restoreCooldownsFromSession();
			startCountdownTimer('request', request_cooldown_remaining.value);
		},
		{ immediate: true }
	);

	watch(is_email_verification_modal_open, (is_open) => {
		if (is_open) return;
		clearVerificationState();
	});

	watch(
		() => user_state.value.country_id,
		() => {
			void loadDynamicProfileFields();
		},
		{ immediate: true }
	);

	onMounted(() => {
		void initialize();
	});

	onBeforeUnmount(() => {
		dispose();
	});

	return {
		submitEmailVerification,
		resendEmailVerification,
		step,
		is_email_verification_modal_open,
		verification_email,
		verification_code,
		verification_error,
		resend_limit_reached,
		is_verifying_email,
		verification_resend_cooldown_remaining: resend_cooldown_remaining,
		setEmailVerificationModalOpen:
			onboarding_store.setEmailVerificationModalOpen,
		setVerificationCode: onboarding_store.setVerificationCode,
		closeEmailVerificationModal: () =>
			onboarding_store.setEmailVerificationModalOpen(false),
	};
}
