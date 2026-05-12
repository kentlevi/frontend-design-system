<template>
	<UiModal
		:model-value="is_open"
		width="640px"
		title="Upload Artwork"
		modal-class="upload-artwork-modal"
		@update:model-value="!$event && close_modal()"
	>
		<MuLinearWrapper class="upload-artwork-modal-body" direction="column" :gap="16">
			<MuLinearWrapper class="item-details" direction="column" :gap="4">
				<MuText weight="semi-bold">Item Details:</MuText>
				<MuLinearWrapper direction="column">
					<MuLinearWrapper justify="space-between" width="100%">
						<MuText color="abyss-40">Product:</MuText>
						<MuText color="abyss-40" weight="semi-bold">Die Cut Sticker</MuText>
					</MuLinearWrapper>
					<MuLinearWrapper justify="space-between" width="100%">
						<MuText color="abyss-40">Size:</MuText>
						<MuText color="abyss-40" weight="semi-bold">25x25mm</MuText>
					</MuLinearWrapper>
					<MuLinearWrapper justify="space-between" width="100%">
						<MuText color="abyss-40">Quantity:</MuText>
						<MuText color="abyss-40" weight="semi-bold">1000 pcs</MuText>
					</MuLinearWrapper>
				</MuLinearWrapper>
			</MuLinearWrapper>
			<MuLinearWrapper>
				<MuFileInput
					placeholder="Upload your artwork here"
					:accepted-formats="['.jpg', '.jpeg', '.png', '.pdf']"
				/>
			</MuLinearWrapper>
			<MuLinearWrapper direction="column" :gap="4">
				<MuText weight="semi-bold">Special Instructionss</MuText>
				<UiTextarea
					placeholder="Enter special instruction here...."
				/>
			</MuLinearWrapper>
		</MuLinearWrapper>

		<template #footer>
			<MuLinearWrapper justify="flex-end" align="center" :gap="12">
				<UiButton variant="ghost" tone="neutral" @click="close_modal">
					<MuText>Cancel</MuText>
				</UiButton>
				<UiButton tone="neutral" @click="close_modal">
					<MuText>Submit</MuText>
				</UiButton>
			</MuLinearWrapper>
		</template>
	</UiModal>
</template>

<script setup lang="ts">
import MuFileInput from '~/components/base/MuFileInput.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useUploadArtworkModal } from '~/composables/features/account/orders/useUploadArtworkModal'

const { is_open, close_modal } = useUploadArtworkModal()
</script>

<style lang="scss" scoped>
.item-details{
	padding: 16px 24px;
	background: var(--gray-10);
	border-radius: 8px;
}
</style>