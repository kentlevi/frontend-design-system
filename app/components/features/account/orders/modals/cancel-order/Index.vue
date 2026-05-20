<template>
	<!-- Step 1: Confirmation alert -->
	<UiModal
		:model-value="is_open && step === 'confirm'"
		width="500px"
		align="center"
		modal-class="cancel-order-confirm-modal"
		hide-header
		@update:model-value="!$event && close_modal()"
	>
		<Confirm/>

		<template #footer>
			<MuLinearWrapper justify="flex-end" align="center" :gap="12">
				<UiButton variant="ghost" tone="neutral" @click="close_modal">
					<MuText>Keep Order</MuText>
				</UiButton>
				<UiButton tone="neutral" @click="proceed_to_reason">
					<MuText>Yes, Cancel Order</MuText>
				</UiButton>
			</MuLinearWrapper>
		</template>
	</UiModal>

	<!-- Step 2: Reason form -->
	<UiModal
		:model-value="is_open && step === 'reason'"
		width="640px"
		align="center"
		title="Why are you cancelling this order?"
		modal-class="cancel-order-reason-modal"
		@update:model-value="!$event && close_modal()"
	>
		<Reason v-model:reason="reason" v-model:feedback="feedback"/>

		<template #footer>
			<MuLinearWrapper justify="flex-end" align="center" :gap="12">
				<UiButton variant="ghost" tone="neutral" @click="close_modal">
					<MuText>Cancel</MuText>
				</UiButton>
				<UiButton tone="neutral" @click="submit_cancel">
					<MuText>Submit</MuText>
				</UiButton>
			</MuLinearWrapper>
		</template>
	</UiModal>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import Confirm from './Confirm.vue';
import Reason from './Reason.vue';
import { useCancelOrderModal } from '~/composables/features/account/orders/useCancelOrderModal'

const {
	is_open,
	step,
	close_modal,
	proceed_to_reason,
} = useCancelOrderModal()

const reason = ref('')
const feedback = ref('')

function submit_cancel() {
	// TODO: wire to actual cancellation service later
	close_modal()
	reason.value = ''
	feedback.value = ''
}
</script>

<style lang="scss" scoped></style>
