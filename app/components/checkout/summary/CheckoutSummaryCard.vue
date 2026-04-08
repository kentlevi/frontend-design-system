<template>
	<section :class="card_classes">
		<CheckoutSummaryHeader />
		<CheckoutSummaryItems
			:tone="props.tone"
			:items="props.items"
			:format-price="props.formatPrice"
			:item-meta="props.itemMeta"
		/>

		<slot name="after-items" />

		<CheckoutSummaryFooter
			:tone="props.tone"
			:shipping-fee-tooltip-title="props.shippingFeeTooltipTitle"
			:shipping-fee-tooltip-text="props.shippingFeeTooltipText"
			:complete-label="props.completeLabel"
			:agreement-prefix="props.agreementPrefix"
			:agreement-terms="props.agreementTerms"
			:agreement-and="props.agreementAnd"
			:agreement-privacy="props.agreementPrivacy"
			:agreement-suffix="props.agreementSuffix"
			:terms-path="props.termsPath"
			:privacy-path="props.privacyPath"
			:disabled="props.disabled"
			:loading="props.loading"
			:subtotal="props.subtotal"
			:shipping-fee="props.shippingFee"
			:discount="props.discount"
			:total="props.total"
			:format-price="props.formatPrice"
		/>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CheckoutItem } from '~/types/checkout';
import CheckoutSummaryFooter from '~/components/checkout/summary/CheckoutSummaryFooter.vue';
import CheckoutSummaryHeader from '~/components/checkout/summary/CheckoutSummaryHeader.vue';
import CheckoutSummaryItems from '~/components/checkout/summary/CheckoutSummaryItems.vue';

const props = defineProps<{
	tone: 'guest' | 'member';
	items: CheckoutItem[];
	shippingFeeTooltipTitle?: string;
	shippingFeeTooltipText?: string;
	completeLabel: string;
	agreementPrefix: string;
	agreementTerms: string;
	agreementAnd: string;
	agreementPrivacy: string;
	agreementSuffix: string;
	termsPath: string;
	privacyPath: string;
	disabled?: boolean;
	loading?: boolean;
	subtotal: number;
	shippingFee: number;
	discount: number;
	total: number;
	formatPrice: (value: number) => string;
	itemMeta: (sizeLabel: string, qty: number) => string;
}>();

const card_classes = computed(() => ['checkout-summary-card', `is-${props.tone}`]);
</script>

<style scoped lang="scss">
.checkout-summary-card {
	border: 1px solid var(--gray-50);
	border-radius: 10px;
	background: var(--contrast-light);
}
</style>