<template>
	<UiModal
		:model-value="is_open"
		width="720px"
		title="Terms & Conditions"
		align="center"
		modal-class="final-proof-terms-modal"
		@update:model-value="!$event && close_modal()"
	>
		<MuLinearWrapper class="final-proof-terms-modal-body" direction="column" :gap="20">
			<MuText>
				If you approve the final proof and confirm your payment <strong>after 5:00PM</strong>, the order will be processed the next business day.
			</MuText>

			<MuText>
				We normally check the important details required for production. The correction of the design content <strong>(such as misspelling)</strong> is not subject to reproduction.
			</MuText>

			<MuText>
				In spite of the most modern printing machines, <strong>color difference of 5-10% and movement of 1-2mm</strong> on the actual sticker product should be acceptable due to mechanical tolerances.
			</MuText>

			<MuText>
				The estimated turnaround time includes printing &amp; delivery.
			</MuText>

			<MuLinearWrapper direction="column" :gap="12" class="final-proof-terms-modal-section">
				<MuText weight="bold">Note:</MuText>
				<ul class="final-proof-terms-modal-list">
					<li>Bumper Sticker is printed using digital printing. The printing resolution is lower than offset printing.</li>
					<li>Due to the characteristics of the material, the sticker may curl up after time. Choose coated option to avoid this issue.</li>
				</ul>
			</MuLinearWrapper>

			<MuLinearWrapper direction="column" :gap="12" class="final-proof-terms-modal-section">
				<MuText weight="bold">Order Cancellations:</MuText>
				<ul class="final-proof-terms-modal-list">
					<li>Order cancellations are only allowed during 'Before Production' status; once the status changes to 'In Production,' cancellations are disabled as printing has begun, so please review your order carefully beforehand.</li>
				</ul>
			</MuLinearWrapper>
		</MuLinearWrapper>

		<template #footer>
			<MuLinearWrapper justify="flex-end">
				<UiButton variant="filled" tone="neutral" @click="close_modal">
					<MuText>Close</MuText>
				</UiButton>
			</MuLinearWrapper>
		</template>
	</UiModal>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useFinalProofTermsModal } from '~/composables/features/account/orders/useFinalProofTermsModal'

const { is_open, close_modal } = useFinalProofTermsModal()
</script>

<style lang="scss" scoped>
:global(.ui-modal-overlay:has(.final-proof-terms-modal)) {
	z-index: 1100;
}

.final-proof-terms-modal-list {
	margin: 0;
	padding: 0;
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: 12px;

	li {
		position: relative;
		padding-left: 22px;
		line-height: 1.5;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 8px;
			width: 8px;
			height: 8px;
			border-radius: 50%;
			background-color: #f4c542;
		}
	}
}
</style>