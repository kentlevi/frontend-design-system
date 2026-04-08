<template>
	<div key="manual-address" data-shipping-panel="manual-address" class="checkout-member-address-form">
		<div v-if="is_member" class="checkout-member-address-form-head">
			 <UiRadio 
                v-if = "selected_shipping_address"
                v-model="ship_to_another_address"
                :value="true"
                name="shipping-mode"
                class="checkout-member-radio-line checkout-member-radio-line--inline"
            >
                {{ t('checkout.member.shipToAnotherAddress') }}
            </UiRadio>
            <h2 v-else style="font-size: 20px; font-weight: 600;">
                Shipping Information
            </h2>

			<div class="checkout-member-address-form-note">
				This address will be saved for future use.
			</div>
		</div>

		<CheckoutAddressForm
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
</template>

<script setup lang="ts">
import CheckoutAddressForm from '~/components/checkout/shared/CheckoutAddressForm.vue';
import { useCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext';
import { useMainCheckOutStore } from "~/stores/checkout/index.store";

const {
	t,
	is_member,
	full_name,
	company,
	address_1,
	address_2,
	province,
	city,
	postal_code,
	phone,
	province_options,
} = useCheckoutExperienceFeatureContext();

const {
	selected_shipping_address,
	ship_to_another_address
} = storeToRefs(useMainCheckOutStore())
</script>

<style scoped lang="scss">
.checkout-member-address-form {
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

	.checkout-member-address-form-note {
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		text-align: right;
	}
}

@media (max-width: 760px) {
	.checkout-member-address-form {
		.checkout-member-address-form-head {
			align-items: flex-start;
			flex-direction: column;
		}

		.checkout-member-address-form-note {
			text-align: left;
		}
	}
}
</style>