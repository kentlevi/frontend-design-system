<script setup lang="ts">
import AuthProfilePage from '~/components/auth/profile/AuthProfilePage.vue';

definePageMeta({
	layout: 'home',
	layoutBackground: 'neutral',
	hideHeader: true,
});
</script>

<template>
	<AuthProfilePage />
</template>