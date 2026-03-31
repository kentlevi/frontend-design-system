<script setup lang="ts">
type AccountTab =
	| 'profile'
	| 'address-book'
	| 'orders'
	| 'gallery'
	| 'points'
	| 'coupons'
	| 'reviews'
	| 'quote-requests';

defineProps<{
	activeTab: AccountTab;
	embedded?: boolean;
}>();
</script>

<template>
	<AccountShell v-if="!embedded" :active-tab="activeTab">
		<slot />
	</AccountShell>
	<div v-else class="account-shell-section">
		<slot />
	</div>
</template>

<style scoped lang="scss">
.account-shell-section {
	display: contents;
}
</style>