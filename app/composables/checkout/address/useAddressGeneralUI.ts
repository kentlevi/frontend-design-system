import { useCheckoutTooltipState } from "../features/useCheckoutTooltipState";

export function useAddressGeneralUI() {

	const {
		drop_shipping_tooltip_open,
		billing_tooltip_open,
		toggleDropShippingTooltip,
		toggleBillingTooltip,
	} = useCheckoutTooltipState()

	/** Shipping */
	const is_shipping_address_modal_open = ref(false)

	/** Drop Shipping  */
	const drop_shipping_enabled = ref(false);
	const is_drop_shipping_address_modal_open = ref(false);

	/** Billing */
	const use_shipping_as_billing = ref(true);
	const billing_use_different_address = ref(false);
	const is_billing_address_modal_open = ref(false);

	/** General Function */
	function getAddressTagClass(label: string) {
		const lower_label = label.toLowerCase();
		if (lower_label.includes('office')) return 'checkout-member-address-tag--office';
		if (lower_label.includes('client')) return 'checkout-member-address-tag--client';
		return '';
	}


	return {
		/**
         * Shipping
         */

		/** Variables */
		is_shipping_address_modal_open,



		/**
         * Drop Shipping
         */

		/** Variables */
		drop_shipping_tooltip_open,
		drop_shipping_enabled,
		is_drop_shipping_address_modal_open,

		/** Functions */
		toggleDropShippingTooltip,



		/**
         * Billing
         */

		/** Variables */
		billing_tooltip_open,
		use_shipping_as_billing,
		billing_use_different_address,
		is_billing_address_modal_open,

		/** Functions */
		toggleBillingTooltip,

		/** General Functions */
		getAddressTagClass
	}
}