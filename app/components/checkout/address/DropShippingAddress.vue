<script setup lang="ts">
import AddressFormFields from '~/components/shared/address/AddressFormFields.vue';
import {
	checkoutDropShippingTooltipContent,
	checkoutDropShippingTooltipProps,
} from '~/data/checkout/tooltips';
import { useDropShippingAddressUI } from '~/composables/checkout/address/useDropShippingAddressUI';
import { useDropShippingAddress } from '~/composables/checkout/address/useDropShippingAddress';
import CheckoutTransition from '../shared/CheckoutTransition.vue';

const {
	translate,
	is_member,
	drop_shipping_enabled,
	drop_shipping_ship_to_another_address,
	drop_shipping_tooltip_open,
	drop_shipping_mode_swap_wrapper_ref,
	has_drop_addresses,

	getAddressTagClass,
	toggleDropShippingTooltip,
} = useDropShippingAddressUI();

const {
	drop_form,
	form_field_errors,

	updateFormFieldByType,
	resetForm,
	setDropAddress,
	openSelectAddressModal,
} = useDropShippingAddress();

</script>

<template>
	<div class="checkout-member-inline-row">
		<div ref="drop_shipping_tooltip_ref" class="checkout-member-checkbox-with-tooltip">
			<UiCheckbox v-model="drop_shipping_enabled" @click="setDropAddress()">{{ translate('checkout.member.enableDropShipping') }}</UiCheckbox>
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
			{{ is_member ? translate('checkout.member.dropShippingAddress.defaultNote') : translate('checkout.member.dropShippingAddress.membersOnlyNote') }}
		</div>
	</div>

	<div ref="drop_shipping_swap_wrapper_ref" class="checkout-member-drop-shipping-swap-wrap">
		<CheckoutTransition>
			<div v-if="drop_shipping_enabled" data-drop-shipping-panel="form" class="checkout-member-drop-shipping-form">
				<template v-if="is_member && has_drop_addresses">
					<div class="checkout-member-address-group">
						<div class="checkout-member-radio-row">
							<UiRadio
								v-model="drop_shipping_ship_to_another_address"
								:value="false"
								name="drop-shipping-mode"
								class="checkout-member-radio-line"
								@click="setDropAddress()"
							>
								{{ translate('checkout.member.dropShippingAddress.myDropShippingAddress') }}
							</UiRadio>
							<UiButton
								variant="ghost"
								tone="neutral"
								size="sm"
								class="checkout-member-link"
								:no-hover="true"
								@click="openSelectAddressModal('drop')"
							>
								View Drop Shipping Addresses
							</UiButton>
						</div>
					</div>
					<div ref="drop_shipping_mode_swap_wrapper_ref" class="checkout-member-drop-shipping-mode-swap-wrap">
						<CheckoutTransition>
							<div v-if="!drop_shipping_ship_to_another_address" key="drop-shipping-saved" data-drop-shipping-mode-panel="saved-address" class="checkout-member-drop-shipping-mode-panel">
								<div class="checkout-member-address-grid">
									<button type="button" class="checkout-member-address-card is-active" @click="openSelectAddressModal('drop')">
										<div class="checkout-member-address-top">
											<div class="checkout-member-address-title-group">
												<strong class="checkout-member-address-name">{{ drop_form?.contact_name }}</strong>
												<UiBadge
													v-if="drop_form?.is_default"
													variant="outline"
													tone="default"
													size="md"
													class="checkout-member-address-badge"
													text-color="var(--gray-80)"
												>
													<UiIcon name="strong-box-full" :size="18" />
													<span class="checkout-member-address-badge-copy">{{ translate('checkout.member.addressSelection.defaultDropShipping') }}</span>
												</UiBadge>
											</div>
										</div>
										<div class="checkout-member-address-content">
											<div class="checkout-member-address-row checkout-member-address-row--split">
												<div class="checkout-member-address-row-main">
													<p class="checkout-member-address-line">{{ drop_form?.company || translate('checkout.member.addressSelection.noCompanyProvided') }}</p>
												</div>
												<span v-if="drop_form?.label" class="checkout-member-address-tag" :class="getAddressTagClass(drop_form.label)">
													{{ drop_form.label }}
												</span>
											</div>
										</div>
									</button>
								</div>
								<div class="checkout-member-address-form-head is-solo">
									<UiRadio
										v-model="drop_shipping_ship_to_another_address"
										:value="true"
										name="drop-shipping-mode"
										class="checkout-member-radio-line checkout-member-radio-line--inline"
										@click="resetForm('drop')"
									>
										{{ translate('checkout.member.dropShippingAddress.shipToAnotherDropShippingAddress') }}
									</UiRadio>
								</div>
							</div>
							<div v-else key="drop-shipping-another-address" data-drop-shipping-mode-panel="another-address" class="checkout-member-drop-shipping-mode-panel">
								<div class="checkout-member-address-form-head">
									<UiRadio
										v-model="drop_shipping_ship_to_another_address"
										:value="true"
										name="drop-shipping-mode"
										class="checkout-member-radio-line checkout-member-radio-line--inline"
										@click="resetForm('drop')"
									>
										{{ translate('checkout.member.dropShippingAddress.shipToAnotherDropShippingAddress') }}
									</UiRadio>
									<div class="checkout-member-address-form-note">{{ translate('checkout.member.dropShippingAddress.savedForFutureUse') }}</div>
								</div>
								<AddressFormFields
									:form="drop_form"
									:errors="form_field_errors"
									@update:field="updateFormFieldByType"
								/>
							</div>
						</CheckoutTransition>
					</div>
				</template>

				<template v-else>
					<AddressFormFields
						:form="drop_form"
						:errors="form_field_errors"
						@update:field="updateFormFieldByType"
					/>
				</template>
			</div>
		</CheckoutTransition>
	</div>
</template>

<style scoped lang="scss">
.checkout-member-drop-shipping-form {
	display: grid;
	gap: 14px;
	transform-origin: top;
	transition: opacity 0.24s ease, clip-path 1s cubic-bezier(0.22, 1, 0.36, 1);
	will-change: clip-path, opacity;
}

.checkout-member-inline-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;

	.checkout-member-checkbox-with-tooltip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-width: 0;
		line-height: 1;
	}

	.checkout-member-drop-shipping-form-note {
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		text-align: right;
		opacity: 0;
		visibility: hidden;
		transition: opacity 0.2s ease;

		&.is-active {
			opacity: 1;
			visibility: visible;
		}
	}
}

.checkout-member-address-group {
	display: grid;
	gap: 14px;

	.checkout-member-radio-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
}

.checkout-member-drop-shipping-swap-wrap,
.checkout-member-drop-shipping-mode-swap-wrap {
	position: relative;
	transition: height 1s cubic-bezier(0.22, 1, 0.36, 1);
}

.checkout-member-drop-shipping-mode-panel {
	display: grid;
	gap: 14px;
	transform-origin: top;
	transition: opacity 0.24s ease, clip-path 1s cubic-bezier(0.22, 1, 0.36, 1);
	will-change: clip-path, opacity;

	.checkout-member-address-form-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;

		&.is-solo {
			padding-top: 4px;
		}

		.checkout-member-address-form-note {
			color: var(--text-secondary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			text-align: right;
		}
	}
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
	font-weight: var(--font-weight-semibold);
	box-shadow: none;
}

.checkout-member-address-grid,
.checkout-member-field-grid {
	display: grid;
	gap: 14px;
}

.checkout-member-address-grid {
	grid-template-columns: 1fr;

	.checkout-member-address-card {
		border: 1px solid var(--gray-40);
		border-radius: 12px;
		background: var(--contrast-light);
		cursor: pointer;
		padding: 0;
		overflow: hidden;

		&.is-active {
			border-color: var(--gray-60);
			background: var(--gray-20);
		}

		.checkout-member-address-top {
			display: flex;
			justify-content: space-between;
			padding: 14px 16px;
			border-bottom: 1px solid var(--gray-40);

			.checkout-member-address-title-group {
				display: inline-flex;
				gap: 8px;
				flex-wrap: wrap;

				.checkout-member-address-name {
					font-size: var(--type-size-100);
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
				gap: 8px;

				&.checkout-member-address-row--split {
					justify-content: space-between;
				}

				.checkout-member-address-row-main {
					display: flex;
					gap: 8px;
				}

				.checkout-member-address-line {
					color: var(--text-secondary);
					font-size: var(--type-size-100);
				}

				.checkout-member-address-tag {
					padding: 3px 10px;
					border-radius: 999px;
					background: var(--aloha-10);
					color: var(--aloha-60);
					font-size: var(--type-size-50);
				}
			}
		}
	}
}

.checkout-member-field-grid {
	grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (max-width: 760px) {
	.checkout-member-inline-row,
	.checkout-member-address-group .checkout-member-radio-row,
	.checkout-member-drop-shipping-mode-panel .checkout-member-address-form-head {
		flex-direction: column;
		align-items: flex-start;
	}

	.checkout-member-field-grid {
		grid-template-columns: 1fr;
	}

	.checkout-member-inline-row {
		.checkout-member-drop-shipping-form-note {
			text-align: left;
		}
	}
}
</style>