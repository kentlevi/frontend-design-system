<script setup lang="ts">
</script>

<template>
	<div class="grid">
		<FeaturesAccountPointsContentSide />
		<FeaturesAccountPointsContentMain />
	</div>
</template>

<style scoped lang="scss">
.grid {
	display: grid;
	grid-template-columns: 384px minmax(0, 1fr);
	gap: 126px;
	align-items: start;
}

@media (max-width: 1180px) {
	.grid {
		grid-template-columns: 1fr;
		gap: 36px;
	}
}
</style>
