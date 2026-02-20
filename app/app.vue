<script setup lang="ts">
const { t } = useI18n();
const { locale } = useI18n();

useHead(() => ({
    htmlAttrs: {
        lang: locale.value === 'kr' ? 'ko' : 'en',
    },
    title: t('home.seo.title'),
    meta: [
        {
            name: 'description',
            content: t('home.seo.description'),
        },
    ],
    link: [
        {
            rel: 'icon',
            type: 'image/svg+xml',
            href: '/logos/mark/colored/musticker.svg',
        },
        {
            rel: 'shortcut icon',
            href: '/logos/mark/colored/musticker.svg',
        },
    ],
}));
</script>

<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>
