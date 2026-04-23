import { useAddressFormCheckoutContext } from "./context/addressFormCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useAddressBookListCheckoutContext } from "./context/addressBookListCheckoutContext";
import { useAddressFieldStore } from "~/stores/user-address";
import { loadAddresses } from "~/services/user-address/user-address.service";
import { useAddressGeneralUICheckoutContext } from "./context/addressGeneralUICheckoutContext";
import { useAddressGeneral } from "./useAddressGeneral";

export function useBillingAddress() {

	/** Stores */
	const address_field_store = useAddressFieldStore()
	const checkout_store = useMainCheckOutStore()

	/** Context */
	const { billing_address } = useAddressBookListCheckoutContext()
	const { use_shipping_as_billing, billing_use_different_address, openSelectAddressModal } = useAddressGeneralUICheckoutContext()

	const { assignAddressToForm } = useAddressGeneral()

	const {
		form_field_errors,
		shipping_form,
		billing_form,

		populateDynamicFields,
		resetForm,
		updateFormFieldByType,
		updateDynamicFieldByType,
	} = useAddressFormCheckoutContext();

	async function setBillingAddress() {
		billing_use_different_address.value = false

		if (use_shipping_as_billing.value) {
			setBillingAsShipping()
			return;
		}

		if (billing_address.value.length === 0) await loadAddresses('billing')

		if (checkout_store.selected_billing_address_id) {
			assignAddressToForm('billing', checkout_store.selected_billing_address_id)
			return
		}

		assignAddressToForm('billing')
	}

	function setBillingAsShipping() {
		Object.assign(billing_form.value, shipping_form.value, {
			type: 'billing'
		})
	}

	watch(
		shipping_form,
		() => {
			if (use_shipping_as_billing.value) {
				setBillingAsShipping()
			}
		},
		{ deep: true }
	)

	onMounted(async () => {
		if (address_field_store.dynamic_address_fields.length === 0) {
			await address_field_store.getDynamicFields()
		}

		populateDynamicFields('billing')
	})

	return {
		billing_form,
		form_field_errors,

		updateFormFieldByType,
		updateDynamicFieldByType,

		resetForm,
		setBillingAddress,
		openSelectAddressModal,
	}
}