<script setup lang="ts">
import {
    COUNTRY_TO_HTML_LANG,
    DEFAULT_COUNTRY,
    resolveSupportedCountry,
} from '~/constants/countries';

const { locale } = useI18n();
const resolvedLocaleCountry = computed(
    () => resolveSupportedCountry(String(locale.value)) || DEFAULT_COUNTRY
);
const htmlLang = computed(
    () => COUNTRY_TO_HTML_LANG[resolvedLocaleCountry.value]
);

useHead(() => ({
    htmlAttrs: {
        lang: htmlLang.value,
    },
    title: 'MuSticker Frontend Documentation',
    meta: [
        {
            name: 'description',
            content: 'Design system, guide pages, UI primitives, and implementation standards for the MuSticker storefront.',
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
