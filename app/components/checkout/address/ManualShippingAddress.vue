<script setup lang="ts">
import AddressFormFields from '~/components/shared/address/AddressFormFields.vue';
import { useManualShippingAddress } from '~/composables/checkout/address/useManualShippingAddress';

const {
	t: translate,
	is_member,
	shipping_form,
	form_field_errors,
	shipping_ship_to_another_address,

	updateFormFieldByType,
	updateDynamicFieldByType,
} = useManualShippingAddress()

</script>

<template>
	<div key="manual-address" data-shipping-panel="manual-address" class="checkout-member-address-form">
		<div v-if="is_member" class="checkout-member-address-form-head">
			<UiRadio
				v-if = "shipping_ship_to_another_address"
				v-model="shipping_ship_to_another_address"
				:value="true"
				name="shipping-mode"
				class="checkout-member-radio-line checkout-member-radio-line--inline"
			>
				{{ translate('checkout.member.shipToAnotherAddress') }}
			</UiRadio>
			<h2 v-else style="font-size: 20px; font-weight: 600;">
				{{ translate('checkout.member.shippingDetails') }}
			</h2>

			<div class="checkout-member-address-form-note">
				{{ translate('checkout.member.shippingAddress.savedForFutureUse') }}
			</div>
		</div>

		<AddressFormFields
			:form="shipping_form"
			:errors="form_field_errors"
			@update:field="updateFormFieldByType"
			@update:dynamic-field="updateDynamicFieldByType"
		/>
	</div>
</template>

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