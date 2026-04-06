<template>
	<div class="checkout-member-card-grid" :class="{ 'only-one': card_count === 1 }" aria-hidden="true">
		<div
			v-for="card in card_count"
			:key="card"
			class="checkout-member-choice-card"
			aria-hidden="true"
		>
			<div class="checkout-member-choice-icon-skeleton" />

			<div class="checkout-member-choice-copy">
				<div class="checkout-member-choice-title-skeleton" />
				<div class="checkout-member-choice-subtitle-skeleton" />
			</div>

			<div class="checkout-member-choice-price-skeleton" />
		</div>
	</div>
</template>

<script setup lang="ts">
withDefaults(
	defineProps<{
		card_count?: number;
	}>(),
	{
		card_count: 1,
	}
);
</script>

<style scoped lang="scss">
.checkout-member-card-grid {
	display: grid;
	gap: 12px;
	grid-template-columns: repeat(2, minmax(0, 1fr));

	&.only-one {
		grid-template-columns: repeat(1, minmax(0, 1fr));
	}
}

.checkout-member-choice-card {
	min-height: 62px;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 14px 16px;
	border: 1px solid var(--gray-40);
	border-radius: 12px;
	background: var(--contrast-light);
}

.checkout-member-choice-icon-skeleton,
.checkout-member-choice-title-skeleton,
.checkout-member-choice-subtitle-skeleton,
.checkout-member-choice-price-skeleton {
	border-radius: 8px;
	background: linear-gradient(
		90deg,
		var(--gray-20) 25%,
		var(--gray-40) 37%,
		var(--gray-20) 63%
	);
	background-size: 400% 100%;
	animation: checkout-shipping-method-skeleton-shimmer 1.4s ease-in-out
		infinite;
}

.checkout-member-choice-icon-skeleton {
	width: 36px;
	height: 36px;
	border-radius: 10px;
	flex-shrink: 0;
}

.checkout-member-choice-copy {
	flex: 1;
	display: grid;
	gap: 4px;
}

.checkout-member-choice-title-skeleton {
	width: 130px;
	height: 14px;
	margin-bottom: 4px;
}

.checkout-member-choice-subtitle-skeleton {
	width: 180px;
	max-width: 100%;
	height: 12px;
}

.checkout-member-choice-price-skeleton {
	width: 54px;
	height: 14px;
}

@keyframes checkout-shipping-method-skeleton-shimmer {
	0% {
		background-position: 100% 0;
	}

	100% {
		background-position: 0 0;
	}
}
</style>
