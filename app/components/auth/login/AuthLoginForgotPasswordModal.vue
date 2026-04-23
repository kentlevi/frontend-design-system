<script setup lang="ts">
import { ref, watch } from 'vue';
import { usePasswordReset } from '~/composables/auth/usePasswordReset';

const props = withDefaults(
	defineProps<{
		modelValue: boolean;
		email?: string;
	}>(),
	{
		email: '',
	}
);

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'returnToLogin'): void;
}>();

const { t } = useI18n();

const is_submitting = ref(false);
const reset_email = ref('');
const error_message = ref('');
const is_sent = ref(false);
// Local loading state used instead of global store

watch(
	() => props.modelValue,
	(is_open) => {
		if (!is_open) return;
		reset_email.value = props.email ?? '';
		error_message.value = '';
		is_sent.value = false;
	},
	{ immediate: true }
);

const is_valid_email = (value: string) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function closeModal() {
	emit('update:modelValue', false);
}

function returnToLogin() {
	emit('returnToLogin');
}

async function submitReset() {
	const email_value = reset_email.value.trim();
	error_message.value = '';
	is_sent.value = false;

	if (!email_value) {
		error_message.value = t('auth.login.validation.fieldBlank');
		return;
	}

	if (!is_valid_email(email_value)) {
		error_message.value = t('auth.login.validation.emailInvalid');
		return;
	}

	is_submitting.value = true;

	try {
		const { sendResetPasswordLinkHandler } = usePasswordReset();
		const response = await sendResetPasswordLinkHandler({
			email: email_value
		});

		if (!response?.success) {
			error_message.value = response?.message || t('auth.login.forgot.requestFailed');
			return;
		}

		is_sent.value = true;
	} catch (err: unknown) {
		const error_payload = err as { data?: { message?: string }; message?: string };
		error_message.value =
			error_payload?.data?.message || error_payload?.message || t('auth.login.forgot.requestFailed');
	} finally {
		is_submitting.value = false;
	}
}
</script>

<template>
	<UiModal
		:model-value="modelValue"
		align="center"
		width="504px"
		padding="40px"
		gap="8px"
		modal-class="upload-modal"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<template #overlay>
			<UiLoadingOverlay
				:visible="is_submitting"
				variant="modal"
				position="absolute"
				:label="t('auth.login.forgot.sending')"
				test-id="auth-login-forgot-password-loading-overlay"
			/>
		</template>
		<div
			class="auth-forgot-body"
			:class="is_sent ? 'auth-forgot-body-success' : 'auth-forgot-body-default'"
		>
			<button
				type="button"
				class="auth-forgot-close"
				:aria-label="t('auth.login.forgot.closeModal')"
				data-testid="auth-login-forgot-password-close-button"
				@click="closeModal"
			>
				<UiIcon name="regular-times" :size="24" />
			</button>
			<div class="auth-forgot-header">
				<UiLogo
					name="musticker"
					variant="mark"
					color="colored"
					:size="40"
					class="auth-forgot-logo"
				/>
				<h3 class="auth-forgot-title">
					{{ is_sent ? t('auth.login.forgot.checkEmailTitle') : t('auth.login.forgot.title') }}
				</h3>
			</div>
			<template v-if="!is_sent">
				<p class="auth-forgot-description">
					{{ t('auth.login.forgot.description') }}
				</p>

				<UiFormField
					class="auth-forgot-field"
					:label="t('auth.login.email')"
					:error="error_message"
					:required="true"
					head-class="auth-forgot-field-head"
					label-class="auth-forgot-field-label"
					label-text-class="auth-forgot-field-label-text"
					error-class="auth-forgot-field-error"
				>
					<template #default="{ inputId, describedBy }">
						<UiInput
							:id="inputId"
							class="auth-forgot-input"
							type="email"
							size="md"
							:model-value="reset_email"
							:state="error_message ? 'error' : 'default'"
							:aria-invalid="error_message ? 'true' : 'false'"
							:aria-describedby="describedBy || undefined"
							:placeholder="t('auth.login.enterEmail')"
							data-testid="auth-login-forgot-password-email-input"
							@update:model-value="reset_email = $event"
						/>
					</template>
				</UiFormField>

				<div class="auth-forgot-actions">
					<UiButton
						variant="filled"
						tone="neutral"
						size="lg"
						class="auth-forgot-submit"
						data-testid="auth-login-forgot-password-submit-button"
						:disabled="is_submitting"
						@click="submitReset"
					>
						{{ is_submitting ? t('auth.login.forgot.sending') : t('auth.login.forgot.sendResetEmail') }}
					</UiButton>

					<UiButton
						variant="ghost"
						tone="neutral"
						size="sm"
						:no-hover="true"
						class="auth-forgot-return"
						label-class="auth-forgot-return-label"
						data-testid="auth-login-forgot-password-return-button"
						@click="returnToLogin"
					>
						{{ t('auth.login.forgot.returnToLogin') }}
					</UiButton>
				</div>
			</template>

			<template v-else>
				<p class="auth-forgot-description">
					{{ t('auth.login.forgot.checkEmailDescription') }}
				</p>

				<div class="auth-forgot-actions auth-forgot-actions-success">
					<UiButton
						variant="filled"
						tone="neutral"
						size="lg"
						class="auth-forgot-submit"
						data-testid="auth-login-forgot-password-return-button"
						@click="returnToLogin"
					>
						{{ t('auth.login.forgot.returnToLogin') }}
					</UiButton>
				</div>
			</template>
		</div>
	</UiModal>
