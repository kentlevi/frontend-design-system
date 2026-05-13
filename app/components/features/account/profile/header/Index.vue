<script setup lang="ts">
const translate = inject<(key: string) => string>('profile:translate', (key: string) => key)
</script>

<template>
	<h1 class="account-profile-title" data-testid="account-profile-title">
		{{ translate('account.profile.title') }}
	</h1>
</template>

<style scoped lang="scss">
.account-profile-title {
	font-size: var(--type-size-450);
	font-weight: var(--font-weight-bold);
	line-height: var(--type-line-450);
	color: var(--text-primary);
	padding: 40px 0 24px;
}
</style>
