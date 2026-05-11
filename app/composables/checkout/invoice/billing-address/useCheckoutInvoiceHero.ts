import { useAddressHelper } from "~/utils/address";
import { useCheckoutInvoiceBillingContext } from "./context/useCheckoutInvoiceBillingContext";

export function useCheckoutInvoiceHero() {

	/**
     * Contexts
     */
	const { billing_address, openModal } = useCheckoutInvoiceBillingContext()


	/**
     * Helpers
     */
	const { t: translate } = useI18n();
	const { buildAddressLines } = useAddressHelper()


	return {
		translate,

		billing_address,

		buildAddressLines,
		openModal,
	}
}