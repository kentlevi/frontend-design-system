import { useUserAddressFormStateCheckoutContext } from "./context/addressFormCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useAddressGeneralUIContext } from "./context/addressGeneralUICheckoutContext";
import { useAddressGeneral } from "./useAddressGeneral";

export function useDropShippingAddress() {

	/**
     * Stores
     */
	const checkout_store = useMainCheckOutStore()
	const { drop_shipping_enabled, drop_shipping_ship_to_another_address } = storeToRefs(checkout_store)
	const { openSelectAddressModal } = useAddressGeneralUIContext()


	/**
     * Contexts
     */
	const {
		form_field_errors,
		drop_form,

		resetForm,
		updateFormFieldByType,
	} = useUserAddressFormStateCheckoutContext();


	/**
     * Helpers
     */
	const { assignAddressToForm } = useAddressGeneral()


	/**
     * Watchers
     */
	watch(drop_shipping_enabled, (val) => {
		if (val) {
			setDropAddress()
		} else {
			resetForm('drop')
			checkout_store.setDropAddressId(null)
		}
	})

	watch(drop_shipping_ship_to_another_address, (val) => {
		if (val) {
			checkout_store.setDropAddressId(null)
		}
	})


	/**
     * Functions
     */
	async function setDropAddress() {
		if (checkout_store.selected_drop_address_id) {
			assignAddressToForm('drop', checkout_store.selected_drop_address_id)
			return
		}

		assignAddressToForm('drop')
	}


	return {
		drop_form,
		form_field_errors,
		updateFormFieldByType,

		setDropAddress,
		resetForm,
		openSelectAddressModal,
	}
}