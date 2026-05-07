import { useAddressBookListCheckoutContext } from "./context/addressBookListCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useAddressFormCheckoutContext } from "./context/addressFormCheckoutContext";
import { loadAddresses } from "~/services/user-address/user-address.service";
import { useAddressGeneralUICheckoutContext } from "./context/addressGeneralUICheckoutContext";
import { useAddressGeneral } from "./useAddressGeneral";
import { ensureDynamicFields } from "~/services/address-dynamic-fields/dynamic-fields.service";

export function useSavedShippingAddress() {

	/** Stores */
	const checkout_store = useMainCheckOutStore()

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
		await ensureDynamicFields()

		initShippingAddress()
	})

	return {
		shipping_form,

		openSelectAddressModal,
	}
}