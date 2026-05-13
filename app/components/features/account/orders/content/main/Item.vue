<template>
	<MuCard class="item" variant="transparent" padding="none" bordered="none">
		<MuLinearWrapper justify="space-between">
			<MuLinearWrapper :gap="24">
				<div class="item-img-wrapper">
					<img src="https://static.musticker.com/dev/store-front/illustrations/products/stickers/rectangle.svg">
				</div>
				<MuLinearWrapper direction="column" :gap="8">
					<MuLinearWrapper align="center" :gap="16">
						<MuLinearWrapper align="center" :gap="4">
							<MuText size="large" weight="bold">Item No. 001</MuText>
							<UiIcon name="regular-info-circle"/>
						</MuLinearWrapper>
						<UiBadge><UiIcon name="regular-exclamation-triangle"/> Lacking Artwork</UiBadge>
					</MuLinearWrapper>
					<MuLinearWrapper class="item-description" direction="column">
						<MuText color="abyss-40">Size: 25x25mm</MuText>
						<MuText color="abyss-40">Quantity: 200</MuText>
					</MuLinearWrapper>
				</MuLinearWrapper>
			</MuLinearWrapper>
			<MuLinearWrapper direction="column" justify="space-between" align="flex-end">
				<UiButton tone="neutral" @click="open_upload_artwork">Upload Artwork</UiButton>
				<MuText size="large" weight="bold">234,318.40 KRW</MuText>
			</MuLinearWrapper>
		</MuLinearWrapper>
	</MuCard>
</template>

<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useUploadArtworkModal } from '~/composables/features/account/orders/useUploadArtworkModal';

const { open_modal } = useUploadArtworkModal();

const open_upload_artwork = () => {
	open_modal();
};
</script>

<style lang="scss" scoped>
.item-img-wrapper{
	width: 88px;
	height: 88px;
	border-radius: 8px;
	background: var(--gray-20);
	position: relative;
	img{
		position: absolute;
		width: 100%;
		height: 100%;
		inset: 0;
		margin: auto;
		object-fit: contain;
	}
}
</style>