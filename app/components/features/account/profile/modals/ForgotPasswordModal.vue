<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

defineProps<{
	modelValue: boolean
	requestSent: boolean
}>()

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void
	(e: 'close'): void
}>()

const { t: translate } = useI18n();

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
				:aria-label="translate('account.profile.forgotPasswordModalClose')"
				data-testid="account-profile-forgot-password-modal-close"
				@click="emit('close')"
			>
				<UiIcon name="regular-times" :size="24" />
			</button>

			<MuLinearWrapper
				class="account-profile-forgot-password-modal-header"
				direction="column"
				align="flex-start"
				:gap="24"
			>
				<UiLogo
					name="musticker"
					variant="mark"
					color="colored"
					:size="40"
					class="account-profile-forgot-password-modal-logo"
				/>
				<MuLinearWrapper class="account-profile-forgot-password-modal-copy" direction="column" :gap="8">
					<MuHeading variant="3" weight="semi-bold" color="text-primary" class="account-profile-forgot-password-modal-title">
						{{ requestSent ? translate('account.profile.forgotPasswordCheckEmailTitle') : translate('account.profile.forgotPasswordRequestFailedTitle') }}
					</MuHeading>

					<MuText color="text-secondary" class="account-profile-forgot-password-modal-description">
						{{ requestSent ? translate('account.profile.forgotPasswordCheckEmailDescription') : translate('account.profile.forgotPasswordRequestFailed') }}
					</MuText>
				</MuLinearWrapper>
			</MuLinearWrapper>

			<div class="account-profile-forgot-password-modal-actions">
				<UiButton
					variant="filled"
					tone="neutral"
					size="lg"
					class="account-profile-forgot-password-modal-confirm"
					data-testid="account-profile-forgot-password-modal-confirm"
					@click="emit('close')"
				>
					{{ translate('account.profile.forgotPasswordReturnToDashboard') }}
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

	.account-profile-forgot-password-modal-actions {
		display: flex;
	}

	.account-profile-forgot-password-modal-confirm {
		width: 100%;
	}
}
</style>