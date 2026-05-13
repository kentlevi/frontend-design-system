<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import Item from './Item.vue';
import type { ApplicableCoupon } from '~/types/coupon/coupon';


defineProps<{
	modelValue: string;
	applicableCoupons: ApplicableCoupon[];
}>();

const emit = defineEmits(['update:modelValue']);
</script>

<template>
	<MuLinearWrapper class="coupon-list" direction="column" :gap="16">
		<div v-if="applicableCoupons.length === 0">
			No applicable coupons
		</div>
		<Item
			v-for="coupon in applicableCoupons"
			v-else
			:key="coupon.id"
			:model-value="modelValue"
			:coupon="coupon"
			:selected="modelValue === coupon.code"
			@update:model-value="emit('update:modelValue', $event)"
		/>
	</MuLinearWrapper>
</template>

<style lang="scss" scoped>
</style>