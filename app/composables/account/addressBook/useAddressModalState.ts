type AddressFormModalMode = 'create' | 'edit'

export function useAddressModalState() {
	const is_form_modal_open = ref(false)
	const form_modal_mode = ref<AddressFormModalMode>('create')

	const form_submit_label = computed(() => {
		return form_modal_mode.value === 'edit'
			? 'update'
			: 'save'
	})

	function setCreateMode() {
		form_modal_mode.value = 'create'
	}

	function setEditMode() {
		form_modal_mode.value = 'edit'
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

	function openEditFormModal() {
		setEditMode()
		openFormModal()
	}

	return {
		is_form_modal_open,
		form_modal_mode,
		form_submit_label,

		setCreateMode,
		setEditMode,
		openFormModal,
		closeFormModal,
		openCreateFormModal,
		openEditFormModal,
	}
}