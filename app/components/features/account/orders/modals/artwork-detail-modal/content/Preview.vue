<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuLink from '~/components/base/MuLink.vue';
import MuText from '~/components/base/MuText.vue';
import MuThumbnail from '~/components/core/MuThumbnail.vue';
import { useArtworkDetailModal } from '~/composables/features/account/orders/useArtworkDetailModal';
import { useReplaceArtworkModal } from '~/composables/features/account/orders/useReplaceArtworkModal';
import { useRequestChangesModal } from '~/composables/features/account/orders/useRequestChangesModal';

const { is_dark_background } = useArtworkDetailModal();
const { open_modal: open_replace_artwork_modal } = useReplaceArtworkModal();
const { open_modal: open_request_changes_modal } = useRequestChangesModal();

const artwork_src = 'https://static.musticker.com/dev/store-front/illustrations/products/stickers/die-cut.svg';
const artwork_alt = 'Sample Artwork';
</script>

<template>
	<MuLinearWrapper
		direction="column"
		align="center"
		:gap="16"
		width="100%"
		class="artwork-detail-preview"
	>
		<MuLinearWrapper
			direction="column"
			align="center"
			justify="center"
			class="artwork-detail-preview__media"
			:class="{ 'is-dark': is_dark_background }"
		>
			<MuCard variant="primary" padding="xsm">
				<MuLinearWrapper :gap="4">
					<UiIcon name="regular-check-circle"/>
					<MuText weight="semi-bold">
						Proof #1 Sticker Size: 25x30mm
					</MuText>
				</MuLinearWrapper>
			</Mucard>
			<MuThumbnail
				:size="200"
				shape="square"
				fit="contain"
				:src="artwork_src"
				:alt="artwork_alt"
			/>
		</MuLinearWrapper>

		<MuLinearWrapper
			class="artwork-detail-preview__status"
			direction="column"
			align="center"
			:gap="24"
		>
			<MuLinearWrapper direction="column">
				<MuText size="large" weight="semi-bold" align="center">
					Your artwork is in the queue for evaluation.
				</MuText>
				<MuText color="text-secondary" align="center">
					If you need to make changes, you can still replace it before the review begins. Please click
					<MuLink @click.prevent="open_replace_artwork_modal">Replace Artwork</MuLink>.
				</MuText>
			</MuLinearWrapper>
			<MuLinearWrapper justify="center" :gap="16">
				<UiButton variant="outline" tone="neutral" icon="regular-file-details" :icon-size="24" @click="open_request_changes_modal">
					<MuText>Request Changes</MuText>
				</UiButton>
				<UiButton tone="neutral" icon="regular-check-circle" :icon-size="24">
					<MuText>Approve</MuText>
				</UiButton>
			</MuLinearWrapper>
			<MuLinearWrapper justify="center" :gap="16">
				<UiButton variant="outline" tone="neutral">
					<MuText>Resubmit Artwork</MuText>
				</UiButton>
			</MuLinearWrapper>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.artwork-detail-preview {
	&__media {
		background: transparent;
		transition: background 200ms ease;

		&.is-dark {
			background: var(--abyss-base);
		}
	}

	&__status {
		max-width: 640px;
		margin: 0 auto;
	}
}
</style>
