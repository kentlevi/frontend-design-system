<script setup lang="ts">
import { useCountry } from '~/composables/app/useCountry';

const { withCountry } = useCountry();
await navigateTo(withCountry('/'));
</script>

<template>
    <div />
</template>
