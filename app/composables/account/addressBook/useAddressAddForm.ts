import { addressFormDefaults } from "~/factories/address";
import { useAddressFieldStore } from "~/stores/address";
import type { AddFormState, AddressType, UpdateDynamicFieldPayload, UpdateFieldPayload } from "~/types/address";

export function useAddressAddForm() {

	/**
     * Store
     */
	// const address_store = useAddressStore()
	const address_field_store = useAddressFieldStore()

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

	/** Transform store fields into form fields with empty values */
	function populateDynamicFields(target_type: AddressType) {
		if (add_form_state[target_type].dynamic_fields.length !== 0) return;

		const mappedFields = address_field_store.dynamic_address_fields.map(field => ({
			...field,
			value: ''            // Start with empty value
		}))

		add_form_state[target_type].dynamic_fields = mappedFields
	}

	function resetAddForm(type?: AddressType) {
		const target_type = type ?? add_form_type.value

		Object.assign(
			add_form_state[target_type],
			addressFormDefaults(target_type)
		)

		populateDynamicFields(target_type)
	}

	/** Update the active form field from the modal */
	function updateActiveAddFormField(payload: UpdateFieldPayload) {

		/** Write into the parent-owned form state */
		Object.assign(active_add_form.value, {
			[payload.field]: payload.value,
		})
	}

	/** Update one dynamic field value in the active form */
	function updateActiveDynamicField(payload: UpdateDynamicFieldPayload) {

		const target_field = active_add_form.value.dynamic_fields.find(
			field => field.field_key === payload.field_key
		)

		/** Stop if the field does not exist */
		if (!target_field) {
			return
		}

		target_field.value = payload.value
	}

	/** Change the active add form type */
	function setAddFormType(type: AddressType) {
		add_form_type.value = type
		populateDynamicFields(type)
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
		updateActiveDynamicField,
	}
}