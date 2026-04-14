import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AccountMockUser } from '~/types/account/profile';
import type {
	EmailVerificationSession,
	OnboardingDraft,
	ProfileStep,
} from '~/types/auth/onboarding';

function createDefaultOnboardingDraft(): OnboardingDraft {
	return {
		fields: {},
		email: '',
	};
}

export const useAuthOnboardingStore = defineStore('auth_onboarding', () => {
	const mock_user = useCookie<AccountMockUser | null>('mock_user', {
		default: () => null,
		sameSite: 'lax',
		path: '/',
	});
	const step = useCookie<ProfileStep>('auth_onboarding_step', {
		default: () => 1,
		path: '/',
		sameSite: 'lax',
	});
	const onboarding_draft = useCookie<OnboardingDraft>(
		'auth_onboarding_draft',
		{
			default: () => createDefaultOnboardingDraft(),
			path: '/',
			sameSite: 'lax',
		}
	);

	const email_verification_session = ref<EmailVerificationSession | null>(
		null
	);
	const is_email_verification_modal_open = ref(false);
	const verification_email = ref('');
	const verification_code = ref('');
	const verification_error = ref('');
	const resend_limit_reached = ref('');
	const email_input_error = ref('');
	const is_verifying_email = ref(false);

	const profile_details_fields = ref<Record<string, string>>({});
	const email = ref('');

	const promotions = ref(true);
	const reviews = ref(true);

	const resend_cooldown_remaining = ref(0);
	const request_cooldown_remaining = ref(0);

	function setMockUser(value: AccountMockUser | null) {
		mock_user.value = value;
	}

	function setStep(value: ProfileStep) {
		step.value = value;
	}

	function setOnboardingDraft(value: OnboardingDraft) {
		onboarding_draft.value = {
			fields: { ...(value.fields || {}) },
			email: value.email || '',
		};
	}

	function clearOnboardingDraft() {
		onboarding_draft.value = createDefaultOnboardingDraft();
	}

	function setEmailVerificationSession(
		value: EmailVerificationSession | null
	) {
		email_verification_session.value = value;
	}

	function setEmailVerificationModalOpen(value: boolean) {
		is_email_verification_modal_open.value = value;
	}

	function setVerificationEmail(value: string) {
		verification_email.value = value;
	}

	function setVerificationCode(value: string) {
		verification_code.value = value;
	}

	function setVerificationError(value: string) {
		verification_error.value = value;
	}

	function setResendLimitReached(value: string) {
		resend_limit_reached.value = value;
	}

	function setEmailInputError(value: string) {
		email_input_error.value = value;
	}

	function setIsVerifyingEmail(value: boolean) {
		is_verifying_email.value = value;
	}

	function setProfileDetailsFields(value: Record<string, string>) {
		profile_details_fields.value = value;
	}

	function updateProfileDetailField(field_key: string, value: string) {
		profile_details_fields.value = {
			...profile_details_fields.value,
			[field_key]: value,
		};
	}

	function setEmail(value: string) {
		email.value = value;
	}

	function setPromotions(value: boolean) {
		promotions.value = value;
	}

	function setReviews(value: boolean) {
		reviews.value = value;
	}

	function setResendCooldownRemaining(value: number) {
		resend_cooldown_remaining.value = value;
	}

	function setRequestCooldownRemaining(value: number) {
		request_cooldown_remaining.value = value;
	}

	return {
		mock_user,
		step,
		onboarding_draft,
		email_verification_session,
		is_email_verification_modal_open,
		verification_email,
		verification_code,
		verification_error,
		resend_limit_reached,
		email_input_error,
		is_verifying_email,
		profile_details_fields,
		email,
		promotions,
		reviews,
		resend_cooldown_remaining,
		request_cooldown_remaining,

		setMockUser,
		setStep,
		setOnboardingDraft,
		clearOnboardingDraft,
		setEmailVerificationSession,
		setEmailVerificationModalOpen,
		setVerificationEmail,
		setVerificationCode,
		setVerificationError,
		setResendLimitReached,
		setEmailInputError,
		setIsVerifyingEmail,
		setProfileDetailsFields,
		updateProfileDetailField,
		setEmail,
		setPromotions,
		setReviews,
		setResendCooldownRemaining,
		setRequestCooldownRemaining,
	};
});