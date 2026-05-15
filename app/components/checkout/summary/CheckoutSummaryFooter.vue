<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCheckoutFlow } from '~/composables/checkout/main/useCheckoutFlow';
import { useCheckoutSummaryFlow } from '~/composables/checkout/summary/useCheckoutSummaryFlow';
import { useTossPayment } from '~/composables/payments/toss-pay/useTossPayment';
import { useProductionShippingStore } from '~/stores/production-shipping/production-shipping.store';
import { useMainCheckOutStore } from '~/stores/checkout/index.store';
import { formatPrice } from '~/utils/currency/formatPrice';

const props = defineProps<{
	tone: 'guest' | 'member';
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
}>();

const { t: translate } = useI18n();

const shipping_fee_tooltip_open = ref(false);
const shipping_fee_tooltip_ref = ref<HTMLElement | null>(null);
const has_shipping_fee_tooltip = computed(() =>
	Boolean(props.shippingFeeTooltipTitle && props.shippingFeeTooltipText)
);
const footer_classes = computed(() => ['checkout-summary-footer', `is-${props.tone}`]);
const summary_key_base = computed(() => `checkout.${props.tone}.summary`);

const is_mounted = ref<boolean>(false)

const {
	is_processing,
	submitCheckout,
} = useCheckoutFlow();

const {
	total_cost,
	total_discount,
	sub_total_cost,
	shipping_cost,
} = useCheckoutSummaryFlow();

const { is_loaded: shipping_loaded } = storeToRefs(useProductionShippingStore());
const { selected_payment_method } = storeToRefs(useMainCheckOutStore());

// Submit is disabled while the page is still pulling required data
// (shipping + payment method) and while a payment is in flight.
const is_submit_disabled = computed(() =>
	!is_mounted.value
	|| is_processing.value
	|| !shipping_loaded.value
	|| !selected_payment_method.value
);

const { listenPaymentResult } = useTossPayment();
let cleanup_payment_result_listener: (() => void) | null = null;

function toggleShippingFeeTooltip() {
	if (!has_shipping_fee_tooltip.value) return;
	shipping_fee_tooltip_open.value = !shipping_fee_tooltip_open.value;
}

function closeShippingFeeTooltip() {
	shipping_fee_tooltip_open.value = false;
}

function handleShippingFeeTooltipPointerDown(event: PointerEvent) {
	const target = event.target as Node | null;
	if (!target) return;
	if (shipping_fee_tooltip_ref.value?.contains(target)) return;
	closeShippingFeeTooltip();
}

function handleShippingFeeTooltipEscape(event: KeyboardEvent) {
	if (event.key !== 'Escape') return;
	closeShippingFeeTooltip();
}

onMounted(() => {
	is_mounted.value = true
	cleanup_payment_result_listener = listenPaymentResult();
	window.addEventListener('pointerdown', handleShippingFeeTooltipPointerDown, true);
	window.addEventListener('keydown', handleShippingFeeTooltipEscape);
});

onBeforeUnmount(() => {
	is_mounted.value = false
	cleanup_payment_result_listener?.();
	window.removeEventListener('pointerdown', handleShippingFeeTooltipPointerDown, true);
	window.removeEventListener('keydown', handleShippingFeeTooltipEscape);
});
</script>

