<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCountry } from '~/composables/app/country/useCountry';
import { useAuthUser } from '~/composables/auth/useAuthUser';
import { usePasswordReset } from '~/composables/auth/usePasswordReset';

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

const router = useRouter();
const { withCountry } = useCountry();
const { t } = useI18n();

const password_value = ref('');
const confirm_password = ref('');
const password_visible = ref(false);
const confirm_visible = ref(false);
const is_loading = ref(false);
const error_message = ref('');

watch(
	() => props.modelValue,
	(is_open) => {
		if (!is_open) return;
		password_value.value = '';
		confirm_password.value = '';
		password_visible.value = false;
		confirm_visible.value = false;
		error_message.value = '';
	},
	{ immediate: true }
);

function isStrongPassword(value: string): boolean {
	if (value.length < 6) return false;

	// Reject ONLY lowercase-only passwords
	if (/^[a-z]+$/.test(value)) return false;

	return true;
}

async function submitChangePassword() {
	error_message.value = '';

	const email = props.email?.trim() || '';
	const token = props.token?.trim() || '';
	const new_password = password_value.value.trim();
	const confirm_new_password = confirm_password.value.trim();

	if (!email || !token) {
		error_message.value = t('auth.reset.errors.missingLink');
		return;
	}

	if (!new_password || !confirm_new_password) {
		error_message.value = t('auth.reset.errors.fillBoth');
		return;
	}

	if (!isStrongPassword(new_password)) {
		error_message.value = t('auth.reset.errors.passwordRequirements');
		return;
	}

	if (new_password !== confirm_new_password) {
		error_message.value = t('auth.reset.errors.mismatch');
		return;
	}

	is_loading.value = true;

	try {
		const { submitResetPasswordHandler } = usePasswordReset()
		const response = await submitResetPasswordHandler({
			email,
			token,
			password: new_password,
			password_confirmation: confirm_new_password,
		})

		if (!response.success) {
			error_message.value = response?.message || t('auth.reset.errors.unable');
			return;
		}

		const { fetchAndStoreUser } = useAuthUser()
		await fetchAndStoreUser()

		emit('updated');
		router.push(withCountry('/'));
	} catch (err: unknown) {
		const error_payload = err as { data?: { message?: string }; message?: string };
		error_message.value =
			error_payload?.data?.message || error_payload?.message || t('auth.reset.errors.unable');
	} finally {
		is_loading.value = false;
	}
}
</script>

<template>
	<UiModal
		:model-value="modelValue"
		align="center"
		width="504px"
		padding="40px"
		gap="40px"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<div class="auth-reset-body">
			<button
				type="button"
				class="auth-reset-close"
				aria-label="Close reset password modal"
				data-testid="auth-reset-password-close-button"
				@click="emit('update:modelValue', false)"
			>
				<UiIcon name="regular-times" :size="24" />
			</button>
			<UiLoadingOverlay
				:visible="is_loading"
				:label="t('auth.reset.changing')"
				test-id="auth-reset-password-loading-overlay"
				position="absolute"
				background="rgba(246, 246, 248, 0.72)"
				:z-index="5"
				loader-width="74px"
				loader-height="74px"
			/>
			<div class="auth-reset-content">
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
								v-if="error_message"
								class="auth-reset-error"
								data-testid="auth-reset-error"
							>
								{{ error_message }}
							</p>
						</div>
						<UiInput
							:model-value="password_value"
							:type="password_visible ? 'text' : 'password'"
							size="md"
							:state="error_message ? 'error' : 'default'"
							:placeholder="t('auth.reset.enterNewPassword')"
							data-testid="auth-reset-password-input"
							@update:model-value="password_value = $event"
						>
							<template #icon-right>
								<UiButton
									variant="ghost"
									tone="neutral"
									size="24"
									:no-hover="true"
									class="auth-reset-toggle"
									:aria-label="t('auth.reset.togglePassword')"
									:sr-label="t('auth.reset.togglePassword')"
									icon-only
									:icon="password_visible ? 'regular-eye' : 'regular-eye-slash'"
									:icon-size="24"
									@click="password_visible = !password_visible"
								/>
							</template>
						</UiInput>
					</div>

					<div class="auth-reset-field">
						<label class="auth-reset-label">{{ t('auth.reset.confirmPassword') }}</label>
						<UiInput
							:model-value="confirm_password"
							:type="confirm_visible ? 'text' : 'password'"
							size="md"
							:state="error_message ? 'error' : 'default'"
							:placeholder="t('auth.reset.enterConfirmPassword')"
							data-testid="auth-reset-password-confirm-input"
							@update:model-value="confirm_password = $event"
						>
							<template #icon-right>
								<UiButton
									variant="ghost"
									tone="neutral"
									size="24"
									:no-hover="true"
									class="auth-reset-toggle"
									:aria-label="t('auth.reset.toggleConfirmPassword')"
									:sr-label="t('auth.reset.toggleConfirmPassword')"
									icon-only
									:icon="confirm_visible ? 'regular-eye' : 'regular-eye-slash'"
									:icon-size="24"
									@click="confirm_visible = !confirm_visible"
								/>
							</template>
						</UiInput>
					</div>
				</div>
			</div>

			<UiButton
				variant="filled"
				tone="neutral"
				size="lg"
				class="auth-reset-submit"
				:disabled="is_loading"
				data-testid="auth-reset-password-submit-button"
				@click="submitChangePassword"
			>
				{{ is_loading ? t('auth.reset.changing') : t('auth.reset.submit') }}
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
			font-weight: var(--font-weight-semibold);
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

	.auth-reset-content {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.auth-reset-close {
		position: absolute;
		top: 24px;
		right: 24px;
		display: grid;
		place-items: center;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--text-primary);
		cursor: pointer;
		z-index: 6;
	}

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
        color: var(--gray-90);
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