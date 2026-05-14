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
	formatted_size,
	quantity,
	formatted_cost,
	status_label,
	needs_artwork,
} = useOrderDetailItem(props)

const { handleUploadArtwork } = useOrderDetailItemUI()
</script>

<template>
	<MuCard class="item" variant="transparent" padding="none" bordered="none">
		<MuLinearWrapper justify="space-between">
			<MuLinearWrapper :gap="24">
				<div class="item-img-wrapper">
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
						<MuText v-if="formatted_size" color="abyss-40">Size: {{ formatted_size }}</MuText>
						<MuText v-if="quantity" color="abyss-40">Quantity: {{ quantity }}</MuText>
					</MuLinearWrapper>
				</MuLinearWrapper>
			</MuLinearWrapper>
			<MuLinearWrapper direction="column" justify="space-between" align="flex-end">
				<UiButton v-if="needs_artwork" tone="neutral" @click="handleUploadArtwork">Upload Artwork</UiButton>
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