<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';

definePageMeta({
	layout: 'home',
	footerVariant: 'compact',
});
</script>

<template>
	<MuLinearWrapper class="account-shell" direction="column" data-testid="account-shell">
		<FeaturesAccountTop />
		<FeaturesAccountTabs />
		<NuxtPage :keepalive="{ max: 8 }" />
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.account-shell {
	max-width: 1200px;
	margin: 0 auto;
	padding: 40px 0 104px;
}
</style>
