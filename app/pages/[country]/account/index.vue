<script setup lang="ts">
import { useCountry } from '~/composables/app/useCountry';

const { withCountry } = useCountry();
await navigateTo(withCountry('/account/profile'), { redirectCode: 302 });
</script>

<template>
    <div data-testid="account-index-redirect" />
</template>
