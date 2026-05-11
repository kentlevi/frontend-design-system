import { useMainCheckOutStore } from "~/stores/checkout/index.store"
import { useAddressGeneralUIContext } from "./context/addressGeneralUICheckoutContext"
import { useUserAddressDataCheckoutContext } from "./context/addressBookListCheckoutContext"
import { useAddressHelper } from "~/utils/address"
import { useAddressGeneral } from "./useAddressGeneral"

export function useCheckoutAddressSelectModal() {

	/** Stores */
	const main_checkout_store = useMainCheckOutStore()
	const { shipping_address, billing_address, drop_address } = useUserAddressDataCheckoutContext()

	/** Contexts */
	const {
		active_address_type,
		is_select_address_modal_open,

		getAddressTagClass
	} = useAddressGeneralUIContext()

	/** Helpers */
	const { buildAddressLines, shippingPhoneNumber } = useAddressHelper()

	const { assignAddressToForm } = useAddressGeneral()

	const { t: translate } = useI18n()

	/** Local draft state */
	const pending_selected_address_id = ref<number | null>(null)
	const address_map = {
		shipping: shipping_address,
		billing: billing_address,
		drop: drop_address
	}
	const addresses = computed(() => {
		if (!active_address_type.value) return []

		return address_map[active_address_type.value].value
	})
	const selected_id_map = {
		shipping: () => main_checkout_store.selected_shipping_address_id,
		billing: () => main_checkout_store.selected_billing_address_id,
		drop: () => main_checkout_store.selected_drop_address_id,
	}

	/**
	 * Initialize ONLY when modal opens
	 * (prevents overwriting user selection while modal is open)
	 */
	watch(
		() => is_select_address_modal_open.value,
		(isOpen) => {
			if (!isOpen || !active_address_type.value) return

			const type = active_address_type.value

			pending_selected_address_id.value =
				selected_id_map[type]()
		}
	)

	function confirmSelection() {
		if (!active_address_type.value || pending_selected_address_id.value === null) return

		assignAddressToForm(active_address_type.value, pending_selected_address_id.value)

		closeModal()
	}

	function closeModal() {
		active_address_type.value = null
		is_select_address_modal_open.value = false
	}

	return {
		translate,

		active_address_type,
		addresses,
		is_select_address_modal_open,
		pending_selected_address_id,
		shipping_address,

		closeModal,
		confirmSelection,
		getAddressTagClass,
		shippingPhoneNumber,
		buildAddressLines,
	}
}