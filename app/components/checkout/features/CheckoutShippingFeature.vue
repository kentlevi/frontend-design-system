<script setup lang="ts">
import { ref } from 'vue';
import CheckoutAddressForm from '~/components/checkout/shared/CheckoutAddressForm.vue';
import { useDismissibleTooltip } from '~/composables/checkout/features/useDismissibleTooltip';
import { useCheckoutFeatureTransition } from '~/composables/checkout/features/useCheckoutFeatureTransition';
import { useCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext';
import { useHeightTransition } from '~/composables/checkout/shared/useHeightTransition';
import {
	checkoutDropShippingTooltipContent,
	checkoutDropShippingTooltipProps,
} from '~/data/checkout/tooltips';
import ShippingMethod from '../ShippingMethod.vue';

const {
	t,
	is_member,
	getAddressTagClass,
	active_shipping_methods,
	selected_shipping_method,
	shipping_method_details,
	selected_shipping_address,
	ship_to_another_address,
	drop_shipping_enabled,
	drop_shipping_ship_to_another_address,
	drop_shipping_name,
	drop_shipping_company,
	selected_drop_shipping_address,
	full_name,
	company,
	address_1,
	address_2,
	province,
	city,
	postal_code,
	phone,
	province_options,
	is_shipping_address_modal_open,
	is_drop_shipping_address_modal_open,
	drop_shipping_tooltip_open,
	toggleDropShippingTooltip,
} = useCheckoutExperienceFeatureContext();

const shipping_swap_wrapper_ref = ref<HTMLElement | null>(null);
const drop_shipping_swap_wrapper_ref = ref<HTMLElement | null>(null);
const drop_shipping_mode_swap_wrapper_ref = ref<HTMLElement | null>(null);
const drop_shipping_tooltip_ref = ref<HTMLElement | null>(null);

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

useDismissibleTooltip(drop_shipping_tooltip_ref, drop_shipping_tooltip_open);

useHeightTransition(shipping_swap_wrapper_ref, ship_to_another_address,
	() => ship_to_another_address.value ? '[data-shipping-panel="another-address"]' : '[data-shipping-panel="saved-address"]',
	{ enterDurationMs: enter_duration_ms, leaveDurationMs: leave_duration_ms }
);

useHeightTransition(drop_shipping_swap_wrapper_ref, drop_shipping_enabled,
	() => drop_shipping_enabled.value ? '[data-drop-shipping-panel="form"]' : null,
	{ enterDurationMs: enter_duration_ms, leaveDurationMs: leave_duration_ms }
);

useHeightTransition(drop_shipping_mode_swap_wrapper_ref, drop_shipping_ship_to_another_address,
	() => drop_shipping_ship_to_another_address.value ? '[data-drop-shipping-mode-panel="another-address"]' : '[data-drop-shipping-mode-panel="saved-address"]',
	{ enabled: () => drop_shipping_enabled.value, enterDurationMs: enter_duration_ms, leaveDurationMs: leave_duration_ms }
);
</script>

<template>
	<section class="checkout-member-section">
		<div class="checkout-member-shipping-group">
			<div class="checkout-member-address-group">
				<div v-if="is_member" class="checkout-member-radio-row">
					<UiRadio v-model="ship_to_another_address" :value="false" name="shipping-mode" class="checkout-member-radio-line">
						{{ t('checkout.member.myShippingAddress') }}
					</UiRadio>
					<UiButton type="button" variant="ghost" tone="neutral" size="sm" class="checkout-member-link" :no-hover="true" @click="is_shipping_address_modal_open = true">
						{{ t('checkout.member.viewShippingAddresses') }}
					</UiButton>
				</div>

				<div ref="shipping_swap_wrapper_ref" class="checkout-member-shipping-swap-wrap">
					<Transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" @before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave">
						<div v-if="is_member && !ship_to_another_address" key="saved-address" data-shipping-panel="saved-address" class="checkout-member-address-grid">
							<button v-if="selected_shipping_address" type="button" class="checkout-member-address-card is-active" @click="is_shipping_address_modal_open = true">
								<div class="checkout-member-address-top">
									<div class="checkout-member-address-title-group">
										<strong class="checkout-member-address-name">{{ selected_shipping_address.recipient }}</strong>
										<span v-if="selected_shipping_address.isDefault" class="checkout-member-address-badge">Default Shipping</span>
									</div>
								</div>
								<div class="checkout-member-address-content">
									<div v-if="selected_shipping_address.phone" class="checkout-member-address-row">
										<UiIcon name="regular-phone" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
										<p class="checkout-member-address-line checkout-member-address-line--strong">{{ selected_shipping_address.phone }}</p>
									</div>
									<div class="checkout-member-address-row checkout-member-address-row--split">
										<div class="checkout-member-address-row-main">
											<UiIcon name="regular-map-marker" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
											<div class="checkout-member-address-lines">
												<p class="checkout-member-address-line">{{ selected_shipping_address.line1 }}</p>
												<p class="checkout-member-address-line">{{ selected_shipping_address.line2 }}</p>
											</div>
										</div>
										<span v-if="selected_shipping_address.label" class="checkout-member-address-tag" :class="getAddressTagClass(selected_shipping_address.label)">
											{{ selected_shipping_address.label }}
										</span>
									</div>
									<div v-if="selected_shipping_address.company" class="checkout-member-address-row">
										<UiIcon name="regular-building" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
										<p class="checkout-member-address-line">{{ selected_shipping_address.company }}</p>
									</div>
								</div>
							</button>
						</div>

						<div v-else key="manual-address" data-shipping-panel="manual-address" class="checkout-member-address-form">
							<div v-if="is_member" class="checkout-member-address-form-head">
								<UiRadio v-model="ship_to_another_address" :value="true" name="shipping-mode" class="checkout-member-radio-line checkout-member-radio-line--inline">
									{{ t('checkout.member.shipToAnotherAddress') }}
								</UiRadio>
								<div class="checkout-member-address-form-note">This address will be saved for future use.</div>
							</div>
							<CheckoutAddressForm
								v-if="is_member"
								v-model:full-name="full_name"
								v-model:company="company"
								v-model:address1="address_1"
								v-model:address2="address_2"
								v-model:province="province"
								v-model:city="city"
								v-model:postal-code="postal_code"
								v-model:phone="phone"
								:province-options="province_options"
								size="md"
							/>
							<CheckoutAddressForm
								v-else
								v-model:full-name="full_name"
								v-model:company="company"
								v-model:address1="address_1"
								v-model:address2="address_2"
								v-model:province="province"
								v-model:city="city"
								v-model:postal-code="postal_code"
								v-model:phone="phone"
								:province-options="province_options"
								size="md"
							/>
						</div>
					</Transition>
				</div>
			</div>

			<UiRadio v-if="is_member && !ship_to_another_address" v-model="ship_to_another_address" :value="true" name="shipping-mode" class="checkout-member-radio-line">
				{{ t('checkout.member.shipToAnotherAddress') }}
			</UiRadio>

			<!-- ipasa ang id gaw tanan cart_item_ids in array -->
			<ShippingMethod :cart-item-ids="[1]" />

			<div class="checkout-member-inline-row">
				<div ref="drop_shipping_tooltip_ref" class="checkout-member-checkbox-with-tooltip">
					<UiCheckbox v-model="drop_shipping_enabled">{{ t('checkout.member.enableDropShipping') }}</UiCheckbox>
					<UiTooltip :open="drop_shipping_tooltip_open" v-bind="checkoutDropShippingTooltipProps">
						<template #trigger>
							<button type="button" class="ui-tooltip-icon-trigger" @click.stop.prevent="toggleDropShippingTooltip">
								<UiIcon :name="drop_shipping_tooltip_open ? 'strong-question-circle' : 'regular-question-circle'" size="20" color="var(--text-secondary)" decorative />
							</button>
						</template>
						<div class="ui-tooltip-copy">
							<strong class="ui-tooltip-title">{{ checkoutDropShippingTooltipContent.title }}</strong>
							<p class="ui-tooltip-text">{{ checkoutDropShippingTooltipContent.text }}</p>
						</div>
					</UiTooltip>
				</div>
				<div class="checkout-member-drop-shipping-form-note" :class="{ 'is-active': drop_shipping_enabled, 'is-muted': !is_member }">
					{{ is_member ? 'This will be saved as your default drop shipping address.' : 'Only available for members to save addresses.' }}
				</div>
			</div>

			<div ref="drop_shipping_swap_wrapper_ref" class="checkout-member-drop-shipping-swap-wrap">
				<Transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" @before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave">
					<div v-if="drop_shipping_enabled" data-drop-shipping-panel="form" class="checkout-member-drop-shipping-form">
						<template v-if="is_member">
							<div class="checkout-member-address-group">
								<div class="checkout-member-radio-row">
									<UiRadio v-model="drop_shipping_ship_to_another_address" :value="false" name="drop-shipping-mode" class="checkout-member-radio-line">
										My Drop Shipping Address
									</UiRadio>
									<UiButton variant="ghost" tone="neutral" size="sm" class="checkout-member-link" :no-hover="true" @click="is_drop_shipping_address_modal_open = true">
										View Drop Shipping Addresses
									</UiButton>
								</div>
							</div>
							<div ref="drop_shipping_mode_swap_wrapper_ref" class="checkout-member-drop-shipping-mode-swap-wrap">
								<Transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter" @before-leave="beforeLeave" @leave="leave" @after-leave="afterLeave">
									<div v-if="!drop_shipping_ship_to_another_address" key="drop-shipping-saved" data-drop-shipping-mode-panel="saved-address" class="checkout-member-drop-shipping-mode-panel">
										<div class="checkout-member-address-grid">
											<button type="button" class="checkout-member-address-card is-active">
												<div class="checkout-member-address-top">
													<div class="checkout-member-address-title-group">
														<strong class="checkout-member-address-name">{{ selected_drop_shipping_address?.recipient }}</strong>
														<span v-if="selected_drop_shipping_address?.isDefault" class="checkout-member-address-badge">Default Drop Shipping</span>
													</div>
												</div>
												<div class="checkout-member-address-content">
													<div class="checkout-member-address-row checkout-member-address-row--split">
														<div class="checkout-member-address-row-main">
															<p class="checkout-member-address-line">{{ selected_drop_shipping_address?.company || 'No company provided' }}</p>
														</div>
														<span v-if="selected_drop_shipping_address?.label" class="checkout-member-address-tag" :class="getAddressTagClass(selected_drop_shipping_address.label)">
															{{ selected_drop_shipping_address.label }}
														</span>
													</div>
												</div>
											</button>
										</div>
										<div class="checkout-member-address-form-head is-solo">
											<UiRadio v-model="drop_shipping_ship_to_another_address" :value="true" name="drop-shipping-mode" class="checkout-member-radio-line checkout-member-radio-line--inline">
												Ship to Another Drop Shipping Address
											</UiRadio>
										</div>
									</div>
									<div v-else key="drop-shipping-another-address" data-drop-shipping-mode-panel="another-address" class="checkout-member-drop-shipping-mode-panel">
										<div class="checkout-member-address-form-head">
											<UiRadio v-model="drop_shipping_ship_to_another_address" :value="true" name="drop-shipping-mode" class="checkout-member-radio-line checkout-member-radio-line--inline">
												Ship to Another Drop Shipping Address
											</UiRadio>
											<div class="checkout-member-address-form-note">This address will be saved for future use.</div>
										</div>
										<div class="checkout-member-field-grid">
											<UiFormField label="Name" :required="true" :show-required-mark="true">
												<UiInput v-model="drop_shipping_name" placeholder="Enter Full Name" />
											</UiFormField>
											<UiFormField label="Company (Optional)">
												<UiInput v-model="drop_shipping_company" placeholder="Enter Company Name" />
											</UiFormField>
										</div>
									</div>
								</Transition>
							</div>
						</template>

						<template v-else>
							<div class="checkout-member-field-grid">
								<UiFormField label="Name" :required="true" :show-required-mark="true">
									<UiInput v-model="drop_shipping_name" placeholder="Enter Full Name" />
								</UiFormField>
								<UiFormField label="Company (Optional)">
									<UiInput v-model="drop_shipping_company" placeholder="Enter Company Name" />
								</UiFormField>
							</div>
						</template>
					</div>
				</Transition>
			</div>
		</div>
	</section>
</template>

<style scoped lang="scss">
.checkout-member-section {
	display: grid;
	gap: 12px;

	.checkout-member-shipping-group {
		display: grid;
		gap: 14px;

		.checkout-member-address-group,
		.checkout-member-address-form,
		.checkout-member-drop-shipping-form {
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

		.checkout-member-radio-row,
		.checkout-member-block-head,
		.checkout-member-inline-row,
		.checkout-member-address-form-head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;

			&.is-solo {
				padding-top: 4px;
			}
		}

		.checkout-member-address-form-note,
		.checkout-member-drop-shipping-form-note,
		.checkout-member-block-note {
			color: var(--text-secondary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			text-align: right;
		}

		.checkout-member-drop-shipping-form-note {
			opacity: 0;
			visibility: hidden;
			transition: opacity 0.2s ease;

			&.is-active {
				opacity: 1;
				visibility: visible;
			}
		}

		.checkout-member-address-grid,
		.checkout-member-drop-shipping-mode-panel,
		.checkout-member-field-grid {
			display: grid;
			gap: 14px;
		}

		.checkout-member-address-grid {
			grid-template-columns: 1fr;
			transform-origin: top;
			transition: opacity 0.24s ease, clip-path 1s cubic-bezier(0.22, 1, 0.36, 1);
			will-change: clip-path, opacity;
		}

		.checkout-member-field-grid,
		.checkout-member-card-grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.checkout-member-card-grid {
			display: grid;
			gap: 12px;
		}

		.checkout-member-address-card,
		.checkout-member-choice-card {
			border: 1px solid var(--gray-40);
			border-radius: 12px;
			background: var(--contrast-light);
			text-align: left;
			cursor: pointer;

			&.is-active {
				border-color: var(--gray-60);
				background: var(--gray-20);
			}
		}

		.checkout-member-address-card {
			padding: 0;
			overflow: hidden;

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
						padding: 3px 10px;
						border-radius: 999px;
						border: 1px solid var(--gray-40);
						background: var(--contrast-light);
						font-size: var(--type-size-50);
						line-height: var(--type-line-50);
						font-weight: var(--font-weight-semibold);
						color: var(--text-secondary);
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

		.checkout-member-block {
			display: grid;
			gap: 8px;

			.checkout-member-block-title {
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-bold);
				color: var(--text-primary);
			}

			.checkout-member-choice-card {
				min-height: 62px;
				display: flex;
				align-items: center;
				gap: 12px;
				padding: 14px 16px;

				.checkout-member-choice-icon {
					width: 36px;
					height: 36px;
					object-fit: contain;
					flex-shrink: 0;
				}

				.checkout-member-choice-copy {
					flex: 1;
					display: grid;
					gap: 4px;

					.checkout-member-choice-title {
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
						font-weight: var(--font-weight-semibold);
						color: var(--text-primary);
					}

					.checkout-member-choice-subtitle {
						color: var(--text-secondary);
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
					}
				}

				.checkout-member-choice-price {
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					font-weight: var(--font-weight-semibold);
					color: var(--text-primary);
				}
			}
		}

		.checkout-member-checkbox-with-tooltip {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			min-width: 0;
			line-height: 1;
		}

		.checkout-member-address-form,
		.checkout-member-drop-shipping-form,
		.checkout-member-drop-shipping-mode-panel {
			transform-origin: top;
			transition: opacity 0.24s ease, clip-path 1s cubic-bezier(0.22, 1, 0.36, 1);
			will-change: clip-path, opacity;
		}

		.checkout-member-shipping-swap-wrap,
		.checkout-member-drop-shipping-swap-wrap,
		.checkout-member-drop-shipping-mode-swap-wrap {
			position: relative;
			transition: height 1s cubic-bezier(0.22, 1, 0.36, 1);
		}
	}

}

@media (max-width: 760px) {
	.checkout-member-section {
		.checkout-member-shipping-group {
			.checkout-member-inline-row,
			.checkout-member-radio-row,
			.checkout-member-address-form-head,
			.checkout-member-block-head,
			.checkout-member-address-row.checkout-member-address-row--split {
				align-items: flex-start;
				flex-direction: column;
			}

			.checkout-member-address-grid,
			.checkout-member-card-grid,
			.checkout-member-field-grid {
				grid-template-columns: 1fr;
			}

			.checkout-member-block-note,
			.checkout-member-drop-shipping-form-note,
			.checkout-member-address-form-note {
				text-align: left;
			}

			.checkout-member-points-tooltip-title,
			.checkout-member-points-tooltip-text {
				line-height: 20px;
			}
		}
	}
}
</style>