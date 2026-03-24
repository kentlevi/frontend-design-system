<script setup lang="ts">
import AuthProfilePage from '~/components/auth/profile/AuthProfilePage.vue';

definePageMeta({
	layout: 'home',
	layoutBackground: 'neutral',
	isSimpleHeader: true,
	footerVariant: 'compact',
});
</script>

<template>
	<AuthProfilePage />
</template>