<script setup lang="ts">
import PrivacyPolicyPage from '~/components/legal/PrivacyPolicyPage.vue';

definePageMeta({
	layout: 'home',
	layoutBackground: 'neutral',
});

const { t } = useI18n();

useSeoMeta({
	title: () => t('legal.privacy.title'),
});
</script>

<template>
	<PrivacyPolicyPage />
</template>