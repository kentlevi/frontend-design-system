<script setup lang="ts">
import { useAuthLoginMemberForm } from '@/composables/auth/login/useAuthLoginMemberForm'

const {
	translate,
	show_password,
	keep_signed_in,
	member_email,
	member_password,
	member_email_error,
	member_password_error,
	member_invalid_credentials,
	togglePassword,
	setKeepSignedIn,
	setMemberEmail,
	setMemberPassword,
	openForgotPassword,
} = useAuthLoginMemberForm()
</script>

<template>
	<div class="auth-login-form" data-testid="auth-login-member-form">
		<div class="auth-login-inputs">
			<UiFormField
				class="auth-login-field"
				:label="translate('auth.login.email')"
				:error="member_email_error"
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
						:state="member_email_error ? 'error' : 'default'"
						:aria-invalid="member_email_error ? 'true' : 'false'"
						:aria-describedby="describedBy || undefined"
						:placeholder="translate('auth.login.enterEmail')"
						:model-value="member_email"
						data-testid="auth-login-member-email-input"
						@update:model-value="setMemberEmail"
					/>
				</template>
			</UiFormField>

			<UiFormField
				class="auth-login-field"
				:label="translate('auth.login.password')"
				:error="member_password_error"
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
							:state="
								member_password_error || member_invalid_credentials
									? 'error'
									: 'default'
							"
							:aria-invalid="
								member_password_error || member_invalid_credentials
									? 'true'
									: 'false'
							"
							:aria-describedby="describedBy || undefined"
							:placeholder="translate('auth.login.enterPassword')"
							:type="show_password ? 'text' : 'password'"
							:model-value="member_password"
							data-testid="auth-login-member-password-input"
							@update:model-value="setMemberPassword"
						>
							<template #icon-right>
								<UiButton
									variant="ghost"
									tone="neutral"
									size="sm"
									class="auth-login-password-toggle"
									:aria-label="translate('auth.login.togglePassword')"
									data-testid="auth-login-member-password-toggle-button"
									:sr-label="translate('auth.login.togglePassword')"
									icon-only
									:icon="
										show_password
											? 'regular-eye'
											: 'regular-eye-slash'
									"
									:icon-size="24"
									@click="togglePassword"
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
				:model-value="keep_signed_in"
				data-testid="auth-login-member-keep-signed-in"
				@update:model-value="setKeepSignedIn"
			>
				<span class="auth-login-checkbox-text">{{
					translate('auth.login.keepSignedIn')
				}}</span>
			</UiCheckbox>

			<UiButton
				variant="ghost"
				tone="neutral"
				size="sm"
				class="auth-login-link-button"
				label-class="auth-login-link-button-label"
				data-testid="auth-login-member-forgot-password-button"
				@click="openForgotPassword"
			>
				{{ translate('auth.login.forgotPassword') }}
			</UiButton>
		</div>
	</div>
</template>

<style lang="scss">
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
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
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
</style>