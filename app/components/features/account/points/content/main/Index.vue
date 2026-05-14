<script setup lang="ts">
</script>

<template>
	<div class="account-points-main-column">
		<FeaturesAccountPointsContentMainTierCard />
		<FeaturesAccountPointsContentMainChallenges />
		<FeaturesAccountPointsContentMainHistory />
	</div>
</template>

<style scoped lang="scss">
.account-points-main-column {
	display: grid;
	gap: 56px;
	width: 100%;
	justify-self: end;
}

@media (max-width: 1180px) {
	.account-points-main-column {
		max-width: none;
		justify-self: stretch;
	}
}
</style>