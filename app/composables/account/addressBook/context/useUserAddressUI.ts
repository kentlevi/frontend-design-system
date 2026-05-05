
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
	const is_delete_modal_open = ref(false)
	const is_default_shipping_modal_open = ref(false)
	const is_confirm_default_change_modal_open = ref(false)
	const form_modal_mode = ref<AddressFormModalMode | null>(null)



	/**
     * Computed
     */
	const form_submit_label = computed(() => {
		return form_modal_mode.value === 'edit'
			? 'update'
			: 'save'
	})



	/**
     * Functions
     */
	function setCreateMode() {
		form_modal_mode.value = 'create'
	}

	function setEditMode() {
		form_modal_mode.value = 'edit'
	}

	function openCreateFormModal() {
		setCreateMode()
		openFormModal()
	}

	function openEditFormModal() {
		setEditMode()
		openFormModal()
	}

	function openFormModal() {
		is_form_modal_open.value = true
	}

	function closeFormModal() {
		is_form_modal_open.value = false
		form_modal_mode.value = null
	}

	function openDeleteDialog() {
		is_delete_modal_open.value = true
	}

	function closeDeleteDialog() {
		is_delete_modal_open.value = false
	}

	function openDefaultShippingModal() {
		is_default_shipping_modal_open.value = true
	}

	function closeDefaultShippingModal() {
		is_default_shipping_modal_open.value = false
	}

	function openConfirmDefaultChangeModal() {
		is_confirm_default_change_modal_open.value = true
	}

	function closeConfirmDefaultChangeModal() {
		is_confirm_default_change_modal_open.value = false
	}

	return {
		is_form_modal_open,
		is_delete_modal_open,
		is_default_shipping_modal_open,
		form_modal_mode,
		form_submit_label,
		is_confirm_default_change_modal_open,

		setCreateMode,
		openCreateFormModal,
		openEditFormModal,
		closeFormModal,
		openDeleteDialog,
		closeDeleteDialog,
		openDefaultShippingModal,
		closeDefaultShippingModal,
		openConfirmDefaultChangeModal,
		closeConfirmDefaultChangeModal
	}
}