<script setup lang="ts">
import TermsOfUsePage from '~/components/legal/TermsOfUsePage.vue';

definePageMeta({
	layout: 'home',
	layoutBackground: 'neutral',
});

const { t } = useI18n();

useSeoMeta({
	title: () => t('legal.terms.title'),
});
</script>

<template>
	<TermsOfUsePage />
</template>