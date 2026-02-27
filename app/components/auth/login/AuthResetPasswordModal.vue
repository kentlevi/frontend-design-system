<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import type { UserFieldValue, UserIdentity, UserProfile } from '@/stores/user';
import { useCountry } from '@/composables/app/useCountry';

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
        email?: string;
        token?: string;
    }>(),
    {
        email: '',
        token: '',
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
    (e: 'updated'): void;
}>();

const api = useApi();
const router = useRouter();
const userStore = useUserStore();
const { withCountry, apiCountry } = useCountry();
const { t } = useI18n();

const password = ref('');
const confirmPassword = ref('');
const passwordVisible = ref(false);
const confirmVisible = ref(false);
const loading = ref(false);
const error = ref('');

watch(
    () => props.modelValue,
    (open) => {
        if (!open) return;
        password.value = '';
        confirmPassword.value = '';
        passwordVisible.value = false;
        confirmVisible.value = false;
        error.value = '';
    },
    { immediate: true }
);

function isStrongPassword(value: string) {
    return /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/.test(value);
}

async function submitChangePassword() {
    error.value = '';

    const email = props.email?.trim() || '';
    const token = props.token?.trim() || '';
    const newPassword = password.value.trim();
    const confirmNewPassword = confirmPassword.value.trim();

    if (!email || !token) {
        error.value = t('auth.reset.errors.missingLink');
        return;
    }

    if (!newPassword || !confirmNewPassword) {
        error.value = t('auth.reset.errors.fillBoth');
        return;
    }

    if (!isStrongPassword(newPassword)) {
        error.value = t('auth.reset.description');
        return;
    }

    if (newPassword !== confirmNewPassword) {
        error.value = t('auth.reset.errors.mismatch');
        return;
    }

    loading.value = true;

    try {
        const response = await api<{ success: boolean; message: string }>(
            `/${apiCountry.value}/auth/password/reset`,
            {
                method: 'POST',
                body: {
                    email,
                    token,
                    password: newPassword,
                    password_confirmation: confirmNewPassword,
                },
            }
        );

        if (!response?.success) {
            error.value = response?.message || t('auth.reset.errors.unable');
            return;
        }

        const loginResponse = await api<{
            success: boolean;
            message: string;
            data: {
                auth_token?: string;
                user?: UserIdentity & {
                    profile?: Pick<UserProfile, 'user_field_values'> | null;
                };
            };
        }>(`/${apiCountry.value}/auth/login`, {
            method: 'POST',
            body: {
                email,
                password: newPassword,
                remember_me: false,
            },
        });

        if (!loginResponse?.success || !loginResponse?.data?.auth_token) {
            error.value =
                loginResponse?.message ||
                t('auth.reset.errors.autoLoginFailed');
            return;
        }

        const authToken = useCookie('auth_token', {
            maxAge: 60 * 60 * 24 * 3,
            sameSite: 'lax',
            path: '/',
        });

        authToken.value = loginResponse.data.auth_token;

        if (loginResponse.data.user) {
            userStore.setUser(loginResponse.data.user);

            const mockUser = useCookie<{
                firstName: string;
                lastName: string;
                email: string;
            } | null>('mock_user', {
                sameSite: 'lax',
                path: '/',
            });

            const fields =
                loginResponse.data.user.profile?.user_field_values ?? [];
            const firstName =
                fields.find(
                    (field: UserFieldValue) =>
                        (field.country_field_ids ?? field.country_fields_id) ===
                        1
                )?.value?.trim() || '';
            const lastName =
                fields.find(
                    (field: UserFieldValue) =>
                        (field.country_field_ids ?? field.country_fields_id) ===
                        2
                )?.value?.trim() || '';

            mockUser.value = {
                firstName,
                lastName,
                email: loginResponse.data.user.email || email,
            };
        }

        emit('update:modelValue', false);
        emit('updated');
        router.push(withCountry('/'));
    } catch (err: any) {
        error.value =
            err?.data?.message || err?.message || t('auth.reset.errors.unable');
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <UiModal
        :model-value="modelValue"
        width="640px"
        padding="36px"
        gap="22px"
        data-testid="auth-reset-password-modal"
        @update:model-value="emit('update:modelValue', $event)"
    >
        <template #header>
            <div class="auth-reset-header">
                <UiLogo name="musticker" variant="mark" color="colored" :size="34" />
                <h3 class="auth-reset-title">{{ t('auth.reset.title') }}</h3>
                <p class="auth-reset-description">
                    {{ t('auth.reset.description') }}
                </p>
            </div>
        </template>

        <div class="auth-reset-body">
            <div class="auth-reset-field">
                <label class="auth-reset-label">{{ t('auth.reset.newPassword') }}</label>
                <UiInput
                    :model-value="password"
                    :type="passwordVisible ? 'text' : 'password'"
                    size="md"
                    :state="error ? 'error' : 'default'"
                    :placeholder="t('auth.reset.enterNewPassword')"
                    data-testid="auth-reset-password-input"
                    @update:model-value="password = $event"
                >
                    <template #icon-right>
                        <button
                            type="button"
                            class="auth-reset-toggle"
                            :aria-label="t('auth.reset.togglePassword')"
                            @click="passwordVisible = !passwordVisible"
                        >
                            <UiIcon
                                :name="passwordVisible ? 'regular-eye' : 'regular-eye-slash'"
                                :size="20"
                            />
                        </button>
                    </template>
                </UiInput>
            </div>

            <div class="auth-reset-field">
                <label class="auth-reset-label">{{ t('auth.reset.confirmPassword') }}</label>
                <UiInput
                    :model-value="confirmPassword"
                    :type="confirmVisible ? 'text' : 'password'"
                    size="md"
                    :state="error ? 'error' : 'default'"
                    :placeholder="t('auth.reset.enterConfirmPassword')"
                    data-testid="auth-reset-password-confirm-input"
                    @update:model-value="confirmPassword = $event"
                >
                    <template #icon-right>
                        <button
                            type="button"
                            class="auth-reset-toggle"
                            :aria-label="t('auth.reset.toggleConfirmPassword')"
                            @click="confirmVisible = !confirmVisible"
                        >
                            <UiIcon
                                :name="confirmVisible ? 'regular-eye' : 'regular-eye-slash'"
                                :size="20"
                            />
                        </button>
                    </template>
                </UiInput>
            </div>

            <p v-if="error" class="auth-reset-error">{{ error }}</p>

            <UiButton
                variant="filled"
                tone="neutral"
                size="lg"
                class="auth-reset-submit"
                :disabled="loading"
                data-testid="auth-reset-password-submit-button"
                @click="submitChangePassword"
            >
                {{ loading ? t('auth.reset.changing') : t('auth.reset.submit') }}
            </UiButton>
        </div>
    </UiModal>
</template>

<style scoped lang="scss">
.auth-reset-header {
    display: flex;
    flex-direction: column;
    gap: 12px;

    .auth-reset-title {
        margin: 6px 0 0;
        font-size: 52px;
        line-height: 1.04;
        letter-spacing: -0.02em;
        color: var(--text-primary);
    }

    .auth-reset-description {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 1.7;
    }
}

.auth-reset-body {
    display: flex;
    flex-direction: column;
    gap: 14px;

    .auth-reset-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .auth-reset-label {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
    }

    .auth-reset-toggle {
        border: 0;
        background: transparent;
        display: grid;
        place-items: center;
        cursor: pointer;
        color: var(--text-secondary);
    }

    .auth-reset-error {
        margin: 0;
        font-size: 13px;
        color: var(--error);
    }

    .auth-reset-submit {
        width: 100%;
        margin-top: 8px;
        border-radius: 16px;
        box-shadow: none;
    }
}

@media (max-width: 900px) {
    .auth-reset-header {
        .auth-reset-title {
            font-size: 34px;
        }
    }
}
</style>
