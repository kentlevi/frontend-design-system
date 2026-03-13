<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/user';
import type { UserFieldValue, UserIdentity, UserProfile } from '~/stores/user';
import { useCountry } from '~/composables/app/country/useCountry';

const props = withDefaults(
	defineProps<{
		modelValue: boolean;
		email?: string;
		token?: string;
		expiry?: string;
	}>(),
	{
		email: '',
		token: '',
		expiry: '',
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
	return /^(?=.{6,}$)(?![a-z]+$)(?![A-Z]+$).+$/.test(value);
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
		error.value = t('auth.reset.errors.passwordRequirements');
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

		if (!loginResponse?.success) {
			error.value =
				loginResponse?.message ||
                t('auth.reset.errors.autoLoginFailed');
			return;
		}

		if (loginResponse.data.user) {
			const normalizedUser: UserIdentity & { profile: UserProfile | null } = {
				...loginResponse.data.user,
				profile: (loginResponse.data.user.profile as UserProfile | null) ?? null,
			};
			userStore.setUser(normalizedUser);

			const guestLoginMode = useCookie<string | number | null>('guest_login_mode', {
				maxAge: 60 * 60 * 24 * 3,
				sameSite: 'lax',
				path: '/',
			});
			guestLoginMode.value = 0;

			const mockUser = useCookie<{
				firstName: string;
				lastName: string;
				email: string;
			} | null>('mock_user', {
				sameSite: 'lax',
				path: '/',
			});

			const fields =
				normalizedUser.profile?.user_field_values ?? [];
			const firstName =
				fields.find(
					(field: UserFieldValue) =>
						field.country_field?.field_key === 'first_name' ||
                        (field.country_field_id ?? field.country_field_ids ?? field.country_fields_id) ===
                        1
				)?.value?.trim() || '';
			const lastName =
				fields.find(
					(field: UserFieldValue) =>
						field.country_field?.field_key === 'last_name' ||
                        (field.country_field_id ?? field.country_field_ids ?? field.country_fields_id) ===
                        2
				)?.value?.trim() || '';
			const fallbackRows = [...fields]
				.filter((field) => typeof field.value === 'string' && field.value.trim())
				.sort(
					(a, b) =>
						(a.country_field_id ?? a.country_field_ids ?? a.country_fields_id ?? Number.MAX_SAFE_INTEGER) -
                        (b.country_field_id ?? b.country_field_ids ?? b.country_fields_id ?? Number.MAX_SAFE_INTEGER)
				)
				.slice(0, 2);

			mockUser.value = {
				firstName: firstName || fallbackRows[0]?.value?.trim() || '',
				lastName: lastName || fallbackRows[1]?.value?.trim() || '',
				email: normalizedUser.email || email,
			};
		} else {
			try {
				const meResponse = await api<{
					success: boolean;
					data?: { user?: UserIdentity; profile?: UserProfile | null };
				}>(`/${apiCountry.value}/user/me`, { method: 'GET' });

				if (meResponse?.success && meResponse.data?.user) {
					userStore.setUser({
						...meResponse.data.user,
						profile: meResponse.data.profile ?? null,
					});
				}
			} catch {
				// ignore
			}
		}

		emit('update:modelValue', false);
		emit('updated');
		router.push(withCountry('/'));
	} catch (err: unknown) {
		const errorPayload = err as { data?: { message?: string }; message?: string };
		error.value =
			errorPayload?.data?.message || errorPayload?.message || t('auth.reset.errors.unable');
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<UiModal
		:model-value="modelValue"
		width="504px"
		padding="40px"
		gap="40px"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<div class="auth-reset-body">
			<UiLoadingOverlay
				:visible="loading"
				:label="t('auth.reset.changing')"
				test-id="auth-reset-password-loading-overlay"
				position="absolute"
				background="rgba(246, 246, 248, 0.72)"
				:z-index="5"
				loader-width="74px"
				loader-height="74px"
			/>
			<div class="auth-reset-header">
				<UiLogo name="musticker" variant="mark" color="colored" :size="34" class="auth-reset-logo" />
				<div class="auth-reset-copy">
					<h3 class="auth-reset-title">{{ t('auth.reset.title') }}</h3>
					<p class="auth-reset-description">
						{{ t('auth.reset.description') }}
					</p>
				</div>
			</div>
			<div class="auth-reset-fields">
				<div class="auth-reset-field">
					<div class="auth-reset-field-head">
						<label class="auth-reset-label">{{ t('auth.reset.newPassword') }}</label>
						<p
							v-if="error"
							class="auth-reset-error"
							data-testid="auth-reset-error"
						>
							{{ error }}
						</p>
					</div>
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
							<UiButton
								variant="ghost"
								tone="neutral"
								size="sm"
								:no-hover="true"
								class="auth-reset-toggle"
								:aria-label="t('auth.reset.togglePassword')"
								:sr-label="t('auth.reset.togglePassword')"
								icon-only
								:icon="passwordVisible ? 'regular-eye' : 'regular-eye-slash'"
								:icon-size="20"
								@click="passwordVisible = !passwordVisible"
							/>
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
							<UiButton
								variant="ghost"
								tone="neutral"
								size="sm"
								:no-hover="true"
								class="auth-reset-toggle"
								:aria-label="t('auth.reset.toggleConfirmPassword')"
								:sr-label="t('auth.reset.toggleConfirmPassword')"
								icon-only
								:icon="confirmVisible ? 'regular-eye' : 'regular-eye-slash'"
								:icon-size="20"
								@click="confirmVisible = !confirmVisible"
							/>
						</template>
					</UiInput>
				</div>
			</div>

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
    gap: 24px;
	align-items: flex-start;

	.auth-reset-copy {
		display: flex;
		flex-direction: column;
		gap: 8px;
		.auth-reset-title {
			font-size: var(--type-size-500);
			line-height: var(--type-line-500);
			color: var(--text-primary);
		}

		.auth-reset-description {

			color: var(--text-secondary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
		}
	}

}

.auth-reset-body {
    position: relative;
    margin: calc(var(--ui-modal-padding, 40px) * -1);
    padding: var(--ui-modal-padding, 40px);
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 24px;

    .auth-reset-fields {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .auth-reset-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

	.auth-reset-field-head {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 12px;
	}

    .auth-reset-label {
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
    }

    .auth-reset-toggle {
        --btn-border: transparent;
        padding: 0;
        min-height: auto;
        width: 20px;
        height: 20px;
        border-radius: 0;
        box-shadow: none;
        color: var(--text-secondary);
    }

    .auth-reset-error {

        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        color: var(--error);
		text-align: right;
    }

    .auth-reset-submit {
        width: 100%;
        border-radius: 16px;
        box-shadow: none;
    }
}

:deep(.auth-reset-body .ui-loading-overlay) {
    border-radius: 14px;
}

@media (max-width: 900px) {
    .auth-reset-header {
        .auth-reset-title {
            font-size: var(--type-size-550);
            line-height: var(--type-line-550);
        }
    }
}
</style>