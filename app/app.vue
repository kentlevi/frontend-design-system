<script setup lang="ts">
import {
    COUNTRY_TO_HTML_LANG,
    DEFAULT_COUNTRY,
    resolveSupportedCountry,
} from '~/constants/countries';

const { t, locale } = useI18n();
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
