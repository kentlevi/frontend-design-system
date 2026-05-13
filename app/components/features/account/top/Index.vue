<template>
	<MuLinearWrapper justify="space-between" align="center" :gap="24" data-testid="account-shell-top">
		<FeaturesAccountTopUser />
		<FeaturesAccountTopStats />
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
</script>