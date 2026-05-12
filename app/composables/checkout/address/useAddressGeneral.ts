import type { AddressType } from "~/types/user-address";
import { useUserAddressFormStateCheckoutContext } from "./context/addressFormCheckoutContext";
import { useUserAddressDataCheckoutContext } from "./context/addressBookListCheckoutContext";
import { mapAddressToForm } from "~/factories/address";
import { useAddressFieldStore } from "~/stores/user-address";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";

export function useAddressGeneral() {

	/** Stores */
	const main_checkout_store = useMainCheckOutStore()
	const { drop_shipping_enabled } = storeToRefs(main_checkout_store)
	const address_field_store = useAddressFieldStore()

	/** Contexts */
	const {
		shipping_form,
		billing_form,
		drop_form,
	} = useUserAddressFormStateCheckoutContext()

	const {
		shipping_address,
		billing_address,
		drop_address
	} = useUserAddressDataCheckoutContext()


	/**
     * Assign address to forma address
     *
     * If id is undefined, then get the default
     * else get the address with the same id as the parameter
     */
	function assignAddressToForm(
		type: AddressType,
		id?: number | null
	) {
		const form_map = {
			shipping: shipping_form,
			billing: billing_form,
			drop: drop_form,
		}

		const address_map = {
			shipping: shipping_address,
			billing: billing_address,
			drop: drop_address,
		}

		const setter_map = {
			shipping: (id: number) => main_checkout_store.setShippingAddressId(id),
			billing: (id: number) => main_checkout_store.setBillingAddressId(id),
			drop: (id: number) => main_checkout_store.setDropAddressId(id),
		}

		const form = form_map[type]
		const address_list = address_map[type]
		const setId = setter_map[type]

		if (!form || !address_list || !setId) return

		const selected =
			typeof id === 'number'
				? address_list.value.find(a => a.id === id)
				: address_list.value.find(a => a.is_default) ??
			  address_list.value[0] ??
			  null

		if (!selected) return

		const mapped_form = mapAddressToForm(
			selected,
			address_field_store.dynamic_address_fields
		)

		Object.assign(form.value, mapped_form)

		/** always use the actual selected id */
		setId(selected.id)
	}

	/**
     * Build complete checkout payload
     */
	function buildCompleteCheckoutPayload(order_id: number) {
		return {
			order_id,
			shipping_address: shipping_form.value,
			billing_address: billing_form.value,
			drop_address: drop_shipping_enabled.value ? drop_form.value : null
		}
	}


	return {
		/**
         * Shipping
         */

		/** Variables */

		/** Functions */



		/**
         * Drop Shipping
         */

		/** Variables */

		/** Functions */



		/**
         * Billing
         */

		/** Variables */

		/** Functions */

		/** General Functions */
		assignAddressToForm,
		buildCompleteCheckoutPayload,
	}
}