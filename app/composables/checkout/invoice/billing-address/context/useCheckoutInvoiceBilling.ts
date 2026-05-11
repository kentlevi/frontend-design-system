import { useAddressFormActions } from "~/composables/shared/address/useAddressFormActions"
import { addressFormDefaults, mapFormToAddress } from "~/factories/address"
import { useMainCheckOutStore } from "~/stores/checkout/index.store"
import { useAddressFieldStore } from "~/stores/user-address"
import type { AddressFormState, AddressType } from "~/types/user-address"

export function useCheckoutInvoiceBilling() {

	/**
     * Stores
     */
	const address_field_store = useAddressFieldStore()
	const main_checkout_store = useMainCheckOutStore()


	/**
     * Variables
     */
	const form_state = reactive<AddressFormState>({
		shipping: addressFormDefaults('shipping'),
		billing: reactive(structuredClone(toRaw(main_checkout_store.billing_form))),
		drop: addressFormDefaults('drop'),
	})
	const form_type = ref<AddressType>('billing')
	const form_field_errors = ref<Record<AddressType, Record<string, string>>>({
		shipping: {},
		billing: {},
		drop: {},
	})
	const billing_form = computed(() => form_state.billing)
	const billing_modal_open = ref(false)
	const billing_address = ref(mapFormToAddress(billing_form.value, address_field_store.dynamic_address_fields))


	/**
     * Functions
     */
	function openModal() {
		billing_modal_open.value = true
	}

	function closeModal() {
		billing_modal_open.value = false
	}

	const { updateFormFieldByType, updateDynamicFieldByType, setFormErrors, clearFormFieldErrors } = useAddressFormActions({
		form_state: form_state,
		form_type: toRef(form_type),
		form_field_errors: toRef(form_field_errors)
	})


	return {
		form_state,
		form_type,
		form_field_errors,
		billing_form,
		billing_modal_open,
		billing_address,

		updateFormFieldByType,
		updateDynamicFieldByType,
		setFormErrors,
		clearFormFieldErrors,
		openModal,
		closeModal,
	}
}