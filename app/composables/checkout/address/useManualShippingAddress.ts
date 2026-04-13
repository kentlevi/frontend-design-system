import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useAddressFormCheckoutContext } from "./context/addressFormCheckoutContext";
import type { UpdateDynamicFieldPayload, UpdateFieldPayload } from "~/types/address";
import { useAddressFieldStore } from "~/stores/address";
import { useCheckoutExperienceFeatureContext } from "../checkoutExperienceFeatureContext";

export function useManualShippingAddress() {

	/** Stores */
	const address_field_store = useAddressFieldStore();
	const checkout_store = useMainCheckOutStore()
	const {
		selected_shipping_address,
		ship_to_another_address,
	} = storeToRefs(checkout_store)
	const { clearShippingAddress } = checkout_store



	const {
		t,
		is_member,
	} = useCheckoutExperienceFeatureContext();

	const {
		form_state,
		form_field_errors,
		clearFormFieldError,
		populateDynamicFields,
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



	/** Clear data before component mounts */
	clearShippingAddress()

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
		selected_shipping_address,
		ship_to_another_address,

		clearFormFieldError,
		populateDynamicFields,
		updateShippingField,
		updateShippingDynamicField,
	}
}