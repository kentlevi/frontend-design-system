import { useUserAddressFormStateCheckoutContext } from "./context/addressFormCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useUserAddressDataCheckoutContext } from "./context/addressBookListCheckoutContext";
import { loadAddresses } from "~/services/user-address/user-address.service";
import { useAddressGeneralUIContext } from "./context/addressGeneralUICheckoutContext";
import { useAddressGeneral } from "./useAddressGeneral";

export function useDropShippingAddress() {

	/** Stores */
	const checkout_store = useMainCheckOutStore()
	const { drop_shipping_ship_to_another_address, openSelectAddressModal } = useAddressGeneralUIContext()

	/** Context */
	const { drop_address } = useUserAddressDataCheckoutContext()

	const { assignAddressToForm } = useAddressGeneral()

	const {
		form_field_errors,
		drop_form,

		resetForm,
		updateFormFieldByType,
	} = useUserAddressFormStateCheckoutContext();

	async function setDropAddress() {
		drop_shipping_ship_to_another_address.value = false

		if (drop_address.value.length === 0) await loadAddresses('drop')

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