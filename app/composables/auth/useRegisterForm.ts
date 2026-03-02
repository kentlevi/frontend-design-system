import { nextTick, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/user';
import { useCountry } from '~/composables/app/useCountry';
import type { UserFieldValue, UserIdentity, UserProfile } from '~/stores/user';

export function useRegisterForm() {
    const router = useRouter();
    const userStore = useUserStore();
    const isVerificationModalOpen = ref(false);
    const api = useApi();
    const { t } = useI18n();
    const { withCountry, apiCountry } = useCountry();

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

    const verificationEmail = ref('');
    const verificationToken = ref('');
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

    watch(firstName, (value) => {
        if (value.trim()) {
            firstNameError.value = '';
        }
    });

    watch(email, (value) => {
        const trimmed = value.trim();
        if (!trimmed) return;
        if (isValidEmail(trimmed)) {
            emailError.value = '';
        }
    });

    watch(password, (value) => {
        if (value.trim()) {
            passwordError.value = '';
        }
    });

    watch(agreeTerms, (value) => {
        if (value) {
            termsError.value = '';
        }
    });

    interface RegisterVerificationResponse {
        success: boolean | string | number;
        message: string;
        data:
            | {
                  email: string;
                  token: string;
              }
            | Record<string, string[]>;
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

    interface LoginResponse {
        success: boolean;
        message: string;
        data: {
            user?: UserIdentity & { profile: UserProfile | null }
            auth_token?: string
        }
    }

    function getFirstError(
        payload: RegisterVerificationResponse['data'] | undefined,
        key: string
    ) {
        if (!payload || Array.isArray(payload) || typeof payload !== 'object') return '';
        const value = (payload as Record<string, unknown>)[key];
        if (!Array.isArray(value) || !value.length) return '';
        return String(value[0] ?? '').trim();
    }

    function resolveRegisterErrorMessage(payloadMessage?: string, fallbackMessage?: string) {
        const technicalMessagePattern = /(failed to fetch|\[post\]|network|fetch failed|load failed)/i;
        const message = (payloadMessage || fallbackMessage || '').trim();
        if (!message || technicalMessagePattern.test(message)) {
            return t('auth.register.validation.requestFailed');
        }
        return message;
    }

    function normalizeEmailErrorMessage(message: string) {
        if (!message) return message;
        if (/already been taken/i.test(message)) {
            return 'Email has already been taken.';
        }
        return message;
    }

    async function submitRegister() {
        clearErrors();

        if (!firstName.value.trim()) {
            firstNameError.value = t('auth.register.validation.fieldBlank');
        }

        if (!email.value.trim()) {
            emailError.value = t('auth.register.validation.fieldBlank');
        } else if (!isValidEmail(email.value.trim())) {
            emailError.value = t('auth.register.validation.emailInvalid');
        }

        if (!password.value.trim()) {
            passwordError.value = t('auth.register.validation.fieldBlank');
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

        try {
            const response = await api<RegisterVerificationResponse>(`/${apiCountry.value}/auth/register/verification`, {
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

            const isSuccess = response?.success === true || response?.success === 'true' || response?.success === 1;
            if (!isSuccess) {
                firstNameError.value =
                    getFirstError(response.data, 'given_name') ||
                    getFirstError(response.data, 'first_name');
                emailError.value = normalizeEmailErrorMessage(
                    getFirstError(response.data, 'email')
                );
                passwordError.value = getFirstError(response.data, 'password');
                termsError.value =
                    getFirstError(response.data, 'terms_of_service') ||
                    getFirstError(response.data, 'terms');
                if (
                    !firstNameError.value &&
                    !emailError.value &&
                    !passwordError.value &&
                    !termsError.value
                ) {
                    emailError.value = resolveRegisterErrorMessage(
                        response.message,
                        'Registration failed.'
                    );
                }
                return response
            }

            const verificationData = response.data as { email?: string; token?: string } | undefined;
            const resolvedEmail =
                typeof verificationData?.email === 'string' && verificationData.email.trim()
                    ? verificationData.email.trim()
                    : email.value.trim();
            const resolvedToken =
                typeof verificationData?.token === 'string' ? verificationData.token.trim() : '';

            if (!resolvedToken) {
                emailError.value = resolveRegisterErrorMessage(
                    response.message,
                    'Registration failed.'
                );
                return response;
            }

            verificationEmail.value = resolvedEmail;
            verificationToken.value = resolvedToken;
            verificationCode.value = '';
            verificationError.value = '';
            // Re-open explicitly in case state was previously left open/closed by a stale render cycle.
            isVerificationModalOpen.value = false;
            await nextTick();
            isVerificationModalOpen.value = true;
            return response
        } catch (error: any) {
            const payload = error?.data as RegisterVerificationResponse | undefined;
            const validation = payload?.data;
            firstNameError.value =
                getFirstError(validation, 'given_name') ||
                getFirstError(validation, 'first_name');
            emailError.value = normalizeEmailErrorMessage(
                getFirstError(validation, 'email')
            );
            passwordError.value = getFirstError(validation, 'password');
            termsError.value =
                getFirstError(validation, 'terms_of_service') ||
                getFirstError(validation, 'terms');

            if (!firstNameError.value && !emailError.value && !passwordError.value && !termsError.value) {
                emailError.value = resolveRegisterErrorMessage(
                    payload?.message,
                    error?.message || 'Registration failed.'
                );
            }
        }
    }

    async function submitVerification() {
        if (!verificationCode.value.trim()) {
            verificationError.value = t('auth.verification.codeRequired');
            return;
        }

        isVerifying.value = true;
        verificationError.value = '';

        try {
            const response = await api<RegisterResponse>(`/${apiCountry.value}/auth/register`, {
                method: 'POST',
                body: {
                    email: verificationEmail.value,
                    registration_token: verificationToken.value,
                    otp: verificationCode.value.trim(),
                }
            });

            if (response.success === false) {
                verificationError.value = response.message || t('auth.verification.invalidCode');
                return response;
            }

            try {
                const loginResponse = await api<LoginResponse>(`/${apiCountry.value}/auth/login`, {
                    method: 'POST',
                    body: {
                        email: email.value.trim(),
                        password: password.value.trim(),
                        remember_me: true
                    }
                })

                if (loginResponse?.success && loginResponse.data?.auth_token) {
                    const authToken = useCookie('auth_token', {
                        maxAge: 60 * 60 * 24 * 90,
                        sameSite: 'lax',
                        path: '/'
                    })

                    authToken.value = loginResponse.data.auth_token ?? ''

                    if (loginResponse.data.user) {
                        userStore.setUser(loginResponse.data.user)

                        const mockUser = useCookie<{
                            firstName: string;
                            lastName: string;
                            email: string;
                        } | null>('mock_user', {
                            sameSite: 'lax',
                            path: '/',
                        });

                        const fields = loginResponse.data.user.profile?.user_field_values ?? [];
                        const resolvedFirstName =
                            fields.find(
                                (field: UserFieldValue) =>
                                    field.country_field?.field_key === 'first_name' ||
                                    (field.country_field_id ??
                                        field.country_field_ids ??
                                        field.country_fields_id) === 1
                            )?.value?.trim() || firstName.value.trim();
                        const resolvedLastName =
                            fields.find(
                                (field: UserFieldValue) =>
                                    field.country_field?.field_key === 'last_name' ||
                                    (field.country_field_id ??
                                        field.country_field_ids ??
                                        field.country_fields_id) === 2
                            )?.value?.trim() || lastName.value.trim();
                        const fallbackRows = [...fields]
                            .filter((field) => typeof field.value === 'string' && field.value.trim())
                            .sort(
                                (a, b) =>
                                    (a.country_field_id ?? a.country_field_ids ?? a.country_fields_id ?? Number.MAX_SAFE_INTEGER) -
                                    (b.country_field_id ?? b.country_field_ids ?? b.country_fields_id ?? Number.MAX_SAFE_INTEGER)
                            )
                            .slice(0, 2);
                        let normalizedFirstName = resolvedFirstName || 'User';
                        let normalizedLastName = resolvedLastName || '';

                        if (!resolvedFirstName && fallbackRows[0]?.value) {
                            normalizedFirstName = fallbackRows[0].value.trim();
                        }
                        if (!resolvedLastName && fallbackRows[1]?.value) {
                            normalizedLastName = fallbackRows[1].value.trim();
                        }

                        if (!normalizedLastName && normalizedFirstName.includes(' ')) {
                            const parts = normalizedFirstName.split(/\s+/).filter(Boolean);
                            if (parts.length >= 2) {
                                normalizedFirstName = parts.slice(0, -1).join(' ');
                                normalizedLastName = parts[parts.length - 1] || '';
                            }
                        }

                        mockUser.value = {
                            firstName: normalizedFirstName,
                            lastName: normalizedLastName,
                            email: loginResponse.data.user.email || email.value.trim(),
                        };
                    }
                }
            } catch (error) {
                console.warn('Auto-login after registration failed.', error)
            }

            userStore.setOnboardingProfile({
                firstName: firstName.value.trim(),
                lastName: lastName.value.trim(),
                email: email.value.trim(),
                onboarding: true,
            });

            isVerificationModalOpen.value = false;
            await router.push(withCountry('/auth/profile'));
            return response;
        } catch {
            verificationError.value = t('auth.verification.invalidCode');
        } finally {
            isVerifying.value = false;
        }
    }

    async function resendVerification() {
        verificationError.value = '';

        try {
            const response = await api<RegisterVerificationResponse>(`/${apiCountry.value}/auth/register/verification`, {
                method: 'POST',
                body: {
                    given_name: firstName.value.trim(),
                    family_name: lastName.value.trim(),
                    email: verificationEmail.value.trim() || email.value.trim(),
                    password: password.value.trim(),
                    terms_of_service: agreeTerms.value,
                    newsletter: optInPromos.value
                }
            });

            const isSuccess = response?.success === true || response?.success === 'true' || response?.success === 1;
            if (!isSuccess) {
                verificationError.value = response?.message || t('auth.verification.invalidCode');
                return;
            }

            const verificationData = response.data as { email?: string; token?: string } | undefined;
            const resolvedToken =
                typeof verificationData?.token === 'string' ? verificationData.token.trim() : '';
            const resolvedEmail =
                typeof verificationData?.email === 'string' && verificationData.email.trim()
                    ? verificationData.email.trim()
                    : verificationEmail.value.trim() || email.value.trim();

            if (!resolvedToken) {
                verificationError.value = response?.message || t('auth.verification.invalidCode');
                return;
            }

            verificationEmail.value = resolvedEmail;
            verificationToken.value = resolvedToken;
            verificationCode.value = '';
        } catch (error: any) {
            verificationError.value =
                error?.data?.message || error?.message || t('auth.verification.invalidCode');
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
        resendVerification,
    };
}
