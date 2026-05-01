<script setup lang="ts">
import { computed } from 'vue';
import { useProductExperience } from '~/composables/products/categoryExperience/useProductCategoryExperience';
import { getProductIdFromSlug } from '~/helpers/products/productCategory.helper';

const {
	category_data,
	getProductName,
	getProductPath,
	selected_id,
	selectProduct,
} = useProductExperience();

type StageProduct = {
	id: string;
	name: string;
	image: string;
};

const category_key = computed(() => category_data.value?.key);

const category_products = computed<StageProduct[]>(() =>
	(category_data.value?.products || []).map((product) => {
		const product_id = category_key.value ? (getProductIdFromSlug(product.id, category_key.value) || product.id) : product.id;
		return {
			...product,
			id: product_id,
		};
	})
);

function handleProductSelect(event: MouseEvent, product_id: string) {
	if (
		event.defaultPrevented ||
		event.button !== 0 ||
		event.metaKey ||
		event.ctrlKey ||
		event.shiftKey ||
		event.altKey
	) {
		return;
	}

	event.preventDefault();
	selectProduct(product_id);
}
</script>

<template>
	<div class="product-picker-layer">
		<nav class="product-picker" data-testid="product-category-picker">
			<NuxtLink
				v-for="product in category_products"
				:key="product.id"
				:to="getProductPath(product.id)"
				class="product-picker-item"
				:class="[{ 'is-active': selected_id === product.id }]"
				:data-testid="`product-category-picker-item-${product.id}`"
				@click="handleProductSelect($event, product.id)"
			>
				<div class="product-picker-icon" :class="`is-${product.id}`">
					<img
						v-if="product.image"
						:src="product.image"
						:alt="getProductName(product)"
						class="product-picker-image"
					>
				</div>
				<div class="product-picker-meta">
					<h4 class="product-picker-name">{{ getProductName(product) }}</h4>
				</div>
			</NuxtLink>
		</nav>
	</div>
</template>

<style scoped lang="scss">
.product-picker {
	align-content: start;
	column-gap: 40px;
	display: grid;
	grid-template-columns: repeat(4, minmax(0, 1fr));
	row-gap: 16px;
}

.product-picker-item {
	align-items: center;
	animation: fadeInUp 0.4s cubic-bezier(0.2, 0, 0.2, 1) both;
	background: transparent;
	border: 0;
	border-radius: 14px;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	padding: 0;
	text-decoration: none;
	transition: background-color 0.2s ease;

	&.is-active,
	&:hover {
		background: var(--gray-10);
	}

	&:hover .product-picker-image {
		transform: scale(1.07);
	}

	&:first-child { animation-delay: 0.03s; }
	&:nth-child(2) { animation-delay: 0.06s; }
	&:nth-child(3) { animation-delay: 0.09s; }
	&:nth-child(4) { animation-delay: 0.12s; }
	&:nth-child(5) { animation-delay: 0.15s; }
	&:nth-child(6) { animation-delay: 0.18s; }
	&:nth-child(7) { animation-delay: 0.21s; }
	&:nth-child(8) { animation-delay: 0.24s; }
	&:nth-child(9) { animation-delay: 0.27s; }
	&:nth-child(10) { animation-delay: 0.3s; }
	&:nth-child(11) { animation-delay: 0.33s; }
	&:nth-child(12) { animation-delay: 0.36s; }
}

.product-picker-icon {
	border-radius: 14px;
	display: grid;
	padding: 34px 42px;
	place-items: center;
	position: relative;

	.product-picker-image {
		display: block;
		height: 120px;
		object-fit: contain;
		transform-origin: center;
		transition: transform 0.24s ease, opacity 0.3s ease;
		width: 156px;
	}
}

.product-picker-meta {
	padding-bottom: 24px;
	text-align: center;
}

.product-picker-name {
	color: var(--text-primary);
	font-size: var(--type-size-200);
	font-weight: var(--font-weight-medium);
	line-height: var(--type-line-200);
}

@keyframes fadeInUp {
	0% {
		opacity: 0;
		transform: translateY(12px) scale(0.98);
	}
	to {
		opacity: 1;
		transform: translateY(0) scale(1);
	}
}

@media (max-width: 980px) {
	.product-picker {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}
}

@media (max-width: 760px) {
	.product-picker {
		grid-template-columns: repeat(2, minmax(0, 1fr));
		padding: 18px;
	}
	.product-picker-icon {
		height: 82px;
		width: 98px;
	}
}
</style>