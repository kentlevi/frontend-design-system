import type { useUserAddressFormState } from "./context/useUserAddressFormState";
import type { useUserAddressUI } from "./context/useUserAddressUI";

type UserAddressUIContext = ReturnType<typeof useUserAddressUI>
type UserAddressFormStateContext = ReturnType<typeof useUserAddressFormState>

export function useIndexUI(
	ui: UserAddressUIContext,
	state: UserAddressFormStateContext
) {



	/**
     * Functions
     */
	function prepareCreateModal() {
		state.resetForm(state.form_type.value)
		state.clearFormFieldErrors()
		state.populateDynamicFields(state.form_type.value)
	}

	function handleOpenAddModal() {
		console.log('this is being used wtf heehehe');
		// resetEditState()
		ui.setCreateMode()
		prepareCreateModal()
		ui.openCreateFormModal()
	}

	return {
		handleOpenAddModal
	}
}