<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import type { ApplicableCoupon } from '~/types/coupon/coupon';
import { getCouponUsageLabel } from '~/utils/coupon/format';

defineProps<{
	coupon: ApplicableCoupon;
	modelValue: string;
	selected: boolean;
}>();

defineEmits(['update:modelValue']);
</script>

<template>
	<MuCard
		class="coupon-item"
		:variant="selected ? 'subtle' : 'default'"
		:disabled="!coupon.can_use"
		@click="$emit('update:modelValue', coupon.code)"
	>
		<MuLinearWrapper justify="space-between">
			<MuLinearWrapper direction="column" :gap="8">
				<MuLinearWrapper direction="column">
					<UiRadio
						:model-value="modelValue"
						name="coupon"
						:value="coupon.code"
						class="coupon_radio"
					>
						<MuText color="abyss-40" weight="semi-bold">{{ coupon.name }}</MuText>
					</UiRadio>
					<MuHeading variant="6" weight="bold">{{ coupon.code }}</MuHeading>
				</MuLinearWrapper>
				<MuText color="abyss-40">{{ coupon.description }}</MuText>
			</MuLinearWrapper>
			<MuLinearWrapper direction="column" justify="space-between" align="center">
				<MuText v-if="coupon.valid_until" color="abyss-40" weight="semi-bold">
					Expiration: {{ coupon.valid_until }}
				</MuText>
				<UiBadge v-if="coupon.usage_limit" color="success" size="md">
					{{ getCouponUsageLabel(coupon.usage_limit) }}
				</UiBadge>
			</MuLinearWrapper>
		</MuLinearWrapper>
	</MuCard>
</template>

<style lang="scss" scoped>
.coupon-card { position: relative; }
.coupon_radio { pointer-events: none; }

</style>