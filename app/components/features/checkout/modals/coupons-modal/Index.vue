<template>
	<UiModal
		:model-value="props.modelValue"
		title="Coupons"
		align="top"
		width="708px"
		padding="0"
		gap="0"
		modal-class="coupons-modal"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<MuLinearWrapper class="coupons-modal-body" direction="column" overflow-y="auto" :gap="16">
			<MuText>Please select a coupon you’d like to apply to your order.</MuText>
			<List/>
		</MuLinearWrapper>

		<template #footer>
			<MuLinearWrapper justify="space-between" align="center" width="100%">
				<UiButton variant="ghost" tone="neutral">Proceed Without Coupon</UiButton>
				<MuLinearWrapper :gap="16">
					<UiButton variant="ghost" tone="neutral">Cancel</UiButton>
					<UiButton tone="neutral">Save</UiButton>
				</MuLinearWrapper>
			</MuLinearWrapper>
		</template>
	</UiModal>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import List from './List.vue';

const props = defineProps<{
	modelValue: boolean;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();
</script>

<style lang="scss" scoped>
.coupons-modal-body{
	padding: 24px;
}
</style>