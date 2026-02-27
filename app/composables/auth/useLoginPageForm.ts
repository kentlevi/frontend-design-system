import { computed, onMounted, ref, watch } from 'vue';
import { useLoginForm } from '@/composables/auth/useLoginForm';
import { useRoute, useRouter } from 'vue-router';

export function useLoginPageForm() {
    const api = useApi();
    const { t } = useI18n();

    const router = useRouter();
    const route = useRoute();
    const country = computed(() =>
        String(route.params.country || 'en').toLowerCase()
    );
    const apiCountry = computed(() =>
        country.value === 'en' ? 'ph' : country.value
    );

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

    interface LoginResponse {
        success: boolean;
        message: string;
        data: {
            user?: {
                id: number;
                code: string;
                email: string;
                profile: {
                    id: number;
                    user_id: number;
                    file_path_id: number;
                    file_name: string;
                    user_field_values: Array<{
                        id: number;
                        user_profile_id: number;
                        country_field_ids?: number;
                        country_fields_id?: number;
                        value: string;
                    }>;
                };
            };
            auth_token?: string;
        };
    }

    async function onSubmitClick() {
        if (isNonMember.value === false) {
            const response = await memberLoginHandler();
            if (response?.success === true) {
                await router.push(`/${country.value}`);
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
                memberPasswordError.value =
                    response.message || t('auth.login.validation.credentialsMismatch');
                return response;
            }

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
                        (field.country_field_ids ?? field.country_fields_id) === 1
                    )?.value?.trim() || '';
                const lastName =
                    fields.find((field) =>
                        (field.country_field_ids ?? field.country_fields_id) === 2
                    )?.value?.trim() || '';

                mockUser.value = {
                    firstName,
                    lastName,
                    email: response.data.user.email || memberEmail.value.trim(),
                };
            } else {
                console.warn('No user returned from login API');
            }

            return response;
        } catch (error: any) {
            memberPasswordError.value =
                error?.data?.message ||
                error?.message ||
                t('auth.login.validation.credentialsMismatch');
            console.error(error);
        }
    }

    async function nonMemberLoginHandler() {
        if (!validateNonMember()) {
            return;
        }

        await api(`/${apiCountry.value}/auth/login/guest/verification`, {
            method: 'POST',
            body: {
                email: nonMemberEmail.value.trim(),
                order_number: nonMemberOrderNumber.value.trim(),
            },
        });

        isVerificationModalOpen.value = true;
    }

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
