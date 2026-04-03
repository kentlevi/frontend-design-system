<script setup lang="ts">
import CheckoutAddressSelectModal from '~/components/checkout/shared/CheckoutAddressSelectModal.vue';
import type { MemberDropShippingAddress } from '~/types/checkout';

const props = defineProps<{
	modelValue: boolean;
	addresses: MemberDropShippingAddress[];
	selectedAddressId: string;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'select', value: string): void;
}>();
</script>

<template>
	<CheckoutAddressSelectModal
		:model-value="props.modelValue"
		:addresses="props.addresses"
		:selected-address-id="props.selectedAddressId"
		title="Select Drop Shipping Address"
		variant="drop-shipping"
		confirm-label="Select Address"
		@update:model-value="emit('update:modelValue', $event)"
		@select="emit('select', $event)"
	/>
</template>