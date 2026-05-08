import { loadAddresses } from "~/services/user-address/user-address.service";
import { useUserAddressFormStateContext } from "./context/useUserAddressFormStateContext";
import { useUserAddressUIContext } from "./context/useUserAddressUIContext";
import { ensureDynamicFields } from "~/services/address-dynamic-fields/dynamic-fields.service";
import { useUserAddressDataContext } from "./context/useUserAddressDataContext";

export function useIndexUI() {
	loadAddresses('shipping')
	loadAddresses('billing')
	loadAddresses('drop')
	ensureDynamicFields()


	/**
     * Contexts
     */
	const {
		form_type,

		resetForm,
		clearFormFieldErrors,
		populateDynamicFields
	} = useUserAddressFormStateContext()
	const {
		setCreateMode,
		openCreateFormModal
	} = useUserAddressUIContext()
	const {
		sections,
		is_loading,
		has_addresses,
	} = useUserAddressDataContext()


	/**
     * Helpers
     */
	const { t: translate } = useI18n();


	/**
     * Functions
     */
	function prepareCreateModal() {
		resetForm(form_type.value)
		clearFormFieldErrors()
		populateDynamicFields(form_type.value)
	}

	function handleOpenAddModal() {
		setCreateMode()
		prepareCreateModal()
		openCreateFormModal()
	}

	return {
		translate,

		sections,
		is_loading,
		has_addresses,

		handleOpenAddModal
	}
}