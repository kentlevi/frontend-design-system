<script setup lang="ts">
import MuFileInput from '~/components/base/MuFileInput.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useUploadArtworkModalContext } from '~/composables/features/account/orders/context/useUploadArtworkModalContext'

const {
	is_open,
	product,
	formatted_size,
	formatted_quantity,
	close_modal,
} = useUploadArtworkModalContext()
</script>

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
					<MuLinearWrapper v-if="product" justify="space-between" width="100%">
						<MuText color="abyss-40">Product:</MuText>
						<MuText color="abyss-40" weight="semi-bold">{{ product }}</MuText>
					</MuLinearWrapper>
					<MuLinearWrapper v-if="formatted_size" justify="space-between" width="100%">
						<MuText color="abyss-40">Size:</MuText>
						<MuText color="abyss-40" weight="semi-bold">{{ formatted_size }}</MuText>
					</MuLinearWrapper>
					<MuLinearWrapper v-if="formatted_quantity" justify="space-between" width="100%">
						<MuText color="abyss-40">Quantity:</MuText>
						<MuText color="abyss-40" weight="semi-bold">{{ formatted_quantity }}</MuText>
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

<style lang="scss" scoped>
.item-details{
	padding: 16px 24px;
	background: var(--gray-10);
	border-radius: 8px;
}
</style>