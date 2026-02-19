import { computed, ref, watch } from 'vue';
import { useLoginForm } from '@/composables/auth/useLoginForm';

export function useLoginPageForm() {
    const { t } = useI18n();

    const {
        memberType,
        keepSignedIn,
        showPassword,
        isNonMember,
        setMemberType,
        togglePassword,
        setKeepSignedIn,
    } = useLoginForm();

    const submitLabel = computed(() =>
        isNonMember.value ? t('auth.login.checkOrder') : t('auth.login.signIn')
    );

    const isVerificationModalOpen = ref(false);
    const isForgotPasswordModalOpen = ref(false);

    const memberEmail = ref('');
    const memberPassword = ref('');
    const nonMemberEmail = ref('');
    const nonMemberOrderNumber = ref('');

    const memberEmailError = ref('');
    const memberPasswordError = ref('');
    const nonMemberEmailError = ref('');
    const nonMemberOrderError = ref('');

    const demoMemberEmail = 'joy_love1990@gmail.com';
    const demoMemberPassword = 'joylove1990';
    const demoOrderNumber = '2502160001';

    watch(memberType, () => {
        memberEmailError.value = '';
        memberPasswordError.value = '';
        nonMemberEmailError.value = '';
        nonMemberOrderError.value = '';
    });

    function isValidEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateMember() {
        memberEmailError.value = '';
        memberPasswordError.value = '';

        if (!memberEmail.value.trim()) {
            memberEmailError.value = t('auth.login.validation.fieldBlank');
        } else if (!isValidEmail(memberEmail.value.trim())) {
            memberEmailError.value = t('auth.login.validation.emailInvalid');
        }

        if (!memberPassword.value.trim()) {
            memberPasswordError.value = t('auth.login.validation.fieldBlank');
        }

        if (memberEmailError.value || memberPasswordError.value) {
            return false;
        }

        if (
            memberEmail.value.trim().toLowerCase() !== demoMemberEmail ||
            memberPassword.value !== demoMemberPassword
        ) {
            memberEmailError.value = t(
                'auth.login.validation.credentialsMismatch'
            );
            memberPasswordError.value = t(
                'auth.login.validation.credentialsMismatch'
            );
            return false;
        }

        return true;
    }

    function validateNonMember() {
        nonMemberEmailError.value = '';
        nonMemberOrderError.value = '';

        if (!nonMemberEmail.value.trim()) {
            nonMemberEmailError.value = t('auth.login.validation.fieldBlank');
        } else if (!isValidEmail(nonMemberEmail.value.trim())) {
            nonMemberEmailError.value = t('auth.login.validation.emailInvalid');
        }

        if (!nonMemberOrderNumber.value.trim()) {
            nonMemberOrderError.value = t('auth.login.validation.fieldBlank');
        }

        if (nonMemberEmailError.value || nonMemberOrderError.value) {
            return false;
        }

        if (nonMemberOrderNumber.value.trim() !== demoOrderNumber) {
            nonMemberOrderError.value = t('auth.login.validation.orderNotFound');
            return false;
        }

        return true;
    }

    function onMemberEmailInput(value: string) {
        memberEmail.value = value;
        memberEmailError.value = '';
    }

    function onMemberPasswordInput(value: string) {
        memberPassword.value = value;
        memberPasswordError.value = '';
    }

    function onNonMemberEmailInput(value: string) {
        nonMemberEmail.value = value;
        nonMemberEmailError.value = '';
    }

    function onNonMemberOrderInput(value: string) {
        nonMemberOrderNumber.value = value;
        nonMemberOrderError.value = '';
    }

    function onSubmitClick() {
        if (!isNonMember.value) {
            validateMember();
            return;
        }

        if (!validateNonMember()) return;
        isVerificationModalOpen.value = true;
    }

    function openForgotPasswordModal() {
        isForgotPasswordModalOpen.value = true;
    }

    return {
        memberType,
        keepSignedIn,
        showPassword,
        isNonMember,
        setMemberType,
        togglePassword,
        setKeepSignedIn,
        submitLabel,
        isVerificationModalOpen,
        isForgotPasswordModalOpen,
        memberEmail,
        memberPassword,
        nonMemberEmail,
        nonMemberOrderNumber,
        memberEmailError,
        memberPasswordError,
        nonMemberEmailError,
        nonMemberOrderError,
        onMemberEmailInput,
        onMemberPasswordInput,
        onNonMemberEmailInput,
        onNonMemberOrderInput,
        onSubmitClick,
        openForgotPasswordModal,
    };
}
