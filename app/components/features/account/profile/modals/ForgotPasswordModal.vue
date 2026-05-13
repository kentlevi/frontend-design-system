<script setup lang="ts">
defineProps<{
	modelValue: boolean
	requestSent: boolean
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
	(e: 'close'): void
}>()

const { t } = useI18n();

function handleUpdate(value: boolean) {
	if (value) {
		emit('update:modelValue', true)
	} else {
		emit('close')
	}
}
</script>

<template>
	<UiModal
		:model-value="modelValue"
		align="center"
		padding="40px"
		gap="8px"
		modal-class="account-profile-forgot-password-modal-shell"
		@update:model-value="handleUpdate"
	>
		<section class="account-profile-forgot-password-modal" data-testid="account-profile-forgot-password-modal">
			<button
				type="button"
				class="account-profile-forgot-password-modal-close"
				:aria-label="t('account.profile.forgotPasswordModalClose')"
				data-testid="account-profile-forgot-password-modal-close"
				@click="emit('close')"
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
						{{ requestSent ? t('account.profile.forgotPasswordCheckEmailTitle') : t('account.profile.forgotPasswordRequestFailedTitle') }}
					</h3>

					<p class="account-profile-forgot-password-modal-description">
						{{ requestSent ? t('account.profile.forgotPasswordCheckEmailDescription') : t('account.profile.forgotPasswordRequestFailed') }}
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
					@click="emit('close')"
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
