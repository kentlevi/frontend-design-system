import { addressFormDefaults } from "~/factories/address";
import { addUserAddress } from "~/services/profile/address.service";
import { useAddressFieldStore } from "~/stores/address";
import type { AddFormState, AddressType, DynamicFieldDefinition, UpdateDynamicFieldPayload, UpdateFieldPayload } from "~/types/address";

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
		// Check if object is empty (not array length)
		if (Object.keys(add_form_state[target_type].fields).length !== 0) return;

		// Use reduce to create object, not map for array
		const mappedFields = address_field_store.dynamic_address_fields.reduce((acc, field) => {
			acc[field.field_key] = ''  // Set empty string as default
			return acc
		}, {} as DynamicFieldDefinition)

		add_form_state[target_type].fields = mappedFields
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

		active_add_form.value.fields[payload.field_key] = payload.value
	}

	/** Change the active add form type */
	function setAddFormType(type: AddressType) {
		add_form_type.value = type
		populateDynamicFields(type)
	}

	async function addAddress() {
		try {
			const response = await addUserAddress(active_add_form.value)

			console.log(response);
		} catch (_error: unknown) {
			console.log(_error);
		}
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