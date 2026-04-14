import type { UpdateFieldPayload } from "~/types/address";
import { useAddressFormCheckoutContext } from "./context/addressFormCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useAddressBookListCheckoutContext } from "./context/addressBookListCheckoutContext";
import { useAddressFieldStore } from "~/stores/address";
import { mapAddressToForm } from "~/factories/address";

export function useDropShippingAddress() {

	/** Stores */
	const address_field_store = useAddressFieldStore()
	const checkout_store = useMainCheckOutStore()
	const { clearDropAddress } = checkout_store

	/** Context */
	const { drop_address } = useAddressBookListCheckoutContext()

	const {
		form_state,
		form_field_errors,
		clearFormFieldError,
	} = useAddressFormCheckoutContext();

	const drop_form = computed(() => form_state.drop);

	function updateDropField(payload: UpdateFieldPayload) {
		Object.assign(drop_form.value, {
			[payload.field]: payload.value,
		})

		clearFormFieldError(payload.field)
	}

	function setDropAddress() {
		const selected = drop_address.value.find(a => a.is_default) ?? drop_address.value[0] ?? null

		if (!selected) return

		const mapped_form = mapAddressToForm(selected, address_field_store.dynamic_address_fields)

		checkout_store.setDropAddress(mapped_form)
		checkout_store.setDropAddressId(selected.id)
	}

	return {
		drop_form,
		form_field_errors,
		updateDropField,

		clearDropAddress,
		setDropAddress,
	}
}