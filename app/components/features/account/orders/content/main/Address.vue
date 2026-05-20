<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import type { OrderAddressType } from '~/types/order/order-address';
import { useAddress } from '~/composables/orders/useAddress';

const props = defineProps<{ type: OrderAddressType }>()

const { address, formatted_address, getPhoneNumber } = useAddress(props)
</script>

<template>
	<MuLinearWrapper direction="column" :gap="4" width="100%">
		<MuText weight="semi-bold" color="shades-black">{{ type === 'shipping' ? 'Shipping address' : 'Billing address' }}</MuText>
		<template v-if="address">
			<MuLinearWrapper align="center" justify="space-between">
				<MuText color="abyss-40">{{ $t('account.orders.receiver') }}</MuText>
				<MuText weight="semi-bold" color="abyss-40">{{ address.contact_name }}</MuText>
			</MuLinearWrapper>
			<MuLinearWrapper v-if="getPhoneNumber(address)" align="center" justify="space-between">
				<MuText color="abyss-40">Contact Number:</MuText>
				<MuText weight="semi-bold" color="abyss-40">{{ getPhoneNumber(address) }}</MuText>
			</MuLinearWrapper>
			<MuLinearWrapper align="flex-start" justify="space-between" :gap="16">
				<MuText color="abyss-40">Address:</MuText>
				<MuText weight="semi-bold" color="abyss-40" align="right">{{ formatted_address }}</MuText>
			</MuLinearWrapper>
			<MuLinearWrapper v-if="address.company" align="center" justify="space-between">
				<MuText color="abyss-40">Company:</MuText>
				<MuText weight="semi-bold" color="abyss-40">{{ address.company }}</MuText>
			</MuLinearWrapper>
		</template>
	</MuLinearWrapper>
</template>

<style lang="scss" scoped></style>