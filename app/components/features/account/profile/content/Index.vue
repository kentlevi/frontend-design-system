<script setup lang="ts">
withDefaults(defineProps<{
	loading?: boolean;
}>(), {
	loading: false,
});
</script>

<template>
	<div class="account-content account-profile" data-testid="account-profile-content">
		<FeaturesAccountProfileContentPersonal :loading="loading" />
		<FeaturesAccountProfileContentPassword :loading="loading" />
		<FeaturesAccountProfileContentSettings :loading="loading" />
	</div>
</template>

<style scoped lang="scss">
.account-content {
	min-height: 100%;
	display: flex;
	flex-direction: column;
	gap: 56px;
}
</style>
