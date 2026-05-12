import type { AddressType } from "~/types/user-address";
import { useCheckoutTooltipState } from "../../features/useCheckoutTooltipState";

export function useAddressGeneralUI() {

	const {
		drop_shipping_tooltip_open,
		billing_tooltip_open,
		toggleDropShippingTooltip,
		toggleBillingTooltip,
	} = useCheckoutTooltipState()

	/** Shipping */

	/** Drop Shipping  */
	const drop_shipping_enabled = ref(false);

	/** Billing */
	const use_shipping_as_billing = ref(true);
	const is_billing_address_modal_open = ref(false);

	/** General */
	const active_address_type = ref<AddressType | null>(null)
	const is_select_address_modal_open = ref(false)

	function getAddressTagClass(label: string) {
		const lower_label = label.toLowerCase();
		if (lower_label.includes('office')) return 'checkout-member-address-tag--office';
		if (lower_label.includes('client')) return 'checkout-member-address-tag--client';
		return '';
	}

	function openSelectAddressModal(type: AddressType) {
		active_address_type.value = type
		is_select_address_modal_open.value = true
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
		drop_shipping_tooltip_open,
		drop_shipping_enabled,

		/** Functions */
		toggleDropShippingTooltip,



		/**
         * Billing
         */

		/** Variables */
		billing_tooltip_open,
		use_shipping_as_billing,
		is_billing_address_modal_open,

		/** Functions */
		toggleBillingTooltip,

		/**
         * General
         */

		/** Variables */
		is_select_address_modal_open,
		active_address_type,

		/** Functions */
		getAddressTagClass,
		openSelectAddressModal
	}
}