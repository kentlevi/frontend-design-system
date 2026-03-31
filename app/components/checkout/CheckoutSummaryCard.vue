<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useCountry } from '~/composables/app/country/useCountry';
import { useCheckoutFlow } from '~/composables/checkout/useCheckoutFlow';
import { useTossPayment } from '~/composables/payments/toss-pay/useTossPayment';
type SummaryItem = {
	id: string;
	product: {
		name: string;
		image: string;
	};
	sizeLabel: string;
	qty: number;
	total: number;
	artworkPreviewUrl: string;
};

const props = defineProps<{
	tone: 'guest' | 'member';
	title: string;
	items: SummaryItem[];
	subtotalLabel: string;
	shippingFeeLabel: string;
	shippingFeeTooltipTitle?: string;
	shippingFeeTooltipText?: string;
	discountsLabel: string;
	totalLabel: string;
	subtotalValue: string;
	shippingFeeValue: string;
	discountValue: string;
	totalValue: string;
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
	sizeDimOnly: (value: string) => string;
	formatPrice: (value: number) => string;
	itemMeta: (sizeLabel: string, qty: number) => string;
}>();

const { withCountry } = useCountry();

const shipping_fee_tooltip_open = ref(false);
const shipping_fee_tooltip_ref = ref<HTMLElement | null>(null);
const has_shipping_fee_tooltip = computed(() =>
	Boolean(props.shippingFeeTooltipTitle && props.shippingFeeTooltipText)
);

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

function goToCart() {
	void navigateTo(withCountry('/cart'));
}

function goToInvoice() {
	void navigateTo(withCountry('/checkout/invoice'));
}

const {
	submitCheckout
} = useCheckoutFlow()

const {
	listenPaymentResult
} = useTossPayment()

onMounted(() => {
	/** For toss payment integration */
	const cleanup = listenPaymentResult()
	onUnmounted(() => {
		cleanup()
	})

	window.addEventListener('pointerdown', handleShippingFeeTooltipPointerDown, true);
	window.addEventListener('keydown', handleShippingFeeTooltipEscape);
})

onBeforeUnmount(() => {
	window.removeEventListener('pointerdown', handleShippingFeeTooltipPointerDown, true);
	window.removeEventListener('keydown', handleShippingFeeTooltipEscape);
});
</script>

<template>
	<section :class="[`checkout-summary-card`, `is-${props.tone}`]">
		<div class="checkout-summary-title">
			<span>{{ props.title }}</span>
			<div class="checkout-summary-title-actions">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="sm"
					:no-hover="true"
					class="checkout-summary-title-action"
					aria-label="Edit order summary"
					@click="goToCart"
				>
					<UiIcon name="regular-edit" size="24px" color="var(--text-primary)" decorative />
				</UiButton>
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="sm"
					:no-hover="true"
					class="checkout-summary-title-action"
					aria-label="Print order summary"
					@click="goToInvoice"
				>
					<UiIcon name="regular-print" size="24px" color="var(--text-primary)" decorative />
				</UiButton>
			</div>
		</div>

		<div class="checkout-summary-list">
			<template v-if="props.items.length > 0">
				<div
					v-for="item in props.items"
					:key="item.id"
					class="checkout-summary-item"
				>
					<div class="checkout-summary-thumb">
						<img
							:src="item.artworkPreviewUrl || item.product.image"
							:alt="item.product.name"
							class="checkout-summary-thumb-image"
						>
					</div>
					<div class="checkout-summary-info">
						<div class="checkout-summary-name">{{ item.product.name }}</div>
						<div class="checkout-summary-meta">
							{{ props.itemMeta(item.sizeLabel, item.qty) }}
						</div>
					</div>
					<div class="checkout-summary-price">{{ props.formatPrice(item.total) }}</div>
				</div>
			</template>
			<div v-else class="checkout-summary-skeleton" aria-hidden="true">
				<div v-for="n in 1" :key="n" class="checkout-summary-item is-skeleton">
					<div class="checkout-summary-thumb skeleton-block" />
					<div class="checkout-summary-info">
						<div class="checkout-summary-skeleton-line checkout-summary-skeleton-line--name" />
						<div class="checkout-summary-skeleton-line checkout-summary-skeleton-line--meta" />
					</div>
					<div class="checkout-summary-skeleton-line checkout-summary-skeleton-line--price" />
				</div>
			</div>
		</div>

		<slot name="after-items" />

		<div class="checkout-summary-footer">
			<div class="checkout-summary-lines">
				<div class="checkout-summary-line">
					<div class="checkout-summary-line-label">{{ props.subtotalLabel }}</div>
					<div class="checkout-summary-line-value">{{ props.subtotalValue }}</div>
				</div>
				<div class="checkout-summary-line">
					<div ref="shipping_fee_tooltip_ref" class="checkout-summary-line-label checkout-summary-line-label--with-tooltip">
						<span>{{ props.shippingFeeLabel }}</span>
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
									aria-label="Show shipping fee information"
									@click="toggleShippingFeeTooltip"
								>
									<UiIcon
										:name="shipping_fee_tooltip_open ? 'strong-question-circle' : 'regular-question-circle'"
										size="20"
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
					<div class="checkout-summary-line-value">{{ props.shippingFeeValue }}</div>
				</div>
				<div class="checkout-summary-line">
					<div class="checkout-summary-line-label">{{ props.discountsLabel }}</div>
					<div class="checkout-summary-line-value is-discount">{{ props.discountValue }}</div>
				</div>
				<div class="checkout-summary-line is-total">
					<div class="checkout-summary-line-label">{{ props.totalLabel }}</div>
					<div class="checkout-summary-line-value">{{ props.totalValue }}</div>
				</div>
			</div>

			<UiButton
				variant="filled"
				tone="neutral"
				size="lg"
				class="checkout-summary-submit"
				:disabled="props.disabled || props.loading"
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
	</section>
</template>

<style scoped lang="scss">
.checkout-summary-card {
	border: 1px solid var(--gray-50);
	border-radius: 10px;
	background: var(--contrast-light);

	.checkout-summary-title {

		padding: 12px 24px;
		border-bottom: 1px solid var(--gray-50);
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);

			.checkout-summary-title-actions {
				display: inline-flex;
				align-items: center;
				gap: 12px;

				.checkout-summary-title-action {
					width: 32px;
					height: 32px;
					padding: 4px;
					min-height: auto;
					color: var(--text-primary);
					display: inline-flex;
					align-items: center;
					justify-content: center;
					box-shadow: none;
					&:hover {
						background: var(--gray-20);
						border-radius: var(--radius-md);
					}
				}
			}
		}

	.checkout-summary-list {
		max-height: 360px;
		overflow: auto;

		.checkout-summary-item {
			display: grid;
			grid-template-columns: 46px 1fr auto;
			align-items: center;
			gap: 12px;
			padding: 16px 18px;
			border-bottom: 1px solid var(--gray-50);

			.checkout-summary-thumb {
				width: 40px;
				height: 40px;
				border-radius: 8px;
				background: var(--gray-20);
				overflow: hidden;
				display: grid;
				place-items: center;

				&.skeleton-block {
					border-radius: 8px;
					background: linear-gradient(90deg, var(--gray-20) 25%, var(--gray-40) 37%, var(--gray-20) 63%);
					background-size: 400% 100%;
					animation: checkout-summary-skeleton-shimmer 1.4s ease-in-out infinite;
				}

				.checkout-summary-thumb-image {
					width: 26px;
					height: 26px;
					object-fit: contain;
				}
			}

			.checkout-summary-info {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				height: 100%;
				.checkout-summary-name {

					color: var(--text-primary);
					font-size: var(--type-size-100);
					font-weight: var(--font-weight-bold);
					line-height: var(--type-line-100);
				}

				.checkout-summary-meta {

					color: var(--text-secondary);
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
				}
			}

			.checkout-summary-price {
				font-size: var(--type-size-200);
				font-weight: var(--font-weight-bold);
				line-height: var(--type-line-200);
				color: var(--text-primary);
			}

			.checkout-summary-skeleton-line {
				border-radius: 8px;
				background: linear-gradient(90deg, var(--gray-20) 25%, var(--gray-40) 37%, var(--gray-20) 63%);
				background-size: 400% 100%;
				animation: checkout-summary-skeleton-shimmer 1.4s ease-in-out infinite;

				&.checkout-summary-skeleton-line--name {
					width: 132px;
					height: 20px;
				}

				&.checkout-summary-skeleton-line--meta {
					width: 96px;
					height: 12px;
				}

				&.checkout-summary-skeleton-line--price {
					width: 58px;
					height: 14px;
					justify-self: end;
				}
			}
		}
	}

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
	}

	&.is-member {
		.checkout-summary-list {
			.checkout-summary-item {
				grid-template-columns: 40px 1fr auto;
				padding: 16px 24px;
				border-bottom-color: var(--gray-40);

				.checkout-summary-thumb {
					width: 40px;
					height: 40px;
					border-radius: 12px;

					.checkout-summary-thumb-image {
						width: 24px;
						height: 24px;
					}
				}
			}
		}

		.checkout-summary-footer {
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
}

.checkout-summary-tooltip {
	display: inline-flex;
	align-items: center;
	align-self: center;
	line-height: 1;
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
	font-size: 14px;
	line-height: 24px;
	font-weight: var(--font-weight-semibold);
	color: inherit;
}

.checkout-summary-tooltip-text {
	font-size: 14px;
	line-height: 24px;
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

@keyframes checkout-summary-skeleton-shimmer {
	0% {
		background-position: 100% 0;
	}

	100% {
		background-position: 0 0;
	}
}
</style>