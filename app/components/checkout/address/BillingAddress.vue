<template>
	<div class="checkout-member-inline-row">
		<div ref="billing_tooltip_ref" class="checkout-member-checkbox-with-tooltip">
			<UiCheckbox v-model="use_shipping_as_billing">{{ t('checkout.member.useShippingAsBilling') }}</UiCheckbox>
			<UiTooltip :open="billing_tooltip_open" v-bind="checkoutBillingTooltipProps">
				<template #trigger>
					<button type="button" class="ui-tooltip-icon-trigger" @click.stop.prevent="toggleBillingTooltip">
						<UiIcon :name="billing_tooltip_open ? 'strong-question-circle' : 'regular-question-circle'" size="24" color="var(--gray-90)" decorative />
					</button>
				</template>

				<div class="ui-tooltip-copy">
					<strong class="ui-tooltip-title">{{ t('checkout.member.billingTooltip.title') }}</strong>
					<p class="ui-tooltip-text">{{ t('checkout.member.billingTooltip.text') }}</p>
				</div>
			</UiTooltip>
		</div>
	</div>
	<div ref="billing_swap_wrapper_ref" class="checkout-member-billing-swap-wrap">
		<Transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" @before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave">
			<div v-if="!use_shipping_as_billing" data-billing-panel="content" class="checkout-member-billing-panel">
				<div class="checkout-member-billing-group">
					<div v-if="is_member" class="checkout-member-radio-row">
						<UiRadio v-model="billing_use_different_address" :value="false" name="billing-mode" class="checkout-member-radio-line">
							My Billing Address
						</UiRadio>
						<UiButton type="button" variant="ghost" tone="neutral" size="sm" class="checkout-member-link" :no-hover="true" @click="is_billing_address_modal_open = true">
							View Billing Addresses
						</UiButton>
					</div>

					<div ref="billing_mode_swap_wrapper_ref" class="checkout-member-drop-shipping-mode-swap-wrap">
						<Transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" @before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave">
							<div v-if="!billing_use_different_address && is_member" key="billing-saved" data-billing-mode-panel="saved-address" class="checkout-member-drop-shipping-mode-panel">
								<div class="checkout-member-address-grid">
									<button v-if="selected_billing_address" type="button" class="checkout-member-address-card is-active" @click="is_billing_address_modal_open = true">
										<div class="checkout-member-address-top">
											<div class="checkout-member-address-title-group">
												<strong class="checkout-member-address-name">{{ selected_billing_address.recipient }}</strong>
												<UiBadge
													v-if="selected_billing_address.isDefault"
													variant="outline"
													tone="default"
													size="md"
													class="checkout-member-address-badge"
													text-color="var(--gray-80)"
												>
													<UiIcon name="strong-file-dollar" :size="18" />
													<span class="checkout-member-address-badge-copy">Default Billing</span>
												</UiBadge>
											</div>
										</div>
										<div class="checkout-member-address-content">
											<div v-if="selected_billing_address.phone" class="checkout-member-address-row">
												<UiIcon name="regular-phone" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
												<p class="checkout-member-address-line checkout-member-address-line--strong">{{ selected_billing_address.phone }}</p>
											</div>
											<div class="checkout-member-address-row checkout-member-address-row--split">
												<div class="checkout-member-address-row-main">
													<UiIcon name="regular-map-marker" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
													<div class="checkout-member-address-lines">
														<p class="checkout-member-address-line">{{ selected_billing_address.line1 }}</p>
														<p v-if="selected_billing_address.line2" class="checkout-member-address-line">{{ selected_billing_address.line2 }}</p>
													</div>
												</div>
												<span v-if="selected_billing_address.label" class="checkout-member-address-tag" :class="getAddressTagClass(selected_billing_address.label)">
													{{ selected_billing_address.label }}
												</span>
											</div>
											<div v-if="selected_billing_address.company" class="checkout-member-address-row">
												<UiIcon name="regular-building" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
												<p class="checkout-member-address-line">{{ selected_billing_address.company }}</p>
											</div>
										</div>
									</button>
								</div>
								<div class="checkout-member-address-form-head is-solo">
									<UiRadio v-model="billing_use_different_address" :value="true" name="billing-mode" class="checkout-member-radio-line checkout-member-radio-line--inline">
										Use Another Billing Address
									</UiRadio>
								</div>
							</div>
							<div v-else key="billing-manual" data-billing-mode-panel="manual-address" class="checkout-member-drop-shipping-mode-panel">
								<div v-if="is_member" class="checkout-member-address-form-head">
									<UiRadio v-model="billing_use_different_address" :value="true" name="billing-mode" class="checkout-member-radio-line checkout-member-radio-line--inline">
										Ship to Another Billing Address
									</UiRadio>
								</div>
								<CheckoutAddressForm
									v-model:full-name="billing_full_name"
									v-model:company="billing_company"
									v-model:address1="billing_address_1"
									v-model:address2="billing_address_2"
									v-model:province="billing_province"
									v-model:city="billing_city"
									v-model:postal-code="billing_postal_code"
									:province-options="province_options"
									size="md"
									:hide-phone="true"
								/>
							</div>
						</Transition>
					</div>
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CheckoutAddressForm from '~/components/checkout/shared/CheckoutAddressForm.vue';
import { useCheckoutFeatureTransition } from '~/composables/checkout/features/useCheckoutFeatureTransition';
import { useCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext';
import { useHeightTransition } from '~/composables/checkout/shared/useHeightTransition';
import { checkoutBillingTooltipProps } from '~/data/checkout/tooltips';

const {
	t,
	is_member,
	use_shipping_as_billing,
	selected_billing_address,
	billing_use_different_address,
	billing_full_name,
	billing_company,
	billing_address_1,
	billing_address_2,
	billing_province,
	billing_city,
	billing_postal_code,
	province_options,
	billing_tooltip_open,
	getAddressTagClass,
	is_billing_address_modal_open,
	toggleBillingTooltip,
} = useCheckoutExperienceFeatureContext();

const billing_swap_wrapper_ref = ref<HTMLElement | null>(null);
const billing_mode_swap_wrapper_ref = ref<HTMLElement | null>(null);

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

useHeightTransition(
	billing_swap_wrapper_ref,
	use_shipping_as_billing,
	() => use_shipping_as_billing.value ? null : '[data-billing-panel="content"]',
	{ enterDurationMs: enter_duration_ms, leaveDurationMs: leave_duration_ms }
);

useHeightTransition(
	billing_mode_swap_wrapper_ref,
	billing_use_different_address,
	() =>
		billing_use_different_address.value
			? '[data-billing-mode-panel="manual-address"]'
			: '[data-billing-mode-panel="saved-address"]',
	{
		enabled: () => !use_shipping_as_billing.value,
		enterDurationMs: enter_duration_ms,
		leaveDurationMs: leave_duration_ms,
	}
);
</script>

<style scoped lang="scss">
.checkout-member-billing-group,
.checkout-member-billing-panel,
.checkout-member-drop-shipping-mode-panel {
	display: grid;
	gap: 14px;
}

.checkout-member-radio-line {
	align-self: start;
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-semibold);
	color: var(--text-primary);

	&.checkout-member-radio-line--inline {
		margin-bottom: 2px;
	}
}

