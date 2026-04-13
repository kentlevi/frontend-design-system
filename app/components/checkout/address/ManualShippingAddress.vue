<script setup lang="ts">
import AddressFormFields from '~/components/shared/address/AddressFormFields.vue';
import { useAddressFieldStore } from '~/stores/address';
import { useAddressFormCheckoutContext } from '~/composables/checkout/address/context/addressFormCheckoutContext';
import { useCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext';
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import type { UpdateDynamicFieldPayload, UpdateFieldPayload } from '~/types/address';

const {
	t,
	is_member,
} = useCheckoutExperienceFeatureContext();

const address_field_store = useAddressFieldStore();
const {
	form_state,
	form_field_errors,
	clearFormFieldError,
	populateDynamicFields,
} = useAddressFormCheckoutContext();

const shipping_form = computed(() => form_state.shipping);

const {
	selected_shipping_address,
	ship_to_another_address
} = storeToRefs(useMainCheckOutStore())

function updateShippingField(payload: UpdateFieldPayload) {
	Object.assign(shipping_form.value, {
		[payload.field]: payload.value,
	})

	clearFormFieldError(payload.field)
}

function updateShippingDynamicField(payload: UpdateDynamicFieldPayload) {
	shipping_form.value.fields[payload.field_key] = payload.value
	clearFormFieldError(`fields.${payload.field_key}`)
}

onMounted(async () => {
	if (address_field_store.dynamic_address_fields.length === 0) {
		await address_field_store.getDynamicFields()
	}

	populateDynamicFields('shipping')
})
</script>

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

		<AddressFormFields
			:form="shipping_form"
			:errors="form_field_errors"
			@update:field="updateShippingField"
			@update:dynamic-field="updateShippingDynamicField"
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