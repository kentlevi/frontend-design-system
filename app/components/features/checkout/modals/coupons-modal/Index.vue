<script setup lang="ts">
import { ref, watch } from 'vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import List from './List.vue';
import type { ApplicableCoupon } from '~/types/coupon/coupon';

const props = defineProps<{
	modelValue: boolean;
	code: string;
	apply: () => Promise<void>;
	removeCoupon: () => void;
	applicableCoupons: ApplicableCoupon[];
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'update:code', value: string): void;
}>();

const selected_code = ref(props.code);

watch(() => props.modelValue, (isOpen) => {
	if (isOpen) selected_code.value = props.code;
});

const handleRemove = () => {
	props.removeCoupon();
	emit('update:modelValue', false);
};

const handleSave = () => {
	emit('update:modelValue', false);
	emit('update:code', selected_code.value);
	props.apply();
};
</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		title="Coupons"
		align="center"
		width="708px"
		padding="0"
		gap="0"
		modal-class="coupons-modal"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<MuLinearWrapper class="coupons-modal-body" direction="column" overflow-y="auto" :gap="16">
			<MuText>Please select a coupon you’d like to apply to your order.</MuText>
			<List v-model="selected_code" :applicable-coupons="props.applicableCoupons" />
		</MuLinearWrapper>

		<template #footer>
			<MuLinearWrapper justify="space-between" align="center" width="100%">
				<UiButton
					variant="ghost"
					tone="neutral"
					@click="handleRemove"
				>
					Proceed Without Coupon
				</UiButton>
				<MuLinearWrapper :gap="16">
					<UiButton variant="ghost" tone="neutral" @click="emit('update:modelValue', false)">Cancel</UiButton>
					<UiButton
						tone="neutral"
						:disabled="!selected_code"
						@click="handleSave"
					>
						Save
					</UiButton>
				</MuLinearWrapper>
			</MuLinearWrapper>
		</template>
	</UiModal>
</template>

<style lang="scss" scoped>
.coupons-modal-body{
	padding: 24px;
}
</style>