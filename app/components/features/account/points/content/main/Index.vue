<script setup lang="ts">
</script>

<template>
	<div class="main">
		<FeaturesAccountPointsContentMainTierCard />
		<FeaturesAccountPointsContentMainChallenges />
		<FeaturesAccountPointsContentMainHistory />
	</div>
</template>

<style scoped lang="scss">
.main {
	display: grid;
	gap: 56px;
	width: 100%;
	justify-self: end;
}

@media (max-width: 1180px) {
	.main {
		max-width: none;
		justify-self: stretch;
	}
}
</style>
