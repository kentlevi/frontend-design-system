<script setup lang="ts">
import PrivacyPolicyPage from '~/components/legal/PrivacyPolicyPage.vue';

definePageMeta({
	layout: 'home',
	layoutBackground: 'neutral',
});

const { t: translate } = useI18n();

useSeoMeta({
	title: () => translate('legal.privacy.title'),
});
</script>

<template>
	<PrivacyPolicyPage />
</template>