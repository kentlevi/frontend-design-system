<template>
	<MuLinearWrapper class="no-orders" direction="column" align="center" justify="center" width="464px" :gap="24">
		<figure class="no-orders-img">
			<img
				src="/icons/custom/search/no-recent-searches.svg" alt="No recent searches"
				width="80"
				height="80"
			>
		</figure>
		<MuLinearWrapper direction="column" :gap="16">
			<MuText size="large" weight="semi-bold" align="center">
				No orders found.
			</MuText>
			<MuText align="center" color="gray-80">We couldn’t find any orders that match your filters. Double-check your selections or reset your filters to see all your orders.</MuText>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';


</script>

<style lang="scss" scoped>
.no-orders{
	padding: 146px 0 186px;
	max-width: 100%;
	margin: 0 auto;
}
</style>