<template>
	<MuLinearWrapper class="orders-no-content" direction="column" :gap="40">
		<MuLinearWrapper direction="column" :gap="16" align="center">
			<MuHeading variant="3" weight="semi-bold">No orders yet.</MuHeading>
			<MuText size="small" align="center" color="gray-80">
				Looks like you haven’t placed any orders yet. Start browsing our products and create your first order. <br> You can also explore recommended products below to get started quickly.
			</MuText>
		</MuLinearWrapper>
		<MuLinearWrapper justify="space-between" :gap="24">
			<Products
				v-for="item in homeProductTypes"
				:key="item.key"
				:to="withCountry(item.to)"
				class="home-types-item"
				:data-testid="`home-product-type-${item.key}`"
				:item="item"
			/>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

import Products from './Products.vue';
import { homeProductTypes } from '~/data/products/homeTypes';
import { useCountry } from '@/composables/app/country/useCountry';
const { withCountry } = useCountry();

</script>

<style lang="scss" scoped>

</style>