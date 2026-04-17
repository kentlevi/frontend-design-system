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
	const { openSelectAddressModal } = useAddressGeneralUICheckoutContext()

	const { assignAddressToForm } = useAddressGeneral()

	const {
		form_field_errors,
		billing_form,

		populateDynamicFields,
		resetForm,
		updateFormFieldByType,
		updateDynamicFieldByType,
	} = useAddressFormCheckoutContext();

	async function setBillingAddress() {
		if (billing_address.value.length === 0) await loadAddresses('billing')

		if (checkout_store.selected_drop_address_id) {
			assignAddressToForm('billing', checkout_store.selected_drop_address_id)
			return
		}

		assignAddressToForm('billing')
	}

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