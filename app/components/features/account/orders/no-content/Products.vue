<template>
	<MuCard padding="none" bordered="none" class="products">
		<NuxtLink :to="to" class="products-link" :data-testid="dataTestId">
			<figure class="products-img-con">
				<img :src="item.image" :alt="`No Content - ${item.name}`">
			</figure>
			<MuText size="large" weight="medium" align="center">{{ item.name }}</MuText>
		</NuxtLink>
	</MuCard>
</template>

<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuText from '~/components/base/MuText.vue';
import type { HomeProductType } from '~/types/products/homeTypes';

defineProps<{
	item: HomeProductType;
	to: string;
	dataTestId?: string;
}>();
</script>

<style lang="scss" scoped>
.products{
	transition: background 0.2s ease;
	&:hover{
		background: var(--gray-20);
		img{
			transition: transform 0.24s ease;
			transform: scale(1.07);
		}
	}
}
.products-link {
	display: block;
	text-decoration: none;
	color: inherit;
	padding: 12px 0;
}
.products-img-con{
	width: 125px;
	height: 96px;
	margin: 0 auto 12px;
	img{
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
}
</style>