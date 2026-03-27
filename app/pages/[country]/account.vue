<script setup lang="ts">
definePageMeta({
	layout: 'home',
	footerVariant: 'compact',
});

const route = useRoute();

const active_tab = computed<
	| 'profile'
	| 'address-book'
	| 'orders'
	| 'gallery'
	| 'points'
	| 'coupons'
	| 'reviews'
	| 'quote-requests'
>(() => {
	const matched = String(route.path).match(/\/account\/([^/?#]+)/);
	const slug = matched?.[1] ?? 'profile';

	switch (slug) {
		case 'address-book':
		case 'orders':
		case 'gallery':
		case 'points':
		case 'coupons':
		case 'reviews':
		case 'quote-requests':
			return slug;
		default:
			return 'profile';
	}
});
</script>

<template>
	<AccountShell :active-tab="active_tab">
		<NuxtPage :keepalive="{ max: 8 }" />
	</AccountShell>
</template>