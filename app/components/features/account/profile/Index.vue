<script setup lang="ts">
import { useProfileIndex } from '~/composables/account/profile/useProfileIndex';

const {
	translate,
	is_fetching_fields,
} = useProfileIndex()

provide('profile:translate', translate)
</script>

<template>
	<section class="account-page" data-testid="account-profile-page">
		<FeaturesAccountProfileHeader />
		<FeaturesAccountProfileContent :loading="is_fetching_fields" />
	</section>
</template>

<style scoped lang="scss">
.account-page {
	background: var(--bg-page);
	min-height: calc(100vh - 176px);
	position: relative;
}

:global(.ui-toast.account-profile-photo-toast) {
	background: #ff3131;
	color: var(--contrast-light);
	border: 2px solid var(--white-base);

	.ui-toast-text {
		display: inline-flex;
		align-items: center;
		gap: 0;
	}

	.ui-toast-close {
		color: inherit;
	}
}

:global(.account-profile-photo-toast-title) {
	font-weight: var(--font-weight-bold);
}
</style>