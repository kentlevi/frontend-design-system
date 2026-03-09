<script setup lang="ts">
import { redirectToCountryPath } from '~/composables/app/usePageRedirect';

await redirectToCountryPath('/account/profile', { redirectCode: 302 });
</script>

<template>
	<div data-testid="account-index-redirect" />
</template>