import { useMainCheckOutStore } from "~/stores/checkout/index.store"
import { useAddressGeneralUICheckoutContext } from "./context/addressGeneralUICheckoutContext"
import { useAddressBookListCheckoutContext } from "./context/addressBookListCheckoutContext"
import { useAddressHelper } from "~/utils/address"
import { useAddressFormCheckoutContext } from "./context/addressFormCheckoutContext"
import { mapAddressToForm } from "~/factories/address"
import { useAddressFieldStore } from "~/stores/user-address"

export function useCheckoutAddressSelectModal() {

	/** Stores */
	const main_checkout_store = useMainCheckOutStore()
	const address_field_store = useAddressFieldStore()
	const { shipping_address } = useAddressBookListCheckoutContext()

	/** Contexts */
	const { is_shipping_address_modal_open, getAddressTagClass } = useAddressGeneralUICheckoutContext()
	const { shipping_form } = useAddressFormCheckoutContext()

	/** Helpers */
	const { buildAddressLines, shippingPhoneNumber } = useAddressHelper()


	const { t: translate } = useI18n()

	/** Local draft state */
	const pending_selected_address_id = ref<number | null>(null)

	/**
	 * Initialize ONLY when modal opens
	 * (prevents overwriting user selection while modal is open)
	 */
	watch(
		() => is_shipping_address_modal_open.value,
		(isOpen) => {
			if (isOpen) {
				pending_selected_address_id.value =
					main_checkout_store.selected_shipping_address_id
			}
		}
	)

	function closeModal() {
		is_shipping_address_modal_open.value = false
	}

	function confirmSelection() {
		if (!pending_selected_address_id.value) return

		const selected = shipping_address.value.find(a => a.id === pending_selected_address_id.value)

		if (!selected) return

		const mapped_form = mapAddressToForm(selected, address_field_store.dynamic_address_fields)
		Object.assign(shipping_form.value, mapped_form)
		main_checkout_store.setShippingAddressId(pending_selected_address_id.value)

		closeModal()
	}

	return {
		translate,

		is_shipping_address_modal_open,
		pending_selected_address_id,
		shipping_address,

		closeModal,
		confirmSelection,
		getAddressTagClass,
		shippingPhoneNumber,
		buildAddressLines,
	}
}