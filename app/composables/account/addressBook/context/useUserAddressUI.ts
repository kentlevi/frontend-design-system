
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
	const is_submitting = ref(false)



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
		form_modal_mode,
		form_submit_label,
		is_submitting,

		setCreateMode,
		openCreateFormModal,
		closeFormModal,
	}
}