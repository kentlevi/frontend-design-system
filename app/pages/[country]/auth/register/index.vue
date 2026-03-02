<script setup lang="ts">
import AuthRegisterPage from '~/components/auth/register/AuthRegisterPage.vue';

definePageMeta({
    layout: 'home',
    middleware: ['guest-only'],
});
</script>

<template>
    <AuthRegisterPage />
</template>
