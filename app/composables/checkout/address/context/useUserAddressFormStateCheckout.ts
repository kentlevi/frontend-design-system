import { useAddressFormActions } from "~/composables/shared/address/useAddressFormActions"
import { useMainCheckOutStore } from "~/stores/checkout/index.store"

export function useUserAddressFormStateCheckout() {


	/**
     * Store
     */
	const checkout_store = useMainCheckOutStore()


	/**
     * Functions
     */
	const {
		populateDynamicFields,
		setFormType,
		resetForm,
		clearFormFieldErrors,
		clearFormFieldError,
		setFormErrors,
		updateFormFieldByType,
		updateDynamicFieldByType
	} = useAddressFormActions({
		form_state: checkout_store.form_state,
		form_type: toRef(checkout_store, 'form_type'),
		form_field_errors: toRef(checkout_store, 'form_field_errors')
	})


	return {
		...storeToRefs(checkout_store),

		setFormType,
		populateDynamicFields,
		clearFormFieldError,
		clearFormFieldErrors,
		setFormErrors,

		updateFormFieldByType,
		updateDynamicFieldByType,

		resetForm,
	}
}