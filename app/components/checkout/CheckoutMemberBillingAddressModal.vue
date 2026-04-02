<script setup lang="ts">
import CheckoutAddressSelectModal from '~/components/checkout/shared/CheckoutAddressSelectModal.vue';
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
		title="Select Billing Address"
		copy="Please select the billing address you'd like us to use for this order."
		variant="billing"
		confirm-label="Select Address"
		@update:model-value="emit('update:modelValue', $event)"
		@select="emit('select', $event)"
	/>
</template>