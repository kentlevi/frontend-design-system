<script setup lang="ts">
const localePath = useLocalePath();
await navigateTo(localePath('/account/profile'), { redirectCode: 302 });
</script>

<template>
    <div data-testid="account-index-redirect" />
</template>