.checkout-member-link {
	padding: 0;
	min-height: auto;
	color: var(--gold-60);
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-semibold);
	box-shadow: none;
}

.checkout-member-address-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 12px;

	.checkout-member-address-card {
		border: 1px solid var(--gray-40);
		border-radius: 12px;
		background: var(--contrast-light);
		padding: 0;
		overflow: hidden;
		text-align: left;
		cursor: pointer;

		&.is-active {
			border-color: var(--gray-60);
			background: var(--gray-20);
		}

		.checkout-member-address-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: 14px 16px;
			border-bottom: 1px solid var(--gray-40);

			.checkout-member-address-title-group {
				display: inline-flex;
				align-items: center;
				flex-wrap: wrap;
				gap: 8px;

				.checkout-member-address-name {
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					font-weight: var(--font-weight-bold);
					color: var(--text-primary);
				}

				.checkout-member-address-badge {
					display: inline-flex;
					align-items: center;
					gap: 6px;
					flex-shrink: 0;
				}

				.checkout-member-address-badge-copy {
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					font-weight: var(--font-weight-semibold);
				}
			}
		}

		.checkout-member-address-content {
			display: grid;
			gap: 10px;
			padding: 14px 16px;

			.checkout-member-address-row {
				display: flex;
				align-items: flex-start;
				gap: 8px;

				&.checkout-member-address-row--split {
					justify-content: space-between;
					gap: 16px;
				}

				.checkout-member-address-row-main {
					display: flex;
					align-items: flex-start;
					gap: 8px;
					min-width: 0;
				}

				.checkout-member-address-icon {
					flex-shrink: 0;
					margin-top: 1px;
				}

				.checkout-member-address-lines {
					min-width: 0;
				}

				.checkout-member-address-line {
					color: var(--text-secondary);
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);

					&.checkout-member-address-line--strong {
						color: var(--text-primary);
						font-weight: var(--font-weight-semibold);
					}
				}

				.checkout-member-address-tag {
					flex-shrink: 0;
					align-self: center;
					padding: 3px 10px;
					border-radius: 999px;
					background: var(--aloha-10);
					color: var(--aloha-60);
					font-size: var(--type-size-50);
					line-height: var(--type-line-50);
					font-weight: var(--font-weight-semibold);

					&.checkout-member-address-tag--office {
						background: var(--neon-blue-10);
						color: var(--neon-blue-60);
					}

					&.checkout-member-address-tag--client {
						background: var(--azure-10);
						color: var(--azure-60);
					}
				}
			}
		}
	}
}

.checkout-member-billing-panel,
.checkout-member-drop-shipping-mode-panel {
	transform-origin: top;
	transition: opacity 0.24s ease, clip-path 1s cubic-bezier(0.22, 1, 0.36, 1);
	will-change: clip-path, opacity;
}

.checkout-member-radio-row,
.checkout-member-address-form-head {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;

	&.is-solo {
		padding-top: 4px;
	}
}

.checkout-member-billing-swap-wrap,
.checkout-member-drop-shipping-mode-swap-wrap {
	position: relative;
	transition: height 1s cubic-bezier(0.22, 1, 0.36, 1);
}

@media (max-width: 760px) {
	.checkout-member-radio-row,
	.checkout-member-address-form-head,
	.checkout-member-address-row.checkout-member-address-row--split {
		align-items: flex-start;
		flex-direction: column;
	}
}
</style>