<template>
	<UiModal
		:model-value="is_open"
		width="640px"
		title="Request Changes - Item 002"
		align="center"
		modal-class="request-changes-modal"
		@update:model-value="!$event && close_modal()"
	>
		<MuLinearWrapper class="request-changes-modal-body" direction="column" :gap="16">
			<MuLinearWrapper direction="column" :gap="4">
				<MuText weight="semi-bold">Special Instructions</MuText>
				<UiTextarea
					placeholder="Enter special instruction here...."
				/>
			</MuLinearWrapper>
			<MuLinearWrapper>
				<MuFileInput
					placeholder="Upload your artwork here"
					:accepted-formats="['eps', 'ai', 'psd', 'pdf', 'tif', 'png', 'jpg']"
				/>
			</MuLinearWrapper>
		</MuLinearWrapper>

		<template #footer>
			<MuLinearWrapper justify="flex-end" align="center" :gap="12">
				<UiButton variant="ghost" tone="neutral" @click="close_modal">
					<MuText>Cancel</MuText>
				</UiButton>
				<UiButton tone="neutral" @click="close_modal">
					<MuText>Send Request</MuText>
				</UiButton>
			</MuLinearWrapper>
		</template>
	</UiModal>
</template>

<script setup lang="ts">
import MuFileInput from '~/components/base/MuFileInput.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useRequestChangesModal } from '~/composables/features/account/orders/useRequestChangesModal'

const { is_open, close_modal } = useRequestChangesModal()
</script>

<style lang="scss" scoped>
:global(.ui-modal-overlay:has(.request-changes-modal)) {
	z-index: 1100;
}
</style>
