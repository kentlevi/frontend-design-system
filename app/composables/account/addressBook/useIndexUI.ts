import { useUserAddressFormState } from "./context/useUserAddressFormState";
import { useUserAddressUIContext } from "./context/useUserAddressUIContext";

export function useIndexUI() {

	/**
     * Contexts
     */
	const {
		form_type,

		resetForm,
		clearFormFieldErrors,
		populateDynamicFields
	} = useUserAddressFormState()
	const {
		setCreateMode,
		openCreateFormModal
	} = useUserAddressUIContext()


	/**
     * Functions
     */
	function prepareCreateModal() {
		resetForm(form_type.value)
		clearFormFieldErrors()
		populateDynamicFields(form_type.value)
	}

	function handleOpenAddModal() {
		console.log('this is being used wtf heehehe');
		// resetEditState()
		setCreateMode()
		prepareCreateModal()
		openCreateFormModal()
	}

	return {
		handleOpenAddModal
	}
}