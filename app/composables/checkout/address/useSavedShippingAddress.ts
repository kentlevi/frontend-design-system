import { useAddressBookListCheckoutContext } from "./context/addressBookListCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { mapAddressToForm } from "~/factories/address";
import { useAddressFieldStore } from "~/stores/address";

export function useSavedShippingAddress() {

	/** Stores */
	const address_field_store = useAddressFieldStore()
	const checkout_store = useMainCheckOutStore()

	const { shipping_address } = useAddressBookListCheckoutContext()

	function initShippingAddress() {
		const selected = shipping_address.value.find(a => a.is_default) ?? shipping_address.value[0] ?? null

		if (!selected) return

		const mapped_form = mapAddressToForm(selected, address_field_store.dynamic_address_fields)

		checkout_store.setShippingAddress(mapped_form)
		checkout_store.setShippingAddressId(selected.id)
	}

	onMounted(() => {
		initShippingAddress()
	})
}