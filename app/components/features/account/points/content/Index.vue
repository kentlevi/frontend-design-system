<script setup lang="ts">
</script>

<template>
	<div class="account-points-grid">
		<FeaturesAccountPointsContentCopy />
		<FeaturesAccountPointsContentMain />
	</div>
</template>

<style scoped lang="scss">
.account-points-grid {
	display: grid;
	grid-template-columns: 384px minmax(0, 1fr);
	gap: 126px;
	align-items: start;
}

@media (max-width: 1180px) {
	.account-points-grid {
		grid-template-columns: 1fr;
		gap: 36px;
	}
}
</style>