<script setup lang="ts">
import { useResetPassword } from '~/composables/auth/useResetPassword';

const {
	translate,
	is_reset_password_modal_open,
	password_value,
	confirm_password,
	password_visible,
	confirm_visible,
	is_loading,
	error_message,
	setPasswordValue,
	setConfirmPasswordValue,
	togglePasswordVisible,
	toggleConfirmVisible,
	handleModalValueChange,
	closeResetPasswordModal,
	submitChangePassword,
} = useResetPassword();
</script>

<template>
	<UiModal
		:model-value="is_reset_password_modal_open"
		align="center"
		width="504px"
		padding="40px"
		gap="40px"
		@update:model-value="handleModalValueChange"
	>
		<div class="auth-reset-body">
			<button
				type="button"
				class="auth-reset-close"
				:aria-label="translate('auth.reset.closeModal')"
				data-testid="auth-reset-password-close-button"
				@click="closeResetPasswordModal"
			>
				<UiIcon name="regular-times" :size="24" />
			</button>
			<UiLoadingOverlay
				:visible="is_loading"
				:label="translate('auth.reset.changing')"
				test-id="auth-reset-password-loading-overlay"
				variant="modal"
				position="absolute"
			/>
			<div class="auth-reset-content">
				<div class="auth-reset-header">
					<UiLogo
						name="musticker"
						variant="mark"
						color="colored"
						:size="34"
						class="auth-reset-logo"
					/>
					<div class="auth-reset-copy">
						<h3 class="auth-reset-title">
							{{ translate('auth.reset.title') }}
						</h3>
						<p class="auth-reset-description">
							{{ translate('auth.reset.description') }}
						</p>
					</div>
				</div>

				<div class="auth-reset-fields">
					<div class="auth-reset-field">
						<div class="auth-reset-field-head">
							<label class="auth-reset-label">{{
								translate('auth.reset.newPassword')
							}}</label>
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
							:placeholder="
								translate('auth.reset.enterNewPassword')
							"
							data-testid="auth-reset-password-input"
							@update:model-value="setPasswordValue"
						>
							<template #icon-right>
								<UiButton
									variant="ghost"
									tone="neutral"
									size="24"
									:no-hover="true"
									class="auth-reset-toggle"
									:aria-label="
										translate('auth.reset.togglePassword')
									"
									:sr-label="
										translate('auth.reset.togglePassword')
									"
									icon-only
									:icon="
										password_visible
											? 'regular-eye'
											: 'regular-eye-slash'
									"
									:icon-size="24"
									@click="togglePasswordVisible"
								/>
							</template>
						</UiInput>
					</div>

					<div class="auth-reset-field">
						<label class="auth-reset-label">{{
							translate('auth.reset.confirmPassword')
						}}</label>
						<UiInput
							:model-value="confirm_password"
							:type="confirm_visible ? 'text' : 'password'"
							size="md"
							:state="error_message ? 'error' : 'default'"
							:placeholder="
								translate('auth.reset.enterConfirmPassword')
							"
							data-testid="auth-reset-password-confirm-input"
							@update:model-value="setConfirmPasswordValue"
						>
							<template #icon-right>
								<UiButton
									variant="ghost"
									tone="neutral"
									size="24"
									:no-hover="true"
									class="auth-reset-toggle"
									:aria-label="
										translate(
											'auth.reset.toggleConfirmPassword'
										)
									"
									:sr-label="
										translate(
											'auth.reset.toggleConfirmPassword'
										)
									"
									icon-only
									:icon="
										confirm_visible
											? 'regular-eye'
											: 'regular-eye-slash'
									"
									:icon-size="24"
									@click="toggleConfirmVisible"
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
				{{
					is_loading
						? translate('auth.reset.changing')
						: translate('auth.reset.submit')
				}}
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