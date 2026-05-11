<template>
	<UiModal
		:model-value="is_open"
		width="640px"
		title="Upload Artwork"
		modal-class="upload-artwork-modal"
		@update:model-value="!$event && close_modal()"
	>
		<UiLinearWrapper class="upload-artwork-modal-body" direction="column" :gap="16">
			<UiLinearWrapper class="item-details" direction="column" :gap="4">
				<UiText weight="semi-bold">Item Details:</UiText>
				<UiLinearWrapper direction="column">
					<UiLinearWrapper justify="space-between" width="100%">
						<UiText color="abyss-40">Product:</UiText>
						<UiText color="abyss-40" weight="semi-bold">Die Cut Sticker</UiText>
					</UiLinearWrapper>
					<UiLinearWrapper justify="space-between" width="100%">
						<UiText color="abyss-40">Size:</UiText>
						<UiText color="abyss-40" weight="semi-bold">25x25mm</UiText>
					</UiLinearWrapper>
					<UiLinearWrapper justify="space-between" width="100%">
						<UiText color="abyss-40">Quantity:</UiText>
						<UiText color="abyss-40" weight="semi-bold">1000 pcs</UiText>
					</UiLinearWrapper>
				</UiLinearWrapper>
			</UiLinearWrapper>
			<UiLinearWrapper>
				<UiFileInput
					placeholder="Upload your artwork here"
					:accepted-formats="['.jpg', '.jpeg', '.png', '.pdf']"
				/>
			</UiLinearWrapper>
			<UiLinearWrapper direction="column" :gap="4">
				<UiText weight="semi-bold">Special Instructions</UiText>
				<UiTextarea
					placeholder="Enter special instruction here...."
				/>
			</UiLinearWrapper>
		</UiLinearWrapper>

		<template #footer>
			<UiLinearWrapper justify="flex-end" align="center" :gap="12">
				<UiButton variant="ghost" tone="neutral" @click="close_modal">
					<UiText>Cancel</UiText>
				</UiButton>
				<UiButton tone="neutral" @click="close_modal">
					<UiText>Submit</UiText>
				</UiButton>
			</UiLinearWrapper>
		</template>
	</UiModal>
</template>

<script setup lang="ts">
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