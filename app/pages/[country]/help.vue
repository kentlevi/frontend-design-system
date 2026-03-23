<script setup lang="ts">
import { useCountry } from '~/composables/app/country/useCountry';

definePageMeta({
	layout: 'home',
});

const { withCountry } = useCountry();

await navigateTo(withCountry('/under-construction'), { redirectCode: 302 });
</script>

<template>
	<div />
</template>