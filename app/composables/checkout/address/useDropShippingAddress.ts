import { useAddressFormCheckoutContext } from "./context/addressFormCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useAddressBookListCheckoutContext } from "./context/addressBookListCheckoutContext";
import { loadAddresses } from "~/services/user-address/user-address.service";
import { useAddressGeneralUICheckoutContext } from "./context/addressGeneralUICheckoutContext";
import { useAddressGeneral } from "./useAddressGeneral";

export function useDropShippingAddress() {

	/** Stores */
	const checkout_store = useMainCheckOutStore()
	const { openSelectAddressModal } = useAddressGeneralUICheckoutContext()

	/** Context */
	const { drop_address } = useAddressBookListCheckoutContext()

	const { assignAddressToForm } = useAddressGeneral()

	const {
		form_field_errors,
		drop_form,

		resetForm,
		updateFormFieldByType,
	} = useAddressFormCheckoutContext();

	async function setDropAddress() {
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