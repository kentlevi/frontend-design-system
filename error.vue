<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
	error: NuxtError;
}>();

if (props.error?.statusCode === 404) {
	onMounted(() => {
		void clearError({ redirect: '/' });
	});
}
</script>

<template>
	<div class="app-error">
		<h1 class="app-error-title">{{ error?.statusCode || 500 }}</h1>
		<p class="app-error-message">{{ error?.message || 'Something went wrong.' }}</p>
	</div>
</template>
