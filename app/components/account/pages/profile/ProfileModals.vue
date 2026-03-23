<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import AuthVerificationModal from '~/components/auth/shared/AuthVerificationModal.vue';
import DeleteConfirmModal from '~/components/ui/DeleteConfirmModal.vue';

defineProps<{
	pendingEmail: string;
	isEmailChangeModal: boolean;
	emailChangeError: string;
	isOtpOpen: boolean;
	emailChangeOtpCode: string;
	emailChangeOtpError: string;
	limitReachedError: string;
	remaining: number;
	isDeletePhotoModalOpen: boolean;
	isForgotPasswordModalOpen: boolean;
	forgotPasswordRequestSend: boolean;
	bindEmailChangeFieldRef: (element: Element | ComponentPublicInstance | null) => void;
	setIsEmailChangeModal: (value: boolean) => void;
	setPendingEmail: (value: string) => void;
	clearEmailChangeError: () => void;
	setIsOtpOpen: (value: boolean) => void;
	setEmailChangeOtpCode: (value: string) => void;
	setIsDeletePhotoModalOpen: (value: boolean) => void;
	setIsForgotPasswordModalOpen: (value: boolean) => void;
	closeEmailChangeModal: () => void;
	confirmEmailChange: () => void;
	verifyOtp: () => void;
	resendOtp: () => void;
	closeOtpModal: () => void;
	closeDeletePhotoModal: () => void;
	confirmDeletePhoto: () => void;
	closeForgotPasswordModal: () => void;
}>();

const { t } = useI18n();
</script>

<template>
	<UiModal
		:model-value="isEmailChangeModal"
		align="center"
		width="520px"
		padding="0"
		gap="0"
		modal-class="account-profile-email-change-modal-shell"
		@update:model-value="setIsEmailChangeModal($event)"
	>
		<section class="account-profile-email-change-modal" data-testid="account-profile-email-change-modal">
			<button
				type="button"
				class="account-profile-email-change-modal-close"
				aria-label="Close email change modal"
				data-testid="account-profile-email-change-modal-close"
				@click="closeEmailChangeModal"
			>
				<UiIcon name="regular-times" :size="24" />
			</button>

			<div class="account-profile-email-change-modal-copy">
				<div class="account-profile-email-change-modal-icon-wrap">
					<img
						src="/icons/custom/account/email-change.svg"
						alt=""
						class="account-profile-email-change-modal-icon"
					>
				</div>
				<div class="account-profile-email-change-modal-text-wrap">
					<h3 class="account-profile-email-change-modal-title">Email Change</h3>
					<p class="account-profile-email-change-modal-text">
						Enter your new email address and click the <strong class="change-strong">"Confirm"</strong> button to proceed.
					</p>
				</div>
			</div>

			<div class="account-profile-email-change-modal-body">
				<UiFormField
					class="account-profile-email-change-field"
					head-class="account-profile-email-change-field-head"
					label-text-class="account-profile-email-change-field-label-text"
					:label="t('account.profile.emailAddress')"
					:error="emailChangeError"
					:required="true"
				>
					<template #default="{ inputId, describedBy }">
						<div :ref="bindEmailChangeFieldRef" class="account-profile-email-change-input-wrap">
							<UiInput
								:id="inputId"
								:model-value="pendingEmail"
								type="email"
								:aria-describedby="describedBy || undefined"
								:state="emailChangeError ? 'error' : 'default'"
								placeholder="Please enter your new email address."
								input-class="account-profile-email-change-input"
								data-testid="account-profile-email-change-input"
								@update:model-value="setPendingEmail($event); clearEmailChangeError()"
							/>
						</div>
					</template>
				</UiFormField>
			</div>

			<div class="account-profile-email-change-modal-actions">
				<UiButton
					type="button"
					variant="filled"
					tone="neutral"
					size="md"
					class="account-profile-email-change-modal-confirm"
					data-testid="account-profile-email-change-modal-confirm"
					@click="confirmEmailChange"
				>
					Confirm
				</UiButton>
			</div>
		</section>
	</UiModal>

	<AuthVerificationModal
		:model-value="isOtpOpen"
		:code="emailChangeOtpCode"
		:error="emailChangeOtpError"
		:resend-limit-reached="limitReachedError"
		:resend-cooldown-remaining="remaining"
		submit-label="Verify"
		busy-label="Verifying..."
		width="504px"
		align="center"
		:show-close-button="true"
		test-id-prefix="account-profile-email-change-verification"
		@update:model-value="setIsOtpOpen($event)"
		@update:code="setEmailChangeOtpCode($event)"
		@verify="verifyOtp"
		@resend="resendOtp"
		@close="closeOtpModal"
	>
		<template #icon>
			<img
				src="/illustrations/icon-verification.svg"
				:alt="t('auth.verification.iconAlt')"
				class="account-profile-email-change-verification-icon"
			>
		</template>
	</AuthVerificationModal>

	<DeleteConfirmModal
		:model-value="isDeletePhotoModalOpen"
		title="Are you sure you want to delete this photo?"
		description="This action cannot be undone. Please confirm to proceed."
		modal-class="account-profile-delete-photo-modal-shell"
		test-id="account-profile-delete-photo-modal"
		@update:model-value="setIsDeletePhotoModalOpen($event)"
		@cancel="closeDeletePhotoModal"
		@confirm="confirmDeletePhoto"
	/>

	<UiModal
		:model-value="isForgotPasswordModalOpen"
		align="center"
		width="504px"
		padding="40px"
		gap="8px"
		modal-class="account-profile-forgot-password-modal-shell"
		@update:model-value="$event ? setIsForgotPasswordModalOpen(true) : closeForgotPasswordModal()"
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
				<h3 class="account-profile-forgot-password-modal-title">
					{{ forgotPasswordRequestSend ? t('account.profile.forgotPasswordCheckEmailTitle') : t('account.profile.forgotPasswordRequestFailedTitle') }}
				</h3>
			</div>

			<p class="account-profile-forgot-password-modal-description">
				{{ forgotPasswordRequestSend ? t('account.profile.forgotPasswordCheckEmailDescription') : t('account.profile.forgotPasswordRequestFailed') }}
			</p>

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
.account-profile-forgot-password-modal {
	position: relative;
	margin: calc(var(--ui-modal-padding, 40px) * -1);
	padding: var(--ui-modal-padding, 40px);
	background: var(--contrast-light);
	border-radius: 14px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	gap: 24px;

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

	.account-profile-forgot-password-modal-title {
		font-size: var(--type-size-500);
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

.account-profile-email-change-modal {
	position: relative;
	background: var(--contrast-light);
	border-radius: 16px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	gap: 32px;
	width: 100%;
	padding: 40px;

	.account-profile-email-change-modal-close {
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
	}

	.account-profile-email-change-modal-copy {
		display: grid;
		grid-template-columns: 48px minmax(0, 1fr);
		align-items: start;
		column-gap: 16px;

		.account-profile-email-change-modal-icon-wrap {
			display: grid;
			place-items: center;
			width: 48px;
			height: 48px;

			.account-profile-email-change-modal-icon {
				display: block;
				width: 48px;
				height: 48px;
			}
		}

		.account-profile-email-change-modal-text-wrap {
			display: flex;
			flex-direction: column;
			gap: 8px;

			.account-profile-email-change-modal-title {
				color: var(--text-primary);
				font-size: var(--type-size-400);
				line-height: var(--type-line-400);
				font-weight: var(--font-weight-bold);
			}

			.account-profile-email-change-modal-text {
				color: var(--text-secondary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);

				.change-strong {
					color: var(--text-primary);
					font-weight: var(--font-weight-bold);
				}
			}
		}
	}

	.account-profile-email-change-modal-confirm {
		width: 100%;
		min-height: 46px;
		border-radius: 18px;
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
	}
}

.account-profile-email-change-verification-icon {
	width: 52px;
	height: 52px;
	object-fit: contain;
	display: block;
}

:global(.account-profile-email-change-modal-shell) {
	border-radius: 16px;
	overflow: hidden;
	max-width: 520px;
}

:global(.account-profile-email-change-field-label-text) {
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);
}

@media (max-width: 980px) {
	.account-profile-email-change-verification-icon {
		width: 46px;
		height: 46px;
	}
}
</style>