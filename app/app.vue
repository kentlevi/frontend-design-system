<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import LoginSuccessToast from '~/components/layout/LoginSuccessToast.vue';
import MuTooltip from '~/components/base/MuTooltip.vue';
import {
	COUNTRY_TO_HTML_LANG,
	DEFAULT_COUNTRY,
	resolveSupportedCountry,
} from '~/constants/countries';

const loading_overlay_store = useLoadingOverlayStore()
const toast_store = useToastStore()

const {
	is_visible: toast_visible,
	toast_title,
	toast_message,
	toast_tone,
	is_dismissible,
	toast_variant,
} = storeToRefs(toast_store)

const {
	is_visible: loader_visible,
	current_overlay
} = storeToRefs(loading_overlay_store)

const { t, locale } = useI18n();
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

		<UiToast
			:visible="toast_visible"
			:title="toast_title"
			:message="toast_message"
			:tone="toast_tone"
			:dismissible="is_dismissible"
			:variant="toast_variant"
			data-testid="global-toast"
			@close="toast_store.hideToast()"
		/>

		<UiLoadingOverlay
			:visible="loader_visible"
			:label="current_overlay.label"
			:description="current_overlay.description"
			:show-copy="current_overlay.showCopy"
			:test-id="current_overlay.testId"
			:transition-name="current_overlay.transitionName"
			:position="current_overlay.position"
			:background="current_overlay.background"
			:z-index="current_overlay.zIndex"
			:loader-width="current_overlay.loaderWidth"
			:loader-height="current_overlay.loaderHeight"
			:animation-path="current_overlay.animationPath"
		/>

		<MuTooltip />
	</NuxtLayout>
	<LoginSuccessToast />
</template>