</template>

<style scoped lang="scss">
.auth-forgot-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;

    .auth-forgot-logo {
        flex: 0 0 auto;
    }

    .auth-forgot-title {
		font-weight: var(--font-weight-semibold);
        font-size: var(--type-size-500);
        line-height: var(--type-line-500);
        color: var(--text-primary);
    }
}

.auth-forgot-body {
    position: relative;
    margin: calc(var(--ui-modal-padding, 40px) * -1);
    padding: var(--ui-modal-padding, 40px);
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .auth-forgot-close {
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
        z-index: 1;
    }

    .auth-forgot-description {

        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        color: var(--text-secondary);
    }

    .auth-forgot-field {
        .auth-forgot-field-label {
            font-size: var(--type-size-100);
            font-weight: var(--font-weight-semibold);
            line-height: var(--type-line-100);
            color: var(--text-primary);
        }

        .auth-forgot-field-error {

            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            font-weight: var(--font-weight-semibold);
            color: var(--error);
        }
    }

    .auth-forgot-input {
        width: 100%;
    }

    .auth-forgot-success {

        font-size: var(--type-size-100);
        line-height: var(--type-line-100);
        color: var(--success);
    }

    .auth-forgot-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .auth-forgot-submit {
            width: 100%;
            border-radius: 16px;
            box-shadow: none;
            font-size: var(--type-size-200);
            line-height: var(--type-line-200);
        }

        .auth-forgot-return {
            --btn-border: transparent;
            --btn-bg: var(--text-secondary);

            width: fit-content;
            align-self: center;
            color: var(--text-secondary);
            font-size: var(--type-size-100);
            line-height: var(--type-line-100);
            background: transparent;
            border-color: transparent;
            border-radius: 0;
            padding: 0;
            min-height: auto;
            height: auto;
            box-shadow: none;

            &:hover {
                background: transparent;
                filter: none;
                color: var(--text-primary);
            }

            .auth-forgot-return-label {
                padding: 0;
            }
        }
    }
}

:deep(.auth-forgot-body .ui-loading-overlay) {
    border-radius: 14px;
}

.auth-forgot-body-default {
    gap: 24px;
}

.auth-forgot-body-success {
    gap: 40px;
}

@media (max-width: 768px) {
    .auth-forgot-header {
        .auth-forgot-title {
            font-size: var(--type-size-500);
            line-height: var(--type-line-500);
        }
    }
}
</style>