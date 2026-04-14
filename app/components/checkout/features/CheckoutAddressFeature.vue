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
					<Transition
						@before-enter="beforeEnter"
						@enter="enter"
						@after-enter="afterEnter"
						@before-leave="beforeLeave"
						@leave="leave"
						@after-leave="afterLeave"
					>
						<SavedAddress
							v-if="is_member && !ship_to_another_address"
							key="saved-address"
							class="checkout-member-shipping-panel"
						/>
						<ManualAddress
							v-else
							key="manual-address"
							class="checkout-member-shipping-panel"
						/>
					</Transition>
				</div>
			</div>

			<UiRadio v-if="is_member && !ship_to_another_address" v-model="ship_to_another_address" :value="true" name="shipping-mode" class="checkout-member-radio-line">
				{{ t('checkout.member.shipToAnotherAddress') }}
			</UiRadio>

			{{ is_member }}
			{{ ship_to_another_address }}
			{{ selected_shipping_address_id }}

			<ShippingMethod />

			<DropShippingAddress/>
		</div>
	</section>
</template>

<script setup lang="ts">
import { useCheckoutFeatureTransition } from '~/composables/checkout/features/useCheckoutFeatureTransition';
import { useCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext';
import { useHeightTransition } from '~/composables/checkout/shared/useHeightTransition';
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import ShippingMethod from '../shipping/ShippingMethod.vue';
import ManualAddress from '../address/ManualShippingAddress.vue';
import SavedAddress from '../address/SavedShippingAddress.vue';
import DropShippingAddress from '../address/DropShippingAddress.vue';

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
	t,
	is_member,
	is_shipping_address_modal_open,
} = useCheckoutExperienceFeatureContext();

const {
	ship_to_another_address,
	selected_shipping_address_id
} = storeToRefs(useMainCheckOutStore())

const shipping_swap_wrapper_ref = ref<HTMLElement | null>(null);

const getSelector = () =>
	ship_to_another_address.value
		? '[data-shipping-panel="manual-address"]'
		: '[data-shipping-panel="saved-address"]';

useHeightTransition(
	shipping_swap_wrapper_ref,
	ship_to_another_address,
	getSelector,
	{
		enterDurationMs: enter_duration_ms,
		leaveDurationMs: leave_duration_ms
	}
);
</script>

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