import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useUserAddressFormStateCheckoutContext } from "./context/addressFormCheckoutContext";
import { useAddressGeneralUIContext } from "./context/addressGeneralUICheckoutContext";
import { useAddressGeneral } from "./useAddressGeneral";
import { ensureDynamicFields } from "~/services/address-dynamic-fields/dynamic-fields.service";
import { mapFormToAddress } from "~/factories/address";
import { useAddressFieldStore } from "~/stores/user-address";

export function useSavedShippingAddress() {

	/**
     * Stores
     */
	const address_field_store = useAddressFieldStore()
	const checkout_store = useMainCheckOutStore()
	const { shipping_ship_to_another_address,  } = storeToRefs(checkout_store)


	/**
     * Contexts
     */
	const { shipping_form } = useUserAddressFormStateCheckoutContext()
	const { openSelectAddressModal } = useAddressGeneralUIContext()


	/**
     * Helpers
     */
	const { assignAddressToForm } = useAddressGeneral()


	/**
     * Computed
     */
	const shipping_address = computed(() => {
		return mapFormToAddress(shipping_form.value, address_field_store.dynamic_address_fields)
	})


	/**
     * Watchers
     */
	watch(shipping_ship_to_another_address, (val) => {
		if (val) {
			checkout_store.setShippingAddressId(null)
		} else {
			initShippingAddress()
		}
	}, { immediate: true })


	/**
     * Functions
     */
	async function initShippingAddress() {
		if (checkout_store.selected_shipping_address_id) {
			assignAddressToForm('shipping', checkout_store.selected_shipping_address_id)
			return
		}

		assignAddressToForm('shipping')
	}

	onMounted(async() => {
		await ensureDynamicFields()
	})

	return {
		shipping_address,

		openSelectAddressModal,
	}
}