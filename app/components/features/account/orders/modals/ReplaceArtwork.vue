<template>
	<UiModal
		:model-value="is_open"
		width="640px"
		title="Replace Artwork - Item 001"
		align="center"
		modal-class="replace-artwork-modal"
		@update:model-value="!$event && close_modal()"
	>
		<MuLinearWrapper class="replace-artwork-modal-body" direction="column" :gap="16">
			<MuLinearWrapper direction="column" :gap="4">
				<MuText weight="semi-bold">Evaluation Feedback</MuText>
				<MuCard variant="subtle" padding="md" bordered="none">
					<MuLinearWrapper v-viewer="viewer_options" align="center" :gap="16">
						<MuThumbnail
							:size="48"
							shape="square"
							fit="contain"
							:src="evaluation_artwork_src"
							alt="Submitted artwork"
						/>
						<MuLinearWrapper direction="column">
							<MuText weight="semi-bold">Staff Comment:</MuText>
							<MuText color="text-secondary">The image is blurred. We can't use this for production.</MuText>
						</MuLinearWrapper>
					</MuLinearWrapper>
				</MuCard>
			</MuLinearWrapper>
			<MuLinearWrapper>
				<MuFileInput
					placeholder="Upload your artwork here"
					:accepted-formats="['eps', 'ai', 'psd', 'pdf', 'tif', 'png', 'jpg']"
				/>
			</MuLinearWrapper>
			<MuLinearWrapper direction="column" :gap="4">
				<MuText weight="semi-bold">Special Instructions</MuText>
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
import MuCard from '~/components/base/MuCard.vue';
import MuFileInput from '~/components/base/MuFileInput.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import MuThumbnail from '~/components/core/MuThumbnail.vue';
import { useReplaceArtworkModal } from '~/composables/features/account/orders/useReplaceArtworkModal'

const { is_open, close_modal } = useReplaceArtworkModal()

const evaluation_artwork_src = 'https://static.musticker.com/dev/store-front/illustrations/products/stickers/die-cut.svg';

const viewer_options = {
	button: true,
	tooltip: true,
	toolbar: {
		prev: 1,
		zoomOut: 1,
		reset: 1,
		zoomIn: 1,
		next: 1,
	},
	zoomable: true,
	transition: true,
	fullscreen: true,
	keyboard: false,
	navbar: true,
	loop: false,
}
</script>

<style lang="scss" scoped>
:global(.ui-modal-overlay:has(.replace-artwork-modal)) {
	z-index: 1100;
}
</style>
