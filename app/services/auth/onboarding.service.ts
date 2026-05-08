import { useAuthOnboardingStore } from '~/stores/auth/onboarding.store';
import { useUsersStore } from '~/stores/users/users.store';
import {
	sendEmailChangeOTP,
	verifyEmailChangeOtp,
} from '../profile/changeEmail.service';
import { fetchPersonalFieldDefinitions } from '../profile/personalForm.service';
import { ensureDynamicFields } from '../profile-dynamic-fields/dynamic-fields.service';

export function useAuthOnboardingService() {
	const onboarding_store = useAuthOnboardingStore();
	const users_store = useUsersStore();

	async function getDynamicProfileFields() {
		const response = await fetchPersonalFieldDefinitions();
		await ensureDynamicFields()
		return response;
	}

	async function sendVerificationRequest(params: {
		email: string;
		is_resend: boolean;
	}) {
		const email = params.email.trim();
		onboarding_store.setVerificationEmail(email);
		return sendEmailChangeOTP({
			...params,
			email,
		});
	}

	async function verifyOtp(params: {
		email: string;
		otp: string;
	}) {
		const email = params.email.trim();
		const otp = params.otp.trim();
		const response = await verifyEmailChangeOtp({
			email,
			otp,
		});

		if (response.success) {
			users_store.patchUser({ email });
			onboarding_store.setEmail(email);
		}

		return response;
	}

	return {
		getDynamicProfileFields,
		sendVerificationRequest,
		verifyOtp
	};
}

export type AuthOnboardingService = ReturnType<typeof useAuthOnboardingService>;