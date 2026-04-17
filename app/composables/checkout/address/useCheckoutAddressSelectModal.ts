import { useMainCheckOutStore } from "~/stores/checkout/index.store"
import { useAddressGeneralUICheckoutContext } from "./context/addressGeneralUICheckoutContext"
import { useAddressBookListCheckoutContext } from "./context/addressBookListCheckoutContext"
import { useAddressHelper } from "~/utils/address"
import { useAddressGeneral } from "./useAddressGeneral"

export function useCheckoutAddressSelectModal() {

	/** Stores */
	const main_checkout_store = useMainCheckOutStore()
	const { shipping_address } = useAddressBookListCheckoutContext()

	/** Contexts */
	const { is_shipping_address_modal_open, getAddressTagClass } = useAddressGeneralUICheckoutContext()

	/** Helpers */
	const { buildAddressLines, shippingPhoneNumber } = useAddressHelper()

	const { assignAddressToForm } = useAddressGeneral()


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

		assignAddressToForm('shipping', pending_selected_address_id.value)

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