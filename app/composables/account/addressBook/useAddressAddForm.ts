import { addressFormDefaults } from "~/factories/address";
import type { AddFormState, AddressType, UpdateFieldPayload } from "~/types/address";

export function useAddressAddForm() {

	/**
     * Store
     */
	// const address_store = useAddressStore()

	/**
     * Variables
     */

	/** Modals */
	const is_add_modal_open = ref(false)

	/** Forms */
	const add_form_state = reactive<AddFormState>({
		shipping: addressFormDefaults('shipping'),
		billing: addressFormDefaults('billing'),
		drop: addressFormDefaults('drop'),
	})
	const add_form_type = ref<AddressType>('shipping')
	const active_add_form = computed(() => add_form_state[add_form_type.value])









	/**
     * Functions
     */
	function resetAddForm(type?: AddressType) {
		const target_type = type ?? add_form_type.value

		Object.assign(
			add_form_state[target_type],
			addressFormDefaults(target_type)
		)
	}

	/** Update the active form field from the modal */
	function updateActiveAddFormField(payload: UpdateFieldPayload) {
		console.log(payload);
		/** Write into the parent-owned form state */
		Object.assign(active_add_form.value, {
			[payload.field]: payload.value,
		})
	}

	/** Change the active add form type */
	function setAddFormType(type: AddressType) {
		add_form_type.value = type
	}

	async function addAddress() {

	}


	function openAddModal() {
		resetAddForm()
		is_add_modal_open.value = true
	}

	/** Close add modal and optionally reset the current active form */
	function closeAddModal(should_reset = false) {
		is_add_modal_open.value = false

		/** Reset only when requested */
		if (should_reset) {
			resetAddForm()
		}
	}

	return {
		add_form_type,
		active_add_form,

		is_add_modal_open,

		addAddress,
		openAddModal,
		closeAddModal,
		setAddFormType,
		resetAddForm,
		updateActiveAddFormField,
	}
}