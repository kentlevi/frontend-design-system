<script setup lang="ts">
import { useForgotPasswordForm } from '~/composables/account/profile/useForgotPasswordForm';
import { usePasswordForm } from '~/composables/account/profile/usePasswordForm';

const { t } = useI18n();

const {
	current_password,
	new_password,
	new_password_confirmation,
	current_password_error,
	pair_password_error,

	is_change_password_enabled,

	current_password_visible,
	new_password_visible,
	new_password_confirmation_visible,

	clearNewPasswordPairErrors,
	onChangePassword,
} = usePasswordForm()

const {
	is_forgot_password_modal_open,
	forgot_password_request_send,

	sendForgotPasswordEmail,
	closeForgotPasswordModal
} = useForgotPasswordForm()

</script>

<template>
	<div class="account-profile-section" data-testid="account-profile-password-section">
		<div class="account-profile-section-copy">
			<h2 class="account-profile-section-title">{{ t('account.profile.password') }}</h2>
			<p class="account-profile-section-description">{{ t('account.profile.passwordDesc') }}</p>
		</div>
		<div class="account-profile-stack" data-testid="account-profile-password-form">
			<UiFormField :label="t('account.profile.currentPassword')" :error="current_password_error" :required="true">
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						v-model="current_password"
						:type="current_password_visible ? 'text' : 'password'"
						:aria-describedby="describedBy || undefined"
						:state="current_password_error ? 'error' : 'default'"
						:placeholder="t('account.profile.currentPasswordPlaceholder')"
						data-testid="account-profile-current-password"
						@update:model-value="current_password_error = ''"
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
								:icon="current_password_visible ? 'regular-eye' : 'regular-eye-slash'"
								:icon-size="24"
								@click="current_password_visible = !current_password_visible"
							/>
						</template>
					</UiInput>
				</template>
			</UiFormField>

			<UiFormField
				:label="t('account.profile.newPassword')"
				:error="pair_password_error"
				:required="true"
				:hint="t('account.profile.passwordHint')"
			>
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						v-model="new_password"
						:type="new_password_visible ? 'text' : 'password'"
						:aria-describedby="describedBy || undefined"
						:state="pair_password_error ? 'error' : 'default'"
						:placeholder="t('account.profile.newPasswordPlaceholder')"
						data-testid="account-profile-new-password"
						@update:model-value="clearNewPasswordPairErrors()"
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
								:icon="new_password_visible ? 'regular-eye' : 'regular-eye-slash'"
								:icon-size="24"
								@click="new_password_visible = !new_password_visible"
							/>
						</template>
					</UiInput>
				</template>
			</UiFormField>


			<UiFormField :label="t('account.profile.confirmNewPassword')" :required="true">
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						v-model="new_password_confirmation"
						:type="new_password_confirmation_visible ? 'text' : 'password'"
						:aria-describedby="describedBy || undefined"
						:state="pair_password_error ? 'error' : 'default'"
						:placeholder="t('account.profile.confirmNewPasswordPlaceholder')"
						data-testid="account-profile-confirm-password"
						@update:model-value="clearNewPasswordPairErrors()"
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
								:icon="new_password_confirmation_visible ? 'regular-eye' : 'regular-eye-slash'"
								:icon-size="24"
								@click="new_password_confirmation_visible = !new_password_confirmation_visible"
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
					:disabled="!is_change_password_enabled"
					data-testid="account-profile-change-password-button"
					@click="onChangePassword"
				>
					{{ t('account.profile.changePassword') }}
				</UiButton>
				<UiButton
					variant="ghost"
					tone="neutral"
					size="md"
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


	<UiModal
		:model-value="is_forgot_password_modal_open"
		align="center"
		width="504px"
		padding="40px"
		gap="8px"
		modal-class="account-profile-forgot-password-modal-shell"
		@update:model-value="$event ? (is_forgot_password_modal_open = true) : closeForgotPasswordModal()"
	>
		<section class="account-profile-forgot-password-modal" data-testid="account-profile-forgot-password-modal">
			<button
				type="button"
				class="account-profile-forgot-password-modal-close"
				:aria-label="t('account.profile.forgotPasswordModalClose')"
				data-testid="account-profile-forgot-password-modal-close"
				@click="closeForgotPasswordModal"
			>
				<UiIcon name="regular-times" :size="24" />
			</button>

			<div class="account-profile-forgot-password-modal-header">
				<UiLogo
					name="musticker"
					variant="mark"
					color="colored"
					:size="40"
					class="account-profile-forgot-password-modal-logo"
				/>
				<div class="account-profile-forgot-password-modal-copy">
					<h3 class="account-profile-forgot-password-modal-title">
						{{ forgot_password_request_send ? t('account.profile.forgotPasswordCheckEmailTitle') : t('account.profile.forgotPasswordRequestFailedTitle') }}
					</h3>

					<p class="account-profile-forgot-password-modal-description">
						{{ forgot_password_request_send ? t('account.profile.forgotPasswordCheckEmailDescription') : t('account.profile.forgotPasswordRequestFailed') }}
					</p>
				</div>
			</div>

			<div class="account-profile-forgot-password-modal-actions">
				<UiButton
					variant="filled"
					tone="neutral"
					size="lg"
					class="account-profile-forgot-password-modal-confirm"
					data-testid="account-profile-forgot-password-modal-confirm"
					@click="closeForgotPasswordModal"
				>
					{{ t('account.profile.forgotPasswordReturnToDashboard') }}
				</UiButton>
			</div>
		</section>
	</UiModal>
</template>

<style scoped lang="scss">
.account-profile-section {
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
				color: var(--text-primary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				text-decoration: none;
					&:hover {
						--btn-soft: var(--gray-20);
					}
				:deep(.account-profile-forgot-password-link-label) {
					color: inherit;
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);

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


.account-profile-forgot-password-modal {
	position: relative;
	margin: calc(var(--ui-modal-padding, 40px) * -1);
	padding: var(--ui-modal-padding, 40px);
	background: var(--contrast-light);
	border-radius: 14px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	gap: 40px;

	.account-profile-forgot-password-modal-close {
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

	.account-profile-forgot-password-modal-header {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 24px;
	}

	.account-profile-forgot-password-modal-copy {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.account-profile-forgot-password-modal-title {
		font-size: var(--type-size-500);
		font-weight: var(--font-weight-semibold);
		line-height: var(--type-line-500);
		color: var(--text-primary);
	}

	.account-profile-forgot-password-modal-description {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-secondary);
	}

	.account-profile-forgot-password-modal-actions {
		display: flex;
	}

	.account-profile-forgot-password-modal-confirm {
		width: 100%;
	}
}
</style>