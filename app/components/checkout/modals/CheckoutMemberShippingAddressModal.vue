<script setup lang="ts">
import CheckoutAddressSelectModal from '~/components/checkout/modals/CheckoutAddressSelectModal.vue';
import type { MemberAddress } from '~/types/checkout';

const props = defineProps<{
	modelValue: boolean;
	addresses: MemberAddress[];
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
		title="Select Shipping Address"
		copy="Please select the address where you'd like us to deliver your order."
		variant="shipping"
		confirm-label="Select Address"
		@update:model-value="emit('update:modelValue', $event)"
		@select="emit('select', $event)"
	/>
</template>