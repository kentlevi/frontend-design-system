<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { NuxtError } from '#app';
import { DEFAULT_COUNTRY, resolveSupportedCountry } from '~/app/constants/countries';

const props = defineProps<{
	error: NuxtError;
}>();

const route = useRoute();

const redirect_target = computed(() => {
	const first_segment = route.path.split('/').filter(Boolean)[0] || '';
	const country = resolveSupportedCountry(first_segment) || DEFAULT_COUNTRY;
	return `/${country}/under-construction`;
});

if (props.error?.statusCode === 404 && route.path !== redirect_target.value) {
	await clearError({ redirect: redirect_target.value });
}
</script>

<template>
	<div class="app-error">
		<h1 class="app-error-title">{{ error?.statusCode || 500 }}</h1>
		<p class="app-error-message">{{ error?.message || 'Something went wrong.' }}</p>
	</div>
</template>