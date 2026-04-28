import { useAddressBookListCheckoutContext } from "./context/addressBookListCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useAddressFormCheckoutContext } from "./context/addressFormCheckoutContext";
import { loadAddresses } from "~/services/user-address/user-address.service";
import { useAddressGeneralUICheckoutContext } from "./context/addressGeneralUICheckoutContext";
import { useAddressGeneral } from "./useAddressGeneral";
import { useAddressFieldStore } from "~/stores/user-address";

export function useSavedShippingAddress() {

	/** Stores */
	const checkout_store = useMainCheckOutStore()
	const address_field_store = useAddressFieldStore()

	/** Contexts */
	const { shipping_address } = useAddressBookListCheckoutContext()
	const { shipping_form } = useAddressFormCheckoutContext()
	const { openSelectAddressModal } = useAddressGeneralUICheckoutContext()

	const { assignAddressToForm } = useAddressGeneral()

	async function initShippingAddress() {
		if (shipping_address.value.length === 0) await loadAddresses('shipping')

		if (checkout_store.selected_shipping_address_id) {
			assignAddressToForm('shipping', checkout_store.selected_shipping_address_id)
			return
		}

		assignAddressToForm('shipping')
	}

	onMounted(async() => {
		if (address_field_store.dynamic_address_fields.length === 0) {
			await address_field_store.getDynamicFields()
		}

		initShippingAddress()
	})

	return {
		shipping_form,

		openSelectAddressModal,
	}
}