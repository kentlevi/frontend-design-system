<script setup lang="ts">
import ShippingMethod from '../shipping/ShippingMethod.vue';
import ManualAddress from '../address/ManualShippingAddress.vue';
import SavedAddress from '../address/SavedShippingAddress.vue';
import DropShippingAddress from '../address/DropShippingAddress.vue';
import { useCheckoutAddressFeature } from '../../../composables/checkout/address/useCheckoutAddressFeature';
import { useSavedShippingAddress } from '~/composables/checkout/address/useSavedShippingAddress';
import { useUserAddressDataCheckoutContext } from '~/composables/checkout/address/context/addressBookListCheckoutContext';
import CheckoutTransition from '../shared/CheckoutTransition.vue';

const {
	translate,

	is_member,

	shipping_swap_wrapper_ref,
	shipping_ship_to_another_address,

	resetForm,
} = useCheckoutAddressFeature()

const {	openSelectAddressModal } = useSavedShippingAddress()

const {	has_shipping_addresses } = useUserAddressDataCheckoutContext()
</script>

<template>
	<section class="checkout-member-section">
		<div class="checkout-member-shipping-group">
			<div class="checkout-member-address-group">
				<div v-if="is_member && has_shipping_addresses" class="checkout-member-radio-row">
					<UiRadio v-model="shipping_ship_to_another_address" :value="false" name="shipping-mode" class="checkout-member-radio-line">
						{{ translate('checkout.member.myShippingAddress') }}
					</UiRadio>
					<UiButton type="button" variant="ghost" tone="neutral" size="sm" class="checkout-member-link" :no-hover="true" @click="openSelectAddressModal('shipping')">
						{{ translate('checkout.member.viewShippingAddresses') }}
					</UiButton>
				</div>

				<div ref="shipping_swap_wrapper_ref" class="checkout-member-shipping-swap-wrap">
					<CheckoutTransition>
						<SavedAddress
							v-if="is_member && !shipping_ship_to_another_address && has_shipping_addresses"
							key="saved-address"
							class="checkout-member-shipping-panel"
						/>
						<ManualAddress
							v-else
							key="manual-address"
							class="checkout-member-shipping-panel"
						/>
					</CheckoutTransition>
				</div>
			</div>

			<UiRadio
				v-if="is_member && !shipping_ship_to_another_address && has_shipping_addresses"
				v-model="shipping_ship_to_another_address"
				:value="true"
				name="shipping-mode"
				class="checkout-member-radio-line"
				@click="resetForm('shipping')"
			>
				{{ translate('checkout.member.shipToAnotherAddress') }}
			</UiRadio>

			<ShippingMethod />

			<DropShippingAddress/>
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

		.checkout-member-address-group {
			display: grid;
			gap: 14px;
		}

		.checkout-member-radio-line {
			align-self: start;
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-semibold);
			color: var(--text-primary);
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

		.checkout-member-radio-row {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}

		.checkout-member-shipping-swap-wrap {
			position: relative;
			transition: height 1s cubic-bezier(0.22, 1, 0.36, 1);
		}

		.checkout-member-shipping-panel {
			transform-origin: top;
			transition: opacity 0.24s ease, clip-path 1s cubic-bezier(0.22, 1, 0.36, 1);
			will-change: clip-path, opacity;
		}
	}
}

@media (max-width: 760px) {
	.checkout-member-section {
		.checkout-member-shipping-group {
			.checkout-member-radio-row {
				align-items: flex-start;
				flex-direction: column;
			}
		}
	}
}
</style>