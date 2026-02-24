import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

export function useRegisterForm() {
    const router = useRouter();
    const userStore = useUserStore();
    const isVerificationModalOpen = ref(false);
    const api = useApi();
    const { t } = useI18n();

    const firstName = ref('');
    const lastName = ref('');
    const email = ref('');
    const password = ref('');
    const showPassword = ref(false);
    const agreeTerms = ref(false);
    const optInPromos = ref(false);

    const firstNameError = ref('');
    const emailError = ref('');
    const passwordError = ref('');
    const termsError = ref('');

    const verificationEmail = ref();
    const verificationToken = ref();
    const verificationCode = ref('');
    const verificationError = ref('');
    const isVerifying = ref(false);

    function isValidEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function clearErrors() {
        firstNameError.value = '';
        emailError.value = '';
        passwordError.value = '';
        termsError.value = '';
    }

    interface RegisterVerificationResponse {
        success: boolean;
        message: string;
        data: {
            email: string;
            token: string;
        };
        meta: {};
        error: {};
    }

    interface RegisterResponse {
        success: boolean;
        message: string;
        data: {};
        meta: {};
        error: {};
    }

    async function submitRegister() {
        clearErrors();

        if (!firstName.value.trim()) {
            firstNameError.value = t('auth.login.validation.fieldBlank');
        }

        if (!email.value.trim()) {
            emailError.value = t('auth.login.validation.fieldBlank');
        } else if (!isValidEmail(email.value.trim())) {
            emailError.value = t('auth.login.validation.emailInvalid');
        }

        if (!password.value.trim()) {
            passwordError.value = t('auth.login.validation.fieldBlank');
        }

        if (!agreeTerms.value) {
            termsError.value = t('auth.register.validation.mustAgree');
        }

        if (
            firstNameError.value ||
            emailError.value ||
            passwordError.value ||
            termsError.value
        ) {
            return;
        }

        // const params = new URLSearchParams({
        //     firstName: firstName.value.trim(),
        //     lastName: lastName.value.trim(),
        //     email: email.value.trim(),
        //     onboarding: '1',
        // });
        // await navigateTo(`${localePath('/auth/profile')}?${params.toString()}`);

        const response = await api<RegisterVerificationResponse>('/kr/auth/register/verification', {
            method: 'POST',
            body: {
                given_name: firstName.value.trim(),
                family_name: lastName.value.trim(),
                email: email.value.trim(),
                password: password.value.trim(),
                terms_of_service: agreeTerms.value,
                newsletter: optInPromos.value
            }
        })

        if (response.success === false) {
            return response
        }

        verificationEmail.value = response.data.email;
        verificationToken.value = response.data.token;
        verificationCode.value = '';
        verificationError.value = '';
        isVerificationModalOpen.value = true;
        return response
    }

    async function submitVerification() {
        if (!verificationCode.value.trim()) {
            verificationError.value = t('auth.login.verification.codeRequired');
            return;
        }

        isVerifying.value = true;
        verificationError.value = '';

        try {
            const response = await api<RegisterResponse>('/kr/auth/register', {
                method: 'POST',
                body: {
                    email: verificationEmail.value,
                    registration_token: verificationToken.value,
                    otp: verificationCode.value.trim(),
                }
            });

            if (response.success === false) {
                verificationError.value = response.message || 'Invalid verification code.';
                return response;
            }

            userStore.setOnboardingProfile({
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                email: email.value.trim(),
                onboarding: true,
            });

            isVerificationModalOpen.value = false;
            await router.push('/auth/profile');
            return response;
        } catch (error) {
            verificationError.value = 'Invalid verification code.';
        } finally {
            isVerifying.value = false;
        }
    }

    return {
        firstName,
        lastName,
        email,
        password,
        showPassword,
        agreeTerms,
        optInPromos,
        firstNameError,
        emailError,
        passwordError,
        termsError,
        isVerificationModalOpen,
        verificationEmail,
        verificationToken,
        verificationCode,
        verificationError,
        isVerifying,
        submitRegister,
        submitVerification,
    };
}
