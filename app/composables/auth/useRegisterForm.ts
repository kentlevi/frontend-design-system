import { ref } from 'vue';

export function useRegisterForm() {
    const localePath = useLocalePath();
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

    function isValidEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function clearErrors() {
        firstNameError.value = '';
        emailError.value = '';
        passwordError.value = '';
        termsError.value = '';
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

        const params = new URLSearchParams({
            firstName: firstName.value.trim(),
            lastName: lastName.value.trim(),
            email: email.value.trim(),
            onboarding: '1',
        });
        await navigateTo(`${localePath('/auth/profile')}?${params.toString()}`);
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
        submitRegister,
    };
}