<template>
	<div :class="footer_classes">
		<div class="checkout-summary-lines">
			<div class="checkout-summary-line">
				<div class="checkout-summary-line-label">{{ translate(`${summary_key_base}.subtotal`) }}</div>
				<div class="checkout-summary-line-value">
					<span v-if="is_mounted">
						{{ formatPrice(sub_total_cost) }}
					</span>
					<UiSkeleton v-else :height="14" :width="64" />
				</div>
			</div>
			<div class="checkout-summary-line">
				<div ref="shipping_fee_tooltip_ref" class="checkout-summary-line-label checkout-summary-line-label--with-tooltip">
					<span>{{ translate(`${summary_key_base}.shippingFee`) }}</span>
					<UiTooltip
						v-if="has_shipping_fee_tooltip"
						:open="shipping_fee_tooltip_open"
						side="right"
						align="center"
						mobile-side="bottom"
						tone="neutral"
						:offset="10"
						:slide-distance="24"
						role="dialog"
						content-class="checkout-summary-tooltip-content"
						class="checkout-summary-tooltip"
					>
						<template #trigger>
							<button
								type="button"
								class="checkout-summary-tooltip-trigger"
								:class="{ 'is-active': shipping_fee_tooltip_open }"
								:aria-expanded="shipping_fee_tooltip_open"
								aria-haspopup="dialog"
								:aria-label="translate(`${summary_key_base}.shippingFeeInfoAria`)"
								@click="toggleShippingFeeTooltip"
							>
								<UiIcon
									:name="shipping_fee_tooltip_open ? 'strong-question-circle' : 'regular-question-circle'"
									size="24"
									color="var(--gray-90)"
									decorative
								/>
							</button>
						</template>

						<div class="checkout-summary-tooltip-copy">
							<strong class="checkout-summary-tooltip-title">{{ props.shippingFeeTooltipTitle }}</strong>
							<p class="checkout-summary-tooltip-text">{{ props.shippingFeeTooltipText }}</p>
						</div>
					</UiTooltip>
				</div>
				<div class="checkout-summary-line-value">
					<span v-if="is_mounted && shipping_loaded">
						{{ formatPrice(shipping_cost) }}
					</span>
					<UiSkeleton v-else :height="14" :width="64" />
				</div>
			</div>
			<div class="checkout-summary-line">
				<div class="checkout-summary-line-label">{{ translate(`${summary_key_base}.discounts`) }}</div>
				<div class="checkout-summary-line-value is-discount">
					<span v-if="is_mounted">
						-{{ formatPrice(total_discount) }}
					</span>
					<UiSkeleton v-else :height="14" :width="64" />
				</div>
			</div>
			<div class="checkout-summary-line is-total">
				<div class="checkout-summary-line-label">{{ translate(`${summary_key_base}.total`) }}</div>
				<div class="checkout-summary-line-value">
					<span v-if="is_mounted && shipping_loaded">
						{{ formatPrice(total_cost) }}
					</span>
					<UiSkeleton v-else :height="22" :width="110" />
				</div>
			</div>
		</div>

		<UiButton
			variant="filled"
			tone="neutral"
			size="lg"
			class="checkout-summary-submit"
			:disabled="is_submit_disabled"
			@click="submitCheckout"
		>
			{{ props.completeLabel }}
		</UiButton>

		<div class="checkout-summary-agreement">
			<span class="checkout-summary-agreement-text">{{ props.agreementPrefix }}</span>
			<NuxtLink :to="props.termsPath" class="checkout-summary-agreement-link">{{ props.agreementTerms }}</NuxtLink>
			<span class="checkout-summary-agreement-text">{{ props.agreementAnd }}</span>
			<NuxtLink :to="props.privacyPath" class="checkout-summary-agreement-link">{{ props.agreementPrivacy }}</NuxtLink>
			<span class="checkout-summary-agreement-text">{{ props.agreementSuffix }}</span>
		</div>
	</div>
</template>

<style scoped lang="scss">
.checkout-summary-footer {
	padding: 16px 24px 24px;

	.checkout-summary-lines {
		display: flex;
		flex-direction: column;
		gap: 4px;

		.checkout-summary-line {
			display: flex;
			align-items: center;
			justify-content: space-between;
			color: var(--text-secondary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);

			.checkout-summary-line-label--with-tooltip {
				display: inline-flex;
				align-items: center;
				gap: 4px;
			}

			.checkout-summary-line-value {
				color: var(--text-primary);
				font-weight: var(--font-weight-semibold);

				&.is-discount {
					color: var(--error);
				}
			}

			&.is-total {
				color: var(--text-primary);
				font-weight: var(--font-weight-bold);

				.checkout-summary-line-value {
					font-size: var(--type-size-400);
					line-height: var(--type-line-400);
					font-weight: var(--font-weight-bold);
				}
			}
		}
	}

	.checkout-summary-submit {
		width: 100%;
		margin-top: 16px;
		border-radius: 16px;
		box-shadow: none;
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
	}

	.checkout-summary-agreement {
		margin-top: 10px;
		text-align: center;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		color: var(--text-primary);

		.checkout-summary-agreement-link {
			color: var(--text-primary);
			font-weight: var(--font-weight-semibold);
			text-decoration: underline;
			margin-inline: 2px;
		}
	}
	&.is-member {
		.checkout-summary-lines {
			.checkout-summary-line {
				&.is-total {
					.checkout-summary-line-value {
						font-size: var(--type-size-400);
						line-height: var(--type-line-400);
					}
				}
			}
		}
	}
}

.checkout-summary-tooltip {
	display: inline-flex;
	align-items: center;
	align-self: center;
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
}

.checkout-summary-tooltip-trigger {
	border: 0;
	padding: 0;
	width: 20px;
	height: 20px;
	background: transparent;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border-radius: 999px;
	transition: transform 0.16s ease;

	&:active {
		transform: scale(0.96);
	}
}

:deep(.checkout-summary-tooltip-content) {
	width: min(420px, calc(100vw - 32px));
	max-width: calc(100vw - 32px);
	display: flex;
	align-items: flex-start;
	padding: 16px 20px;
	border-radius: 12px;
	white-space: normal;
	box-shadow: 0 10px 28px rgba(15, 23, 42, 0.24);
}

.checkout-summary-tooltip-copy {
	display: grid;
	gap: 10px;
}

.checkout-summary-tooltip-title {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-semibold);
	color: inherit;
}

.checkout-summary-tooltip-text {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-regular);
	color: inherit;
}

@media (max-width: 760px) {
	:deep(.checkout-summary-tooltip-content) {
		width: min(320px, calc(100vw - 32px));
	}

	.checkout-summary-tooltip-title,
	.checkout-summary-tooltip-text {
		line-height: 20px;
	}
}
</style>