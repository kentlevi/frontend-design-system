import { useAddressBookListCheckoutContext } from "./context/addressBookListCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { mapAddressToForm } from "~/factories/address";
import { useAddressFieldStore } from "~/stores/address";
import { useAddressFormCheckoutContext } from "./context/addressFormCheckoutContext";
import { loadAddresses } from "~/services/address/address.service";

export function useSavedShippingAddress() {

	/** Stores */
	const address_field_store = useAddressFieldStore()
	const checkout_store = useMainCheckOutStore()

	/** Contexts */
	const { shipping_address } = useAddressBookListCheckoutContext()
	const { shipping_form } = useAddressFormCheckoutContext()

	async function initShippingAddress() {
		if (shipping_address.value.length === 0) await loadAddresses('shipping')

		const selected = shipping_address.value.find(a => a.is_default) ?? shipping_address.value[0] ?? null

		if (!selected) return

		const mapped_form = mapAddressToForm(selected, address_field_store.dynamic_address_fields)
		Object.assign(shipping_form.value, mapped_form)
		checkout_store.setShippingAddressId(selected.id)
	}

	onMounted(() => {
		initShippingAddress()
	})

	return {
		shipping_form
	}
}