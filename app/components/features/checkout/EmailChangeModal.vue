<script lang="ts" setup>
import MuInput from '~/components/base/MuInput.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useEmailChangeModal } from '~/composables/features/checkout/useEmailChangeModal';

const {
	translate,

	is_open,
	email_change_form,
	email_error,
	email_error_message,
	is_submitting,

	setModalOpen,
	closeModal,
	onEmailInput,
	confirmEmailChange,
} = useEmailChangeModal();
</script>

<template>
	<UiModal
		:model-value="is_open"
		align="center"
		width="504px"
		modal-class="checkout-email-change-modal-shell"
		@update:model-value="setModalOpen"
	>
		<MuLinearWrapper
			class="checkout-email-change-modal"
			direction="column"
			gap="32px"
		>
			<UiButton
				variant="ghost"
				tone="neutral"
				size="sm"
				class="checkout-email-change-close"
				:aria-label="translate('checkout.guest.emailChange.closeModal')"
				:sr-label="translate('checkout.guest.emailChange.closeModal')"
				icon-only
				:no-hover="true"
				icon="regular-times"
				:icon-size="24"
				@click="closeModal"
			/>

			<MuLinearWrapper direction="row" gap="16px" align="flex-start">
				<img
					src="/icons/custom/account/email-registered.svg"
					alt=""
					class="checkout-email-change-icon"
				>
				<MuLinearWrapper direction="column" gap="4px">
					<MuText size="xlarge" weight="bold">
						{{ translate('checkout.guest.emailChange.title') }}
					</MuText>
					<MuText size="small" color="var(--text-secondary)">
						{{ translate('checkout.guest.emailChange.description.prefix') }}
						<strong class="checkout-email-change-emphasis">
							{{ translate('checkout.guest.emailChange.confirmAction') }}
						</strong>
						{{ translate('checkout.guest.emailChange.description.suffix') }}
					</MuText>
				</MuLinearWrapper>
			</MuLinearWrapper>

			<MuLinearWrapper direction="column" gap="8px" width="100%">
				<MuLinearWrapper justify="space-between">
					<MuText weight="semi-bold">
						{{ translate('checkout.guest.emailChange.label') }}
					</MuText>
					<MuText size="small" color="error">
						{{ email_error_message }}
					</MuText>
				</MuLinearWrapper>
				<MuInput
					id="checkout-email-change"
					v-model="email_change_form.new_email"
					:placeholder="translate('checkout.guest.emailChange.placeholder')"
					type="email"
					name="checkout-email-change"
					:has-error="email_error"
					@update:model-value="onEmailInput"
				/>
			</MuLinearWrapper>
		</MuLinearWrapper>

		<template #footer>
			<MuLinearWrapper width="100%">
				<UiButton
					tone="neutral"
					size="lg"
					width="100%"
					:disabled="is_submitting"
					@click="confirmEmailChange"
				>
					{{ translate('checkout.guest.emailChange.confirm') }}
				</UiButton>

			</MuLinearWrapper>
		</template>
	</UiModal>
</template>

<style lang="scss">
.checkout-email-change-modal {
	position: relative;

	.checkout-email-change-close {
		position: absolute;
		top: 0;
		right: 0;
	}

	.checkout-email-change-icon {
		width: 48px;
		height: 48px;
		flex-shrink: 0;
	}

	.checkout-email-change-emphasis {
		color: var(--text-primary);
		font-weight: var(--font-weight-bold);
	}
}
</style>