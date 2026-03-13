<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCountry } from '~/composables/app/country/useCountry';

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
const api = useApi();
const { apiCountry } = useCountry();

const resetEmail = ref('');
const error = ref('');
const sent = ref(false);
const loading = ref(false);

watch(
	() => props.modelValue,
	(open) => {
		if (!open) return;
		resetEmail.value = props.email ?? '';
		error.value = '';
		sent.value = false;
	},
	{ immediate: true }
);

const isValidEmail = (value: string) =>
	/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

function closeModal() {
	emit('update:modelValue', false);
}

function returnToLogin() {
	emit('returnToLogin');
}

async function submitReset() {
	const value = resetEmail.value.trim();
	error.value = '';
	sent.value = false;

	if (!value) {
		error.value = t('auth.login.validation.fieldBlank');
		return;
	}

	if (!isValidEmail(value)) {
		error.value = t('auth.login.validation.emailInvalid');
		return;
	}

	loading.value = true;

	try {
		const response = await api<{ success: boolean; message: string }>(
			`/${apiCountry.value}/auth/password/reset-link`,
			{
				method: 'POST',
				body: {
					email: value,
				},
			}
		);

		if (!response?.success) {
			error.value = response?.message || t('auth.login.forgot.requestFailed');
			return;
		}

		sent.value = true;
	} catch (err: unknown) {
		const errorPayload = err as { data?: { message?: string }; message?: string };
		error.value =
			errorPayload?.data?.message || errorPayload?.message || t('auth.login.forgot.requestFailed');
	} finally {
		loading.value = false;
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
		@update:model-value="emit('update:modelValue', $event)"
	>
		<div
			class="auth-forgot-body"
			:class="sent ? 'auth-forgot-body-success' : 'auth-forgot-body-default'"
		>
			<button
				type="button"
				class="auth-forgot-close"
				aria-label="Close forgot password modal"
				data-testid="auth-login-forgot-password-close-button"
				@click="closeModal"
			>
				<UiIcon name="regular-times" :size="24" />
			</button>
			<UiLoadingOverlay
				:visible="loading"
				:label="t('auth.login.forgot.sending')"
				test-id="auth-login-forgot-password-loading-overlay"
				position="absolute"
				background="rgba(246, 246, 248, 0.72)"
				:z-index="5"
				loader-width="74px"
				loader-height="74px"
			/>
			<div class="auth-forgot-header">
				<UiLogo
					name="musticker"
					variant="mark"
					color="colored"
					:size="40"
					class="auth-forgot-logo"
				/>
				<h3 class="auth-forgot-title">
					{{ sent ? t('auth.login.forgot.checkEmailTitle') : t('auth.login.forgot.title') }}
				</h3>
			</div>
			<template v-if="!sent">
				<p class="auth-forgot-description">
					{{ t('auth.login.forgot.description') }}
				</p>

				<UiFormField
					class="auth-forgot-field"
					:label="t('auth.login.email')"
					:error="error"
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
							:model-value="resetEmail"
							:state="error ? 'error' : 'default'"
							:aria-invalid="error ? 'true' : 'false'"
							:aria-describedby="describedBy || undefined"
							:placeholder="t('auth.login.enterEmail')"
							data-testid="auth-login-forgot-password-email-input"
							@update:model-value="resetEmail = $event"
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
						:disabled="loading"
						@click="submitReset"
					>
						{{ loading ? t('auth.login.forgot.sending') : t('auth.login.forgot.sendResetEmail') }}
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

        font-size: var(--type-size-500);
        line-height: var(--type-line-500);
        color: var(--text-primary);
    }
}

.auth-forgot-body {
    position: relative;
    margin: calc(var(--ui-modal-padding, 40px) * -1);
    padding: var(--ui-modal-padding, 40px);
    background: var(--contrast-light);
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