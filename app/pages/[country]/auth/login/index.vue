<script setup lang="ts">
definePageMeta({
	layout: 'home',
	layoutBackground: 'neutral',
	middleware: ['guest-only'],
});
</script>

<template>
	<AuthLoginPage />
</template>