import { useAddressFormActions } from "~/composables/shared/address/useAddressFormActions"
import { addressFormDefaults } from "~/factories/address"
import type { AddressFormState, AddressType } from "~/types/user-address"

export function useUserAddressFormState() {


	/**
     * Variables
     */
	const form_state = reactive<AddressFormState>({
		shipping: addressFormDefaults('shipping'),
		billing: addressFormDefaults('billing'),
		drop: addressFormDefaults('drop'),
	})
	const form_type = ref<AddressType>('shipping')
	const form_field_errors = ref<Record<AddressType, Record<string, string>>>({
		shipping: {},
		billing: {},
		drop: {},
	})
	const active_form = computed(() => form_state[form_type.value])
	const shipping_form = computed(() => form_state.shipping)
	const billing_form = computed(() => form_state.billing)
	const drop_form = computed(() => form_state.drop)


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
		form_state: form_state,
		form_type: toRef(form_type),
		form_field_errors: toRef(form_field_errors)
	})


	return {
		form_state,
		form_type,
		active_form,
		form_field_errors,
		shipping_form,
		billing_form,
		drop_form,

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