import { useUserAddressFormStateCheckoutContext } from "./context/addressFormCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useAddressGeneralUIContext } from "./context/addressGeneralUICheckoutContext";
import { useAddressGeneral } from "./useAddressGeneral";
import { ensureDynamicFields } from "~/services/address-dynamic-fields/dynamic-fields.service";
import { useAddressFieldStore } from "~/stores/user-address";
import { mapFormToAddress } from "~/factories/address";
import { useAddressHelper } from "~/utils/address";

export function useBillingAddress() {

	/**
     * Stores
     */
	const address_field_store = useAddressFieldStore()
	const checkout_store = useMainCheckOutStore()
	const { use_shipping_as_billing, billing_use_different_address } = storeToRefs(checkout_store)


	/**
     * Context
     */
	const { openSelectAddressModal } = useAddressGeneralUIContext()
	const {
		form_field_errors,
		shipping_form,
		billing_form,

		populateDynamicFields,
		resetForm,
		updateFormFieldByType,
		updateDynamicFieldByType,
	} = useUserAddressFormStateCheckoutContext();


	/**
     * Helpers
     */
	const { assignAddressToForm } = useAddressGeneral()
	const { buildAddressLines } = useAddressHelper()


	/**
     * Computed
     */
	const billing_address = computed(() => {
		return mapFormToAddress(billing_form.value, address_field_store.dynamic_address_fields)
	})


	/**
     * Watchers
     */
	watch(use_shipping_as_billing, (val) => {
		if (val) {
			checkout_store.setBillingAddressId(null)
		}
	})

	watch(billing_use_different_address, (val) => {
		if (val) {
			checkout_store.setBillingAddressId(null)
		}
	})

	watch(
		shipping_form,
		() => {
			if (use_shipping_as_billing.value) {
				setBillingAsShipping()
			}
		},
		{ deep: true }
	)


	/**
     * Functions
     */
	async function setBillingAddress() {
		billing_use_different_address.value = false

		if (use_shipping_as_billing.value) {
			setBillingAsShipping()
			return;
		}

		if (checkout_store.selected_billing_address_id) {
			assignAddressToForm('billing', checkout_store.selected_billing_address_id)
			return
		}

		assignAddressToForm('billing')
	}

	function setBillingAsShipping() {
		const { phone_number: _phone_number, ...shippingWithoutId } = shipping_form.value

		Object.assign(billing_form.value, shippingWithoutId, {
			type: 'billing'
		})
	}

	onMounted(async () => {
		await ensureDynamicFields()

		populateDynamicFields('billing')
	})

	return {
		billing_form,
		form_field_errors,
		billing_address,

		updateFormFieldByType,
		updateDynamicFieldByType,
		buildAddressLines,

		resetForm,
		setBillingAddress,
		openSelectAddressModal,
	}
}