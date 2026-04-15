import { useAddressFormCheckoutContext } from "./context/addressFormCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useAddressBookListCheckoutContext } from "./context/addressBookListCheckoutContext";
import { useAddressFieldStore } from "~/stores/address";
import { addressFormDefaults, mapAddressToForm } from "~/factories/address";
import { loadAddresses } from "~/services/address/address.service";

export function useBillingAddress() {

	/** Stores */
	const address_field_store = useAddressFieldStore()
	const checkout_store = useMainCheckOutStore()

	/** Context */
	const { billing_address } = useAddressBookListCheckoutContext()

	const {
		form_state,
		form_field_errors,
		populateDynamicFields,

		updateFormFieldByType,
		updateDynamicFieldByType,
	} = useAddressFormCheckoutContext();

	const billing_form = computed(() => form_state.billing);

	async function setBillingAddress() {
		if (billing_address.value.length === 0) await loadAddresses('billing')

		const selected = billing_address.value.find(a => a.is_default) ?? billing_address.value[0] ?? null

		if (!selected) return

		const mapped_form = mapAddressToForm(selected, address_field_store.dynamic_address_fields)

		Object.assign(billing_form.value, mapped_form)
		checkout_store.setBillingAddressId(selected.id)
	}

	function resetForm() {
		Object.assign(
			billing_form.value,
			addressFormDefaults('billing')
		)
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
	}
}