<script setup lang="ts">
import TermsOfUsePage from '~/components/legal/TermsOfUsePage.vue';

definePageMeta({
	layout: 'home',
	layoutBackground: 'neutral',
});

const { t: translate } = useI18n();

useSeoMeta({
	title: () => translate('legal.terms.title'),
});
</script>

<template>
	<TermsOfUsePage />
</template>