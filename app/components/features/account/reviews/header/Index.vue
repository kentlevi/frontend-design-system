<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';

const { t: translate } = useI18n();
</script>

<template>
	<MuHeading variant="4" weight="bold" class="account-reviews-title" data-testid="account-reviews-title">
		{{ translate('account.reviews.title') }}
	</MuHeading>
</template>

<style scoped lang="scss">
.account-reviews-title {
	margin: 0 0 20px;
}
</style>