<script setup lang="ts">
const { t } = useI18n();

defineProps<{
	showPassword: boolean;
	keepSignedIn: boolean;
	email: string;
	password: string;
	emailError?: string;
	passwordError?: string;
	passwordInvalid?: boolean;
}>();

const emit = defineEmits<{
	(e: 'togglePassword'): void;
	(e: 'update:keepSignedIn', value: boolean): void;
	(e: 'update:email', value: string): void;
	(e: 'update:password', value: string): void;
	(e: 'openForgotPassword'): void;
}>();
</script>

<template>
	<div class="auth-login-form" data-testid="auth-login-member-form">
		<div class="auth-login-inputs">
			<UiFormField
				class="auth-login-field"
				:label="t('auth.login.email')"
				:error="emailError"
				error-test-id="auth-login-member-email-error"
				:required="true"
				head-class="auth-login-field-head"
				label-class="auth-login-field-label"
				label-text-class="auth-login-field-label-text"
				error-class="auth-login-field-error"
			>
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						class="auth-login-input"
						size="md"
						:state="emailError ? 'error' : 'default'"
						:aria-invalid="emailError ? 'true' : 'false'"
						:aria-describedby="describedBy || undefined"
						:placeholder="t('auth.login.enterEmail')"
						:model-value="email"
						data-testid="auth-login-member-email-input"
						@update:model-value="emit('update:email', $event)"
					/>
				</template>
			</UiFormField>

			<UiFormField
				class="auth-login-field"
				:label="t('auth.login.password')"
				:error="passwordError"
				error-test-id="auth-login-member-password-error"
				:required="true"
				head-class="auth-login-field-head"
				label-class="auth-login-field-label"
				label-text-class="auth-login-field-label-text"
				error-class="auth-login-field-error"
			>
				<template #default="{ inputId, describedBy }">
					<div class="auth-login-password-wrap">
						<UiInput
							:id="inputId"
							class="auth-login-input"
							size="md"
							:state="passwordError || passwordInvalid ? 'error' : 'default'"
							:aria-invalid="passwordError || passwordInvalid ? 'true' : 'false'"
							:aria-describedby="describedBy || undefined"
							:placeholder="t('auth.login.enterPassword')"
							:type="showPassword ? 'text' : 'password'"
							:model-value="password"
							data-testid="auth-login-member-password-input"
							@update:model-value="emit('update:password', $event)"
						>
							<template #icon-right>
								<UiButton
									variant="ghost"
									tone="neutral"
									size="sm"
									class="auth-login-password-toggle"
									:aria-label="t('auth.login.togglePassword')"
									data-testid="auth-login-member-password-toggle-button"
									:sr-label="t('auth.login.togglePassword')"
									icon-only
									:icon="showPassword ? 'regular-eye' : 'regular-eye-slash'"
									:icon-size="24"
									@click="emit('togglePassword')"
								/>
							</template>
						</UiInput>
					</div>
				</template>
			</UiFormField>
		</div>

		<div class="auth-login-inline">
			<UiCheckbox
				class="auth-login-checkbox-control"
				:model-value="keepSignedIn"
				data-testid="auth-login-member-keep-signed-in"
				@update:model-value="emit('update:keepSignedIn', $event)"
			>
				<span class="auth-login-checkbox-text">{{ t('auth.login.keepSignedIn') }}</span>
			</UiCheckbox>

			<UiButton
				variant="ghost"
				tone="neutral"
				size="sm"
				class="auth-login-link-button"
				label-class="auth-login-link-button-label"
				data-testid="auth-login-member-forgot-password-button"
				@click="emit('openForgotPassword')"
			>
				{{ t('auth.login.forgotPassword') }}
			</UiButton>
		</div>
	</div>
</template>

<style lang="scss">
.auth-login-form {
    display: flex;
    flex-direction: column;
    gap: 8px;

        .auth-login-inputs {
            display: flex;
            flex-direction: column;
            gap: 16px;

            .auth-login-field {
                display: flex;
                flex-direction: column;
                gap: 8px;

                .auth-login-field-head {
                    min-height: 24px;
                    align-items: center;
                }

                .auth-login-field-label {
                    display: block;

                    font-size: var(--type-size-100);
                    font-weight: var(--font-weight-semibold);
                    line-height: var(--type-line-100);
                    color: var(--text-primary);
                }

                .auth-login-field-error {

                    font-size: var(--type-size-100);
                    line-height: var(--type-line-100);
                    color: var(--error);
                }

            .auth-login-input {
                width: 100%;
            }

            .auth-login-password-wrap {
                position: relative;

                .auth-login-password-toggle {
                    --btn-soft: transparent;
                    --btn-border: transparent;
                    padding: 0;
                    min-height: auto;
                    width: 24px;
                    height: 24px;
                    border-radius: 0;
                    box-shadow: none;
                }
            }
        }
    }

    .auth-login-inline {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: var(--type-size-100);
        line-height: var(--type-line-100);

        .auth-login-checkbox-control {
            color: var(--text-secondary);
        }

        .auth-login-checkbox-text {
            line-height: 1.2;
        }

        .auth-login-link-button {
            --btn-soft: transparent;
            --btn-border: transparent;
            --btn-bg: var(--text-primary);

            color: var(--text-primary);
            font-weight: var(--font-weight-semibold);
            background: transparent;
            border-color: transparent;
            border-radius: 0;
            padding: 0;
            min-height: auto;
            height: auto;
            box-shadow: none;

            &:hover,
            &:active {
                background: transparent;
                filter: none;
            }

            .auth-login-link-button-label {
                padding: 0;
            }
        }
    }

    @media (max-width: 1100px) {
        .auth-login-inputs {
            .auth-login-field {
                .auth-login-label-row {
                    .auth-login-error {
                        font-size: var(--type-size-100);
                        line-height: var(--type-line-100);
                    }
                }
            }
        }
    }
}
</style>