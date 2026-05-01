<script setup lang="ts">
import { useCheckoutFeatureTransition } from '~/composables/checkout/features/useCheckoutFeatureTransition';
import { useCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext';
import { useHeightTransition } from '~/composables/checkout/shared/useHeightTransition';
import { usePaymentMethod } from '~/composables/payments/usePaymentMethod';
import { useMainCheckOutStore } from '~/stores/checkout/index.store';

const {
	t,
	payment_brands,
	is_accredited_banks_modal_open,
} = useCheckoutExperienceFeatureContext();

const payment_meta_swap_wrapper_ref = ref<HTMLElement | null>(null);

const {
	enter_duration_ms,
	leave_duration_ms,
	beforeEnter,
	enter,
	afterEnter,
	beforeLeave,
	leave,
	afterLeave,
} = useCheckoutFeatureTransition();

const {
	available_payment_methods,
	getAvailablePaymentMethod
} = usePaymentMethod()

const {
	selected_payment_method
} = storeToRefs(useMainCheckOutStore())

useHeightTransition(
	payment_meta_swap_wrapper_ref,
	selected_payment_method,
	() =>
		selected_payment_method.value?.code === 'CC_TOSS'
			? '[data-payment-panel="credit-card"]'
			: selected_payment_method.value?.code === 'BT_TOSS'
				? '[data-payment-panel="bank-transfer"]'
				: null,
	{ enterDurationMs: enter_duration_ms, leaveDurationMs: leave_duration_ms }
);

onMounted(async()=>{
	await getAvailablePaymentMethod()
})
</script>

<template>
	<div class="checkout-member-payment-group">
		<div class="checkout-member-card-grid checkout-member-card-grid--payments">
			<button
				v-for="method in available_payment_methods"
				:key="method.id"
				type="button"
				class="checkout-member-choice-card checkout-member-choice-card--payment"
				:class="{ 'is-active': selected_payment_method === method }"
				@click="selected_payment_method = method"
			>
				<img :src="`/icons/custom/checkout/${method.logo}`" :alt="method.name" class="checkout-member-choice-icon">
				<div class="checkout-member-choice-title">{{ method.name }}</div>
			</button>
		</div>

		<div ref="payment_meta_swap_wrapper_ref" class="checkout-member-payment-meta-swap-wrap">
			<Transition
				@before-enter="beforeEnter"
				@enter="enter"
				@after-enter="afterEnter"
				@before-leave="beforeLeave"
				@leave="leave"
				@after-leave="afterLeave"
			>
				<div v-if="selected_payment_method?.code === 'CC_TOSS'" data-payment-panel="credit-card" class="checkout-member-payment-meta-panel">
					<div class="checkout-member-payment-meta-block">
						<div class="checkout-member-payment-meta">
							<button
								type="button"
								class="checkout-member-subnote-button"
								@click="is_accredited_banks_modal_open = true"
							>
								{{ t('checkout.member.paymentMeta.accreditedBanks') }}
							</button>
							<div class="checkout-member-payment-brands">
								<div v-for="brand in payment_brands" :key="brand.key" class="checkout-member-payment-brand">
									<img :src="brand.icon" :alt="brand.label" class="checkout-member-payment-brand-icon">
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-else-if="selected_payment_method?.code === 'BT_TOSS'" data-payment-panel="bank-transfer" class="checkout-member-payment-meta-panel">
					<div class="checkout-member-payment-meta-block">
						<div class="checkout-member-payment-transfer-meta">
							<div class="checkout-member-payment-transfer-note">
								{{ t('checkout.member.paymentMeta.bankTransferNote') }}
							</div>
							<div class="checkout-member-payment-transfer-brand">
								<img
									src="/icons/custom/payment-methods/bank-logos/hana-bank-full.svg"
									alt="Hana Bank"
									class="checkout-member-payment-transfer-brand-icon"
								>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>

<style scoped lang="scss">
.checkout-member-payment-group,
.checkout-member-field-stack,
.checkout-member-field-grid {
	display: grid;
	gap: 14px;
}

.checkout-member-card-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 12px;

	&.checkout-member-card-grid--payments {
		grid-template-columns: repeat(3, minmax(0, 1fr));
	}

	.checkout-member-choice-card {
		border: 1px solid var(--gray-40);
		border-radius: 12px;
		background: var(--contrast-light);
		padding: 16px 20px;
		text-align: left;
		cursor: pointer;
		min-height: 102px;
		display: flex;
		align-items: center;
		gap: 18px;

		&.is-active {
			border-color: var(--gray-60);
			background: var(--gray-20);
		}

		&.checkout-member-choice-card--payment {
			justify-content: center;
			padding: 20px 22px;
			min-height: 62px;
		}

		.checkout-member-choice-icon {
			width: 38px;
			height: 38px;
			object-fit: contain;
			flex-shrink: 0;
		}

		.checkout-member-choice-title {
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-semibold);
			color: var(--text-primary);
		}
	}
}

.checkout-member-field-grid {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

.checkout-member-subnote-button {
	border: 0;
	padding: 0;
	background: transparent;
	color: var(--text-primary);
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-bold);
	text-decoration: underline;
	text-underline-offset: 2px;
	cursor: pointer;
	text-align: left;
}

.checkout-member-payment-meta {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;

	.checkout-member-payment-brands {
		display: flex;
		align-items: center;
		flex-wrap: nowrap;

		.checkout-member-payment-brand {
			display: inline-flex;
			align-items: center;
			justify-content: center;

			.checkout-member-payment-brand-icon {
				display: block;
				height: 32px;
				width: auto;
				max-width: 130px;
				object-fit: contain;
			}
		}
	}
}

.checkout-member-payment-transfer-meta {
	display: grid;
	gap: 14px;

	.checkout-member-payment-transfer-note {
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}

	.checkout-member-payment-transfer-brand {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 74px;
		padding-block: 16px;

		&::before {
			content: '';
			position: absolute;
			top: 50%;
			left: 0;
			right: 0;
			border-top: 1px solid var(--gray-40);
			transform: translateY(-50%);
		}

		.checkout-member-payment-transfer-brand-icon {
			position: relative;
			z-index: 1;
			display: block;
			margin: 0 auto;
			width: min(100%, 240px);
			height: auto;
			padding-inline: 22px;
			background: var(--contrast-light);
			object-fit: contain;
		}
	}
}

.checkout-member-payment-meta-panel {
	transform-origin: top;
	transition: opacity 0.24s ease, clip-path 1s cubic-bezier(0.22, 1, 0.36, 1);
	will-change: clip-path, opacity;
}

.checkout-member-payment-meta-block {
	display: grid;
	gap: 14px;
}

.checkout-member-inline-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.checkout-member-checkbox-with-tooltip {
	display: inline-flex;
	align-items: flex-start;
	gap: 6px;

	:deep(.ui-checkbox) {
		display: inline-flex;
		align-items: flex-start;
		gap: 8px;
		min-width: 0;
	}

	:deep(.ui-checkbox-box) {
		flex-shrink: 0;
		margin-top: 1px;
	}

	:deep(.ui-checkbox-label) {
		display: block;
		min-width: 0;
		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
	}
}

.checkout-member-payment-meta-swap-wrap {
	position: relative;
	transition: height 1s cubic-bezier(0.22, 1, 0.36, 1);
}

@media (max-width: 760px) {
	.checkout-member-inline-row,
	.checkout-member-payment-meta {
		align-items: flex-start;
		flex-direction: column;
	}

	.checkout-member-card-grid,
	.checkout-member-field-grid {
		grid-template-columns: 1fr;
	}
}
</style>