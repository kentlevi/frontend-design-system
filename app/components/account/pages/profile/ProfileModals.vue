<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';

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