<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';

const translate = inject<(key: string) => string>('profile:translate', (key: string) => key)
</script>

<template>
	<MuHeading variant="4" weight="bold" class="account-profile-title" data-testid="account-profile-title">
		{{ translate('account.profile.title') }}
	</MuHeading>
</template>

<style scoped lang="scss">
.account-profile-title {
	padding: 40px 0 24px;
}
</style>
