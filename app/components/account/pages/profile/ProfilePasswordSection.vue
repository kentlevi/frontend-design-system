<script setup lang="ts">
defineProps<{
	currentPassword: string;
	newPassword: string;
	newPasswordConfirmation: string;
	currentPasswordError: string;
	pairPasswordError: string;
	isChangePasswordEnabled: boolean;
	currentPasswordVisible: boolean;
	newPasswordVisible: boolean;
	newPasswordConfirmationVisible: boolean;
	isPasswordChangeSubmitting: boolean;
	updateCurrentPassword: (value: string) => void;
	updateNewPassword: (value: string) => void;
	updateNewPasswordConfirmation: (value: string) => void;
	clearCurrentPasswordError: () => void;
	toggleCurrentPasswordVisible: () => void;
	toggleNewPasswordVisible: () => void;
	toggleNewPasswordConfirmationVisible: () => void;
	clearNewPasswordPairErrors: () => void;
	onChangePassword: () => void;
	sendForgotPasswordEmail: () => void;
}>();

const { t } = useI18n();
</script>

<template>
	<div class="account-profile-section" data-testid="account-profile-password-section">
		<div class="account-profile-section-copy">
			<h2 class="account-profile-section-title">{{ t('account.profile.password') }}</h2>
			<p class="account-profile-section-description">{{ t('account.profile.passwordDesc') }}</p>
		</div>
		<div class="account-profile-stack" data-testid="account-profile-password-form">
			<UiFormField :label="t('account.profile.currentPassword')" :error="currentPasswordError" :required="true">
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						:model-value="currentPassword"
						:type="currentPasswordVisible ? 'text' : 'password'"
						:aria-describedby="describedBy || undefined"
						:state="currentPasswordError ? 'error' : 'default'"
						:placeholder="t('account.profile.currentPasswordPlaceholder')"
						data-testid="account-profile-current-password"
						@update:model-value="updateCurrentPassword($event); clearCurrentPasswordError()"
					>
						<template #icon-right>
							<UiButton
								variant="ghost"
								tone="neutral"
								size="24"
								:no-hover="true"
								class="account-profile-password-toggle"
								:aria-label="t('auth.reset.togglePassword')"
								:sr-label="t('auth.reset.togglePassword')"
								icon-only
								:icon="currentPasswordVisible ? 'regular-eye' : 'regular-eye-slash'"
								:icon-size="24"
								@click="toggleCurrentPasswordVisible"
							/>
						</template>
					</UiInput>
				</template>
			</UiFormField>

			<UiFormField :label="t('account.profile.newPassword')" :error="pairPasswordError" :required="true">
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						:model-value="newPassword"
						:type="newPasswordVisible ? 'text' : 'password'"
						:aria-describedby="describedBy || undefined"
						:state="pairPasswordError ? 'error' : 'default'"
						:placeholder="t('account.profile.newPasswordPlaceholder')"
						data-testid="account-profile-new-password"
						@update:model-value="updateNewPassword($event); clearNewPasswordPairErrors()"
					>
						<template #icon-right>
							<UiButton
								variant="ghost"
								tone="neutral"
								size="24"
								:no-hover="true"
								class="account-profile-password-toggle"
								:aria-label="t('auth.reset.togglePassword')"
								:sr-label="t('auth.reset.togglePassword')"
								icon-only
								:icon="newPasswordVisible ? 'regular-eye' : 'regular-eye-slash'"
								:icon-size="24"
								@click="toggleNewPasswordVisible"
							/>
						</template>
					</UiInput>
				</template>
			</UiFormField>

			<p class="account-profile-muted">{{ t('account.profile.passwordHint') }}</p>

			<UiFormField :label="t('account.profile.confirmNewPassword')" :required="true">
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						:model-value="newPasswordConfirmation"
						:type="newPasswordConfirmationVisible ? 'text' : 'password'"
						:aria-describedby="describedBy || undefined"
						:state="pairPasswordError ? 'error' : 'default'"
						:placeholder="t('account.profile.confirmNewPasswordPlaceholder')"
						data-testid="account-profile-confirm-password"
						@update:model-value="updateNewPasswordConfirmation($event); clearNewPasswordPairErrors()"
					>
						<template #icon-right>
							<UiButton
								variant="ghost"
								tone="neutral"
								size="24"
								:no-hover="true"
								class="account-profile-password-toggle"
								:aria-label="t('auth.reset.toggleConfirmPassword')"
								:sr-label="t('auth.reset.toggleConfirmPassword')"
								icon-only
								:icon="newPasswordConfirmationVisible ? 'regular-eye' : 'regular-eye-slash'"
								:icon-size="24"
								@click="toggleNewPasswordConfirmationVisible"
							/>
						</template>
					</UiInput>
				</template>
			</UiFormField>

			<div class="account-profile-inline-actions" data-testid="account-profile-password-actions">
				<UiButton
					variant="filled"
					tone="neutral"
					size="md"
					:disabled="!isChangePasswordEnabled || isPasswordChangeSubmitting"
					data-testid="account-profile-change-password-button"
					@click="onChangePassword"
				>
					{{ t('account.profile.changePassword') }}
				</UiButton>
				<UiButton
					variant="ghost"
					tone="neutral"
					size="sm"
					:no-hover="true"
					class="account-profile-forgot-password-link"
					label-class="account-profile-forgot-password-link-label"
					data-testid="account-profile-forgot-password"
					@click="sendForgotPasswordEmail"
				>
					{{ t('account.profile.forgotPassword') }}
				</UiButton>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.account-profile-section {
	display: grid;
	grid-template-columns: 300px 1fr;
	gap: 126px;

	.account-profile-section-copy {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.account-profile-section-title {
		margin: 0;
		font-size: var(--type-size-300);
		font-weight: var(--font-weight-semibold);
		line-height: var(--type-line-300);
	}

	.account-profile-section-description {
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		font-weight: var(--font-weight-regular);
		line-height: var(--type-line-100);
	}

	.account-profile-stack {
		display: flex;
		flex-direction: column;
		gap: 16px;

		.account-profile-inline-actions {
			display: flex;
			gap: 16px;
			align-items: center;
			justify-content: flex-end;

			.account-profile-forgot-password-link {
				min-height: auto;
				padding: 0;
				color: var(--text-primary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				text-decoration: underline;

				:deep(.account-profile-forgot-password-link-label) {
					color: inherit;
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					text-decoration: underline;
				}
			}
		}
	}

	.account-profile-muted {
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}
}

@media (max-width: 980px) {
	.account-profile-section {
		grid-template-columns: 1fr;
		gap: 16px;
	}
}
</style>