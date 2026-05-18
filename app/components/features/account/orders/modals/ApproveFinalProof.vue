<template>
	<UiModal
		:model-value="is_open"
		width="560px"
		align="center"
		modal-class="approve-final-proof-modal"
		hide-header
		@update:model-value="!$event && close_modal()"
	>
		<MuLinearWrapper class="approve-final-proof-modal-body" align="flex-start" :gap="20">
			<div class="approve-final-proof-modal__icon">
				<UiIcon name="regular-check-circle" :size="32" color="var(--text-primary)" />
			</div>
			<MuLinearWrapper direction="column" :gap="6">
				<MuText size="large" weight="bold">Approve Final Proof?</MuText>
				<MuText color="text-secondary">
					Approving this final proof will move your order to <strong>&ldquo;For Production&rdquo;</strong> status. Once approved, no further changes can be made and your order will proceed to production.
				</MuText>
			</MuLinearWrapper>
		</MuLinearWrapper>

		<template #footer>
			<MuLinearWrapper justify="flex-end" align="center" :gap="12">
				<UiButton variant="ghost" tone="neutral" @click="close_modal">
					<MuText>Review Again</MuText>
				</UiButton>
				<UiButton tone="neutral" @click="close_modal">
					<MuText>Approve &amp; Proceed to Production</MuText>
				</UiButton>
			</MuLinearWrapper>
		</template>
	</UiModal>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useApproveFinalProofModal } from '~/composables/features/account/orders/useApproveFinalProofModal'

const { is_open, close_modal } = useApproveFinalProofModal()
</script>

<style lang="scss" scoped>
:global(.ui-modal-overlay:has(.approve-final-proof-modal)) {
	z-index: 1100;
}

.approve-final-proof-modal__icon {
	flex: 0 0 auto;
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: #ffe05c;
	display: grid;
	place-items: center;
	color: var(--text-primary);
}
</style>
