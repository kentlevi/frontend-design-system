import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useAddressFormCheckoutContext } from "./context/addressFormCheckoutContext";
import type { UpdateDynamicFieldPayload, UpdateFieldPayload } from "~/types/address";
import { useCheckoutExperienceFeatureContext } from "../checkoutExperienceFeatureContext";
import { addressFormDefaults } from "~/factories/address";
import { useAddressFieldStore } from "~/stores/address";

export function useManualShippingAddress() {

	/** Stores */
	const address_field_store = useAddressFieldStore()
	const checkout_store = useMainCheckOutStore()
	const {
		ship_to_another_address,
		selected_shipping_address_id,
	} = storeToRefs(checkout_store)



	const {
		t,
		is_member,
	} = useCheckoutExperienceFeatureContext();

	const {
		form_state,
		form_field_errors,
		populateDynamicFields,
		clearFormFieldError,
	} = useAddressFormCheckoutContext();

	const shipping_form = computed(() => form_state.shipping);



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

	function resetForm() {
		Object.assign(
			shipping_form.value,
			addressFormDefaults('shipping')
		)
	}

	resetForm()

	onMounted(async () => {
		if (address_field_store.dynamic_address_fields.length === 0) {
			await address_field_store.getDynamicFields()
		}

		populateDynamicFields('shipping')
	})

	return {
		t,
		is_member,
		form_state,
		form_field_errors,
		shipping_form,
		ship_to_another_address,
		selected_shipping_address_id,

		clearFormFieldError,
		updateShippingField,
		updateShippingDynamicField,
	}
}