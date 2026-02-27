<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

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
const route = useRoute();
const userStore = useUserStore();
const country = computed(() =>
    String(route.params.country || 'en').toLowerCase()
);
const apiCountry = computed(() =>
    country.value === 'en' ? 'ph' : country.value
);

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
        error.value = 'Reset link is missing required information.';
        return;
    }

    if (!newPassword || !confirmNewPassword) {
        error.value = 'Please fill in both password fields.';
        return;
    }

    if (!isStrongPassword(newPassword)) {
        error.value =
            'Password must be at least 6 characters and include uppercase, number, and special character.';
        return;
    }

    if (newPassword !== confirmNewPassword) {
        error.value = 'Passwords do not match.';
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
            error.value = response?.message || 'Unable to reset password.';
            return;
        }

        const loginResponse = await api<{
            success: boolean;
            message: string;
            data: {
                auth_token?: string;
                user?: {
                    id: number;
                    code: string;
                    email: string;
                    profile?: {
                        user_field_values?: Array<{
                            country_field_ids?: number;
                            country_fields_id?: number;
                            value?: string;
                        }>;
                    };
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
                'Password changed, but automatic login failed.';
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
                    (field) =>
                        (field.country_field_ids ?? field.country_fields_id) ===
                        1
                )?.value?.trim() || '';
            const lastName =
                fields.find(
                    (field) =>
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
        router.push(`/${country.value}`);
    } catch (err: any) {
        error.value =
            err?.data?.message || err?.message || 'Unable to reset password.';
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
                <h3 class="auth-reset-title">Change Password</h3>
                <p class="auth-reset-description">
                    Password must be at least 6 characters and include an
                    uppercase letter, number, or special character.
                </p>
            </div>
        </template>

        <div class="auth-reset-body">
            <div class="auth-reset-field">
                <label class="auth-reset-label">New Password</label>
                <UiInput
                    :model-value="password"
                    :type="passwordVisible ? 'text' : 'password'"
                    size="md"
                    :state="error ? 'error' : 'default'"
                    placeholder="Enter New Password"
                    data-testid="auth-reset-password-input"
                    @update:model-value="password = $event"
                >
                    <template #icon-right>
                        <button
                            type="button"
                            class="auth-reset-toggle"
                            aria-label="Toggle password visibility"
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
                <label class="auth-reset-label">Confirm Password</label>
                <UiInput
                    :model-value="confirmPassword"
                    :type="confirmVisible ? 'text' : 'password'"
                    size="md"
                    :state="error ? 'error' : 'default'"
                    placeholder="Confirm New Password"
                    data-testid="auth-reset-password-confirm-input"
                    @update:model-value="confirmPassword = $event"
                >
                    <template #icon-right>
                        <button
                            type="button"
                            class="auth-reset-toggle"
                            aria-label="Toggle confirm password visibility"
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
                {{ loading ? 'Changing...' : 'Change Password' }}
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
