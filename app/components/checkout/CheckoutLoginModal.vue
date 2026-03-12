<script setup lang="ts">
import AuthLoginCard from '~/components/auth/login/AuthLoginCard.vue';

const props = defineProps<{
	modelValue: boolean;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();
</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		width="588px"
		padding="0"
		gap="0"
		modal-class="checkout-login-modal-shell"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<AuthLoginCard
			:skip-member-redirect="true"
			:show-close-button="true"
			@member-login-success="emit('update:modelValue', false)"
			@close="emit('update:modelValue', false)"
		/>
	</UiModal>
</template>

<style lang="scss">
.ui-modal.checkout-login-modal-shell {
	background: transparent;
	border: 0;
	box-shadow: none;
	padding: 0;
	gap: 0;
	width: min(588px, calc(100vw - 32px));
}
</style>