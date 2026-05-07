import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useAddressFormCheckoutContext } from "./context/addressFormCheckoutContext";
import { useCheckoutExperienceFeatureContext } from "../checkoutExperienceFeatureContext";
import { ensureDynamicFields } from "~/services/address-dynamic-fields/dynamic-fields.service";

export function useManualShippingAddress() {

	/** Stores */
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
		form_field_errors,
		shipping_form,

		populateDynamicFields,
		clearFormFieldError,
		resetForm,
		updateFormFieldByType,
		updateDynamicFieldByType,
	} = useAddressFormCheckoutContext();

	resetForm('shipping')

	onMounted(async () => {
		await ensureDynamicFields()

		populateDynamicFields('shipping')
	})

	return {
		t,
		is_member,
		form_field_errors,
		shipping_form,
		ship_to_another_address,
		selected_shipping_address_id,

		clearFormFieldError,
		updateFormFieldByType,
		updateDynamicFieldByType,
	}
}