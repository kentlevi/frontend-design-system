<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import { useAccountCoupons } from '~/composables/account/coupons/useAccountCoupons';

const { coupons } = useAccountCoupons();
</script>

<template>
	<MuCard
		variant="transparent"
		bordered="default"
		radius="md"
		padding="none"
		class="account-coupons-list"
		data-testid="account-coupons-list"
	>
		<FeaturesAccountCouponsContentCard
			v-for="item in coupons"
			:key="item.code"
			:item="item"
		/>
	</MuCard>
</template>

<style scoped lang="scss">
.account-coupons-list {
	overflow: hidden;
	background: var(--contrast-light);
}
</style>
