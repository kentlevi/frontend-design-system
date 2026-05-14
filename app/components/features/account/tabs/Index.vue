<template>
	<MuTabs :model-value="active_tab" data-testid="account-shell-tabs">
		<MuTab
			v-for="tab in tabs"
			:key="tab.key"
			:value="tab.key"
			:to="withCountry(tab.to)"
			:data-testid="`account-shell-tab-${tab.key}`"
		>
			<UiIcon :name="tab.icon" :size="24" />
			<span class="m-tab-label">{{ tab.label }}</span>
		</MuTab>
	</MuTabs>
</template>

<script setup lang="ts">
import MuTab from '~/components/core/tab/MuTab.vue';
import MuTabs from '~/components/core/tab/MuTabs.vue';
import { useCountry } from '~/composables/app/country/useCountry';

const { t: translate } = useI18n();
const { withCountry } = useCountry();
const route = useRoute();

const tabs = [
	{ key: 'profile', label: translate('layout.header.accountLinks.profile'), to: '/account/profile', icon: 'regular-user' },
	{ key: 'address-book', label: translate('layout.header.accountLinks.addressBook'), to: '/account/address-book', icon: 'regular-home' },
	{ key: 'orders', label: translate('layout.header.accountLinks.orders'), to: '/account/orders', icon: 'regular-boxes' },
	{ key: 'gallery', label: translate('layout.header.accountLinks.gallery'), to: '/account/gallery', icon: 'regular-image' },
	{ key: 'points', label: translate('layout.header.accountLinks.points'), to: '/account/points', icon: 'regular-star' },
	{ key: 'coupons', label: translate('layout.header.accountLinks.coupons'), to: '/account/coupons', icon: 'regular-ticket' },
	{ key: 'reviews', label: translate('layout.header.accountLinks.reviews'), to: '/account/reviews', icon: 'regular-comments' },
	{ key: 'quote-requests', label: translate('layout.header.accountLinks.quoteRequest'), to: '/account/quote-requests', icon: 'regular-file-details' },
] as const;

const active_tab = computed(() => {
	const matched = String(route.path).match(/\/account\/([^/?#]+)/);
	const slug = matched?.[1] ?? 'profile';
	return tabs.some(tab => tab.key === slug) ? slug : 'profile';
});
</script>