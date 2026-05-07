<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{
	error: NuxtError;
}>();
</script>

<template>
	<div class="app-error">
		<h1 class="app-error-title">{{ error?.statusCode || 500 }}</h1>
		<p class="app-error-message">{{ error?.message || 'Something went wrong.' }}</p>
	</div>
</template>