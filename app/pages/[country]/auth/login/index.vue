<script setup lang="ts">
definePageMeta({
    layout: 'home',
    middleware: ['guest-only'],
});
</script>

<template>
    <AuthLoginPage />
</template>
