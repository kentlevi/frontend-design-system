import { useAddressFormCheckoutContext } from "./context/addressFormCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useAddressBookListCheckoutContext } from "./context/addressBookListCheckoutContext";
import { useAddressFieldStore } from "~/stores/address";
import { mapAddressToForm } from "~/factories/address";
import { loadAddresses } from "~/services/address/address.service";

export function useDropShippingAddress() {

	/** Stores */
	const address_field_store = useAddressFieldStore()
	const checkout_store = useMainCheckOutStore()

	/** Context */
	const { drop_address } = useAddressBookListCheckoutContext()

	const {
		form_field_errors,
		drop_form,

		resetForm,
		updateFormFieldByType,
	} = useAddressFormCheckoutContext();

	async function setDropAddress() {
		if (drop_address.value.length === 0) await loadAddresses('drop')

		const selected = drop_address.value.find(a => a.is_default) ?? drop_address.value[0] ?? null

		if (!selected) return

		const mapped_form = mapAddressToForm(selected, address_field_store.dynamic_address_fields)
		Object.assign(drop_form.value, mapped_form)
		checkout_store.setDropAddressId(selected.id)
	}

	return {
		drop_form,
		form_field_errors,
		updateFormFieldByType,

		setDropAddress,
		resetForm,
	}
}