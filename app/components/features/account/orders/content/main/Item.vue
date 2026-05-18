<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import type { OrderDetailItem } from '~/types/order/order-detail';
import { useOrderDetailItem } from '~/composables/orders/useOrderDetailItem';
import { useOrderDetailItemUI } from '~/composables/orders/useOrderDetailItemUI';

const props = defineProps<{
	item: OrderDetailItem
	index: number
}>()

const {
	item_number,
	image_src,
	product,
	formatted_size,
	quantity,
	formatted_cost,
	status_label,
	needs_artwork,
} = useOrderDetailItem(props)

const { handleUploadArtwork, handleReplaceArtwork, handleViewArtwork } = useOrderDetailItemUI()

function onImageClick() {
	handleViewArtwork()
}
</script>

<template>
	<MuCard class="item" variant="transparent" padding="none" bordered="none">
		<MuLinearWrapper justify="space-between">
			<MuLinearWrapper :gap="24">
				<div
					class="item-img-wrapper is-clickable"
					role="button"
					tabindex="0"
					@click="onImageClick"
					@keydown.enter.prevent="onImageClick"
					@keydown.space.prevent="onImageClick"
				>
					<img :src="image_src">
				</div>
				<MuLinearWrapper direction="column" :gap="8">
					<MuLinearWrapper align="center" :gap="16">
						<MuLinearWrapper align="center" :gap="4">
							<MuText size="large" weight="bold">{{ item_number }}</MuText>
							<UiIcon name="regular-info-circle"/>
						</MuLinearWrapper>
						<UiBadge v-if="needs_artwork"><UiIcon name="regular-exclamation-triangle"/>{{ status_label }}</UiBadge>
					</MuLinearWrapper>
					<MuLinearWrapper class="item-description" direction="column">
						<MuText v-if="product" color="abyss-40">{{ product }}</MuText>
						<MuText v-if="formatted_size && quantity" color="abyss-40">{{ formatted_size }} | {{ quantity }}</MuText>
					</MuLinearWrapper>
				</MuLinearWrapper>
			</MuLinearWrapper>
			<MuLinearWrapper direction="column" justify="space-between" align="flex-end">
				<UiButton v-if="needs_artwork" tone="neutral" @click="handleUploadArtwork">Upload Artwork</UiButton>
				<UiButton v-if="needs_artwork" tone="neutral" @click="handleReplaceArtwork">Replace Artwork</UiButton>
				<MuText size="large" weight="bold">{{ formatted_cost }}</MuText>
			</MuLinearWrapper>
		</MuLinearWrapper>
	</MuCard>
</template>

<style lang="scss" scoped>
.item-img-wrapper{
	width: 88px;
	height: 88px;
	border-radius: 8px;
	background: var(--gray-20);
	position: relative;

	&.is-clickable{
		cursor: pointer;
		transition: box-shadow 120ms ease, transform 120ms ease;

		&:hover{
			box-shadow: 0 0 0 2px var(--brand-primary);
		}

		&:focus-visible{
			outline: none;
			box-shadow: 0 0 0 2px var(--brand-primary);
		}

		&:active{
			transform: scale(0.98);
		}
	}

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