<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';

withDefaults(defineProps<{
	loading?: boolean;
}>(), {
	loading: false,
});
</script>

<template>
	<MuLinearWrapper
		class="account-content account-profile"
		data-testid="account-profile-content"
		direction="column"
		:gap="56"
	>
		<FeaturesAccountProfileContentPersonal :loading="loading" />
		<FeaturesAccountProfileContentPassword :loading="loading" />
		<FeaturesAccountProfileContentSettings :loading="loading" />
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.account-content {
	min-height: 100%;
}
</style>
