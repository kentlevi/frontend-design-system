import { useAddressFieldStore } from "~/stores/user-address";
import { useCheckoutInvoiceBillingContext } from "./context/useCheckoutInvoiceBillingContext";
import { mapFormToAddress } from "~/factories/address";
import { validateAddress } from "~/services/address/address.service";
import { useAddressHelper } from "~/utils/address";

export function useCheckoutInvoiceBillingModal() {

	/**
     * Contexts
     */
	const {
		form_field_errors,
		billing_modal_open,
		billing_form,
		billing_address,

		updateFormFieldByType,
		updateDynamicFieldByType,
		setFormErrors,
		clearFormFieldErrors,
		closeModal
	} = useCheckoutInvoiceBillingContext()


	/**
     * Stores
     */
	const address_field_store = useAddressFieldStore()
	const toast_store = useToastStore()


	/**
     * Helpers
     */
	const { t: translate } = useI18n();
	const { mapApiFieldErrors } = useAddressHelper()


	/**
     * Functions
     */
	async function saveBillingDetails() {
		clearFormFieldErrors()

		const response = await validateAddress(billing_form.value)

		if (!response?.success) {
			const next_errors = mapApiFieldErrors(response?.data)
			setFormErrors(billing_form.value.type, next_errors)
			return
		}

		billing_address.value = mapFormToAddress(billing_form.value, address_field_store.dynamic_address_fields)

		toast_store.showToastWithTimer({
			message: translate('checkout.invoice.billingToast'),
			tone: 'primary',
		})
		closeModal()
	}


	return {
		translate,

		billing_modal_open,
		billing_form,
		form_field_errors,

		updateFormFieldByType,
		updateDynamicFieldByType,
		closeModal,
		saveBillingDetails,
	}
}