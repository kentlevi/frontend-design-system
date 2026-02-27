<script setup lang="ts">
import DevOnboarding from '~/components/layout/DevOnboarding.vue';
import {
    COUNTRY_TO_HTML_LANG,
    DEFAULT_COUNTRY,
    resolveSupportedCountry,
} from '~/constants/countries';

const { t, locale } = useI18n();
const isDev = import.meta.dev;
const route = useRoute();
const isGuideRoute = computed(() => /\/guide(\/|$)/i.test(route.path));
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
        <DevOnboarding v-if="isDev && !isGuideRoute" />
        <NuxtPage />
    </NuxtLayout>
</template>
