<template>
	<UiCard class="item" variant="transparent" padding="none" bordered="none">
		<UiLinearWrapper justify="space-between">
			<UiLinearWrapper :gap="24">
				<div class="item-img-wrapper">
					<img src="https://static.musticker.com/dev/store-front/illustrations/products/stickers/rectangle.svg"/>
				</div>
				<UiLinearWrapper direction="column" :gap="8">
					<UiLinearWrapper align="center" :gap="16">
						<UiLinearWrapper align="center" :gap="4">
							<UiText size="large" weight="bold">Item No. 001</UiText>
							<UiIcon name="regular-info-circle"/>
						</UiLinearWrapper>
						<UiBadge><UiIcon name="regular-exclamation-triangle"/> Lacking Artwork</UiBadge>
					</UiLinearWrapper>
					<UiLinearWrapper class="item-description" direction="column">
						<UiText color="abyss-40">Size: 25x25mm</UiText>
						<UiText color="abyss-40">Quantity: 200</UiText>
					</UiLinearWrapper>
				</UiLinearWrapper>
			</UiLinearWrapper>
			<UiLinearWrapper direction="column" justify="space-between" align="flex-end">
				<UiButton tone="neutral" @click="open_upload_artwork">Upload Artwork</UiButton>
				<UiText size="large" weight="bold">234,318.40원</UiText>
			</UiLinearWrapper>
		</UiLinearWrapper>
	</UiCard>
</template>

<script setup lang="ts">
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