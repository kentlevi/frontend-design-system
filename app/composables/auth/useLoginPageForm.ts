import { computed, onMounted, ref, watch } from 'vue';
import { useLoginForm } from '~/composables/auth/useLoginForm';
import { useRoute, useRouter } from 'vue-router';
import { useCountry } from '~/composables/app/useCountry';
import type { UserFieldValue, UserIdentity, UserProfile } from '~/stores/user';
import { HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY } from '~/data/home/onboarding';

export function useLoginPageForm() {
    const api = useApi();
    const { t } = useI18n();

    const router = useRouter();
    const route = useRoute();
    const { withCountry, apiCountry } = useCountry();

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
    const guestVerificationEmail = ref('');
    const guestVerificationOrderNumber = ref('');
    const guestVerificationToken = ref('');
    const guestVerificationCode = ref('');
    const guestVerificationError = ref('');
    const isGuestVerifying = ref(false);

    const memberEmail = ref('');
    const memberPassword = ref('');
    const nonMemberEmail = ref('');
    const nonMemberOrderNumber = ref('');

    const memberEmailError = ref('');
    const memberPasswordError = ref('');
    const memberInvalidCredentials = ref(false);
    const nonMemberEmailError = ref('');
    const nonMemberOrderError = ref('');

    watch(memberType, () => {
        memberEmailError.value = '';
        memberPasswordError.value = '';
        memberInvalidCredentials.value = false;
        nonMemberEmailError.value = '';
        nonMemberOrderError.value = '';
    });

    function isValidEmail(value: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateMember() {
        memberEmailError.value = '';
        memberPasswordError.value = '';
        memberInvalidCredentials.value = false;

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

        return true;
    }

    function onMemberEmailInput(value: string) {
        memberEmail.value = value;
        memberEmailError.value = '';
        memberInvalidCredentials.value = false;
    }

    function onMemberPasswordInput(value: string) {
        memberPassword.value = value;
        memberPasswordError.value = '';
        memberEmailError.value = '';
        memberInvalidCredentials.value = false;
    }

    function onNonMemberEmailInput(value: string) {
        nonMemberEmail.value = value;
        nonMemberEmailError.value = '';
    }

    function onNonMemberOrderInput(value: string) {
        nonMemberOrderNumber.value = value;
        nonMemberOrderError.value = '';
    }

    interface LoginResponse {
        success: boolean;
        message: string;
        data: {
            user?: UserIdentity & { profile: UserProfile | null };
            auth_token?: string;
        };
    }

    interface GuestOtpRequestResponse {
        success: boolean;
        message: string;
        data?: {
            verification_token?: string;
            expires_in?: number;
        };
    }

    interface GuestOtpVerifyResponse {
        success: boolean;
        message: string;
        data?: {
            order_lookup_token?: string;
            order_number?: string;
        };
    }

    async function onSubmitClick() {
        if (isNonMember.value === false) {
            const response = await memberLoginHandler();
            if (response?.success === true) {
                if (import.meta.client) {
                    window.localStorage.setItem(HOME_LOGIN_SUCCESS_TOAST_PENDING_KEY, '1');
                }
                await router.push(withCountry('/'));
            }
        } else {
            await nonMemberLoginHandler();
        }
    }

    async function memberLoginHandler() {
        if (!validateMember()) return;

        try {
            const response = await api<LoginResponse>(`/${apiCountry.value}/auth/login`, {
                method: 'POST',
                body: {
                    email: memberEmail.value.trim(),
                    password: memberPassword.value.trim(),
                    remember_me: keepSignedIn.value,
                },
            });

            if (response.success === false) {
                memberEmailError.value = t('auth.login.validation.credentialsMismatch');
                memberPasswordError.value = '';
                memberInvalidCredentials.value = true;
                return response;
            }
            memberInvalidCredentials.value = false;

            const tokenDuration =
                keepSignedIn.value === true ? 60 * 60 * 24 * 90 : 60 * 60 * 24 * 3;
            // store auth_token in cookie
            const authToken = useCookie('auth_token', {
                maxAge: tokenDuration,
                sameSite: 'lax',
                path: '/',
            });

            authToken.value = response?.data?.auth_token ?? '';

            // store user in Pinia
            const userStore = useUserStore();
            if (response.data.user) {
                userStore.setUser(response.data.user);

                const mockUser = useCookie<{
                    firstName: string;
                    lastName: string;
                    email: string;
                } | null>('mock_user', {
                    sameSite: 'lax',
                    path: '/',
                });

                const fields = response.data.user.profile?.user_field_values ?? [];
                const firstName =
                    fields.find((field) =>
                        field.country_field?.field_key === 'first_name' ||
                        (field.country_field_id ?? field.country_field_ids ?? field.country_fields_id) === 1
                    )?.value?.trim() || '';
                const lastName =
                    fields.find((field) =>
                        field.country_field?.field_key === 'last_name' ||
                        (field.country_field_id ?? field.country_field_ids ?? field.country_fields_id) === 2
                    )?.value?.trim() || '';
                const existing = mockUser.value;
                const emailValue = response.data.user.email || memberEmail.value.trim();
                const fallbackRows = [...fields]
                    .filter((field) => typeof field.value === 'string' && field.value.trim())
                    .sort(
                        (a, b) =>
                            (a.country_field_id ?? a.country_field_ids ?? a.country_fields_id ?? Number.MAX_SAFE_INTEGER) -
                            (b.country_field_id ?? b.country_field_ids ?? b.country_fields_id ?? Number.MAX_SAFE_INTEGER)
                    )
                    .slice(0, 2);
                let resolvedFirstName =
                    firstName || fallbackRows[0]?.value?.trim() || existing?.firstName || '';
                let resolvedLastName =
                    lastName || fallbackRows[1]?.value?.trim() || existing?.lastName || '';

                if (!resolvedLastName && resolvedFirstName.includes(' ')) {
                    const parts = resolvedFirstName.split(/\s+/).filter(Boolean);
                    if (parts.length >= 2) {
                        resolvedFirstName = parts.slice(0, -1).join(' ');
                        resolvedLastName = parts[parts.length - 1] || '';
                    }
                }

                mockUser.value = {
                    firstName: resolvedFirstName,
                    lastName: resolvedLastName,
                    email: emailValue,
                };
            } else {
                console.warn('No user returned from login API');
            }

            return response;
        } catch (error: any) {
            memberEmailError.value = t('auth.login.validation.credentialsMismatch');
            memberPasswordError.value = '';
            memberInvalidCredentials.value = true;
            console.error(error);
        }
    }

    async function nonMemberLoginHandler() {
        if (!validateNonMember()) {
            return;
        }

        const email = nonMemberEmail.value.trim();
        const orderNumber = nonMemberOrderNumber.value.trim();

        guestVerificationError.value = '';

        try {
            const response = await api<GuestOtpRequestResponse>(
                `/${apiCountry.value}/auth/login/guest/verification`,
                {
                    method: 'POST',
                    body: {
                        email,
                        order_number: orderNumber,
                    },
                }
            );

            if (!response.success) {
                guestVerificationError.value =
                    response.message || t('auth.guestVerification.requestFailed');
                return;
            }

            guestVerificationEmail.value = email;
            guestVerificationOrderNumber.value = orderNumber;
            guestVerificationToken.value = response.data?.verification_token || '';
            guestVerificationCode.value = '';
            isVerificationModalOpen.value = true;
        } catch (error: any) {
            guestVerificationError.value =
                error?.data?.message ||
                error?.message ||
                t('auth.guestVerification.requestFailed');
        }
    }

    async function submitGuestVerification() {
        if (!guestVerificationCode.value.trim()) {
            guestVerificationError.value = t('auth.guestVerification.codeRequired');
            return;
        }

        isGuestVerifying.value = true;
        guestVerificationError.value = '';

        try {
            const response = await api<GuestOtpVerifyResponse>(
                `/${apiCountry.value}/auth/login/guest/verify`,
                {
                    method: 'POST',
                    body: {
                        email: guestVerificationEmail.value,
                        order_number: guestVerificationOrderNumber.value,
                        verification_token: guestVerificationToken.value || undefined,
                        otp: guestVerificationCode.value.trim(),
                    },
                }
            );

            if (!response.success) {
                guestVerificationError.value =
                    response.message || t('auth.guestVerification.invalidCode');
                return;
            }

            const resolvedOrderNumber =
                response.data?.order_number || guestVerificationOrderNumber.value;

            isVerificationModalOpen.value = false;
            await router.push(
                withCountry(`/account/orders?order_number=${encodeURIComponent(resolvedOrderNumber)}`)
            );
        } catch (error: any) {
            guestVerificationError.value =
                error?.data?.message ||
                error?.message ||
                t('auth.guestVerification.invalidCode');
        } finally {
            isGuestVerifying.value = false;
        }
    }

    async function resendGuestVerification() {
        if (!guestVerificationEmail.value || !guestVerificationOrderNumber.value) return;

        try {
            const response = await api<GuestOtpRequestResponse>(
                `/${apiCountry.value}/auth/login/guest/verification`,
                {
                    method: 'POST',
                    body: {
                        email: guestVerificationEmail.value,
                        order_number: guestVerificationOrderNumber.value,
                    },
                }
            );

            if (response.success) {
                guestVerificationToken.value = response.data?.verification_token || '';
            }
        } catch {
            // Keep UX non-blocking for resend tap failures.
        }
    }

    watch(isVerificationModalOpen, (open) => {
        if (open) return;
        guestVerificationCode.value = '';
        guestVerificationError.value = '';
        isGuestVerifying.value = false;
    });

    function openForgotPasswordModal() {
        isForgotPasswordModalOpen.value = true;
    }

    onMounted(() => {
        const modalQuery = Array.isArray(route.query.modal)
            ? route.query.modal[0]
            : route.query.modal;
        const shouldOpenForgotPassword =
            modalQuery === 'forgot-password' || modalQuery === 'reset-password';

        if (!shouldOpenForgotPassword) return;

        const emailQuery = Array.isArray(route.query.email)
            ? route.query.email[0]
            : route.query.email;

        if (typeof emailQuery === 'string' && emailQuery.trim().length > 0) {
            memberEmail.value = emailQuery;
        }

        isForgotPasswordModalOpen.value = true;
    });

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
        guestVerificationEmail,
        guestVerificationOrderNumber,
        guestVerificationToken,
        guestVerificationCode,
        guestVerificationError,
        isGuestVerifying,
        nonMemberEmail,
        nonMemberOrderNumber,
        memberEmailError,
        memberPasswordError,
        memberInvalidCredentials,
        nonMemberEmailError,
        nonMemberOrderError,
        onMemberEmailInput,
        onMemberPasswordInput,
        onNonMemberEmailInput,
        onNonMemberOrderInput,
        submitGuestVerification,
        resendGuestVerification,
        onSubmitClick,
        openForgotPasswordModal,
    };
}
