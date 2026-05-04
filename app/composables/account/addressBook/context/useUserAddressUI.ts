
export function useUserAddressUI() {
	/** GENERAL ADDRESS CONTEXT */

	/**
     * Types
     */
	type AddressFormModalMode = 'create' | 'edit'



	/**
     * Variables
     */
	const is_form_modal_open = ref(false)
	const form_modal_mode = ref<AddressFormModalMode>('create')



	/**
     * Functions
     */
	function setCreateMode() {
		form_modal_mode.value = 'create'
	}

	function openFormModal() {
		is_form_modal_open.value = true
	}

	function closeFormModal() {
		is_form_modal_open.value = false
	}

	function openCreateFormModal() {
		setCreateMode()
		openFormModal()
	}

	return {
		is_form_modal_open,

		setCreateMode,
		openCreateFormModal,
		closeFormModal,
	}
}