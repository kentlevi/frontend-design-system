<script setup lang="ts">
import {
    COUNTRY_TO_HTML_LANG,
    DEFAULT_COUNTRY,
    resolveSupportedCountry,
} from '~/constants/countries';

const { locale } = useI18n();
const resolved_locale_country = computed(
    () => resolveSupportedCountry(String(locale.value)) || DEFAULT_COUNTRY
);
const html_lang = computed(
    () => COUNTRY_TO_HTML_LANG[resolved_locale_country.value]
);

useHead(() => ({
    htmlAttrs: {
        lang: html_lang.value,
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
