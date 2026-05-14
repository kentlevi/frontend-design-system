import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useUserAddressFormStateCheckoutContext } from "./context/addressFormCheckoutContext";
import { useCheckoutExperienceFeatureContext } from "../checkoutExperienceFeatureContext";
import { ensureDynamicFields } from "~/services/address-dynamic-fields/dynamic-fields.service";

export function useManualShippingAddress() {

	/**
     * Stores
     */
	const checkout_store = useMainCheckOutStore()
	const { shipping_ship_to_another_address, selected_shipping_address_id } = storeToRefs(checkout_store)


	/**
     * Contexts
     */
	const { is_member } = useCheckoutExperienceFeatureContext();
	const {
		form_field_errors,
		shipping_form,

		populateDynamicFields,
		clearFormFieldError,
		updateFormFieldByType,
		updateDynamicFieldByType,
	} = useUserAddressFormStateCheckoutContext();


	const { t: translate } = useI18n()


	onMounted(async () => {
		await ensureDynamicFields()

		populateDynamicFields('shipping')
	})


	return {
		translate,
		is_member,
		form_field_errors,
		shipping_form,
		shipping_ship_to_another_address,
		selected_shipping_address_id,

		clearFormFieldError,
		updateFormFieldByType,
		updateDynamicFieldByType,
	}
}