<script setup lang="ts">
import CheckoutAddressSelectModal from '~/components/checkout/modals/CheckoutAddressSelectModal.vue';

const props = defineProps<{
	modelValue: Ref<boolean>;
	selectedAddressId: string;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'select', value: string): void;
}>();

const { t } = useI18n();
</script>

<template>
	<CheckoutAddressSelectModal
		:model-value="props.modelValue"
		:addresses="props.addresses"
		:selected-address-id="props.selectedAddressId"
		:title="t('checkout.member.addressSelection.dropTitle')"
		variant="drop-shipping"
		:confirm-label="t('checkout.member.addressSelection.selectAddress')"
		@update:model-value="emit('update:modelValue', $event)"
		@select="emit('select', $event)"
	/>
</template>