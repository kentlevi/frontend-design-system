import { addressFormDefaults } from "~/factories/address";
import { addUserAddress, fetchUserAddresses } from "~/services/profile/address.service";
import { useAddressFieldStore, useAddressStore } from "~/stores/address";
import type { AddFormState, AddressFormMap, AddressMap, AddressType, DynamicFieldDefinition, UpdateDynamicFieldPayload, UpdateFieldPayload } from "~/types/address";

export function useAddressAddForm() {
	type AddressModalMode = 'add' | 'edit'

	/**
     * Store
     */
	// const address_store = useAddressStore()
	const address_field_store = useAddressFieldStore()
	const address_store = useAddressStore()
	const toast_store = useToastStore()
	const loading_overlay_store = useLoadingOverlayStore()

	/**
     * Variables
     */

	/** Modals */
	const is_add_modal_open = ref(false)
	const address_modal_mode = ref<AddressModalMode>('add')
	const editing_address_id = ref<number | null>(null)
	const editing_address_snapshot = ref<AddressMap[AddressType] | null>(null)

	/** Forms */
	const add_form_state = reactive<AddFormState>({
		shipping: addressFormDefaults('shipping'),
		billing: addressFormDefaults('billing'),
		drop: addressFormDefaults('drop'),
	})
	const add_form_type = ref<AddressType>('shipping')
	const active_add_form = computed(() => add_form_state[add_form_type.value])
	const field_errors = ref<Record<string, string>>({})

	const modal_submit_label = computed(() => {
		return address_modal_mode.value === 'edit'
			? 'update'
			: 'save'
	})

	/**
     * Functions
     */

	/** Transform store fields into form fields with empty values */
	function populateDynamicFields(target_type: AddressType) {
		if (target_type === 'drop') return

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

		clearFieldErrors()
		populateDynamicFields(target_type)
	}

	function clearFieldErrors() {
		field_errors.value = {}
	}

	function clearFieldError(field_key: string) {
		if (!field_errors.value[field_key]) return

		field_errors.value = Object.fromEntries(
			Object.entries(field_errors.value).filter(([key]) => key !== field_key)
		)
	}

	function hasAddressLines(form: AddressFormMap[AddressType]) {
		return form.type !== 'drop'
	}

	/** Update the active form field from the modal */
	function updateActiveAddFormField(payload: UpdateFieldPayload) {

		/** Write into the parent-owned form state */
		Object.assign(active_add_form.value, {
			[payload.field]: payload.value,
		})

		clearFieldError(payload.field)
	}

	/** Update one dynamic field value in the active form */
	function updateActiveDynamicField(payload: UpdateDynamicFieldPayload) {
		if (active_add_form.value.type === 'drop') return
		active_add_form.value.fields[payload.field_key] = payload.value
		clearFieldError(`fields.${payload.field_key}`)
	}

	/** Change the active add form type */
	function setAddFormType(type: AddressType) {
		add_form_type.value = type
		clearFieldErrors()
		populateDynamicFields(type)
	}

	function validateActiveForm() {
		const next_errors: Record<string, string> = {}
		const required_message = 'Required.'
		const active_form = active_add_form.value

		if (!active_form.contact_name.trim()) {
			next_errors.contact_name = required_message
		}

		if (hasAddressLines(active_form)) {
			if (!active_form.address_line_1.trim()) {
				next_errors.address_line_1 = required_message
			}

			if (!active_form.postcode.trim()) {
				next_errors.postcode = required_message
			}

			if (active_form.type === 'shipping' && !active_form.phone_number.trim()) {
				next_errors.phone_number = required_message
			}

			address_field_store.dynamic_address_fields.forEach((field) => {
				if (!field.is_required) return

				const value = active_form.fields[field.field_key]
				const normalized_value = typeof value === 'number'
					? String(value)
					: (value ?? '').toString().trim()

				if (!normalized_value) {
					next_errors[`fields.${field.field_key}`] = required_message
				}
			})
		}

		field_errors.value = next_errors

		return Object.keys(next_errors).length === 0
	}

	function mapAddressToForm<T extends AddressType>(
		address: AddressMap[T]
	): AddressFormMap[T] {
		if (address.type === 'drop') {
			return {
				type: 'drop',
				country_id: address.country_id,
				label: address.label,
				contact_name: address.contact_name,
				company: address.company ?? '',
				email: address.email ?? '',
				is_default: address.is_default,
				notes: address.notes ?? '',
			} as AddressFormMap[T]
		}

		const fields = address.dynamic_fields.reduce((acc, field) => {
			acc[field.field_key] = field.value ?? ''
			return acc
		}, {} as DynamicFieldDefinition)

		if (address.type === 'shipping') {
			return {
				type: 'shipping',
				country_id: address.country_id,
				label: address.label,
				contact_name: address.contact_name,
				company: address.company ?? '',
				email: address.email ?? '',
				is_default: address.is_default,
				notes: address.notes ?? '',
				address_line_1: address.address_line_1,
				address_line_2: address.address_line_2 ?? '',
				fields,
				postcode: address.postcode,
				phone_number: address.phone_number ?? '',
			} as AddressFormMap[T]
		}

		return {
			type: 'billing',
			country_id: address.country_id,
			label: address.label,
			contact_name: address.contact_name,
			company: address.company ?? '',
			email: address.email ?? '',
			is_default: address.is_default,
			notes: address.notes ?? '',
			address_line_1: address.address_line_1,
			address_line_2: address.address_line_2 ?? '',
			fields,
			postcode: address.postcode,
		} as AddressFormMap[T]
	}

	async function addAddress() {
		closeAddModal()
		startRequestOverlay()


		const type = add_form_type.value;
		const payload = { ...active_add_form.value };
		try {
			const response = await addUserAddress(payload)

			if (response?.success) {
				const list_response = await fetchUserAddresses({ type });

				if (list_response.success && Array.isArray(list_response.data)) {
					address_store.setAddresses(type, list_response.data);
				}

				resetAddForm(type);
			} else {
				openAddModal();
			}

			toast_store.handleApiResponse(response)
		} catch (_error: unknown) {
			console.log(_error);
			openAddModal();
		} finally {
			loading_overlay_store.stopLoading('add_address')
		}
	}

	function updateAddressLocally() {
		if (editing_address_id.value === null || !editing_address_snapshot.value) {
			closeAddModal()
			return
		}

		const type = add_form_type.value
		const editing_address = editing_address_snapshot.value

		if (type === 'drop') {
			address_store.updateAddress(type, {
				...editing_address,
				...add_form_state.drop,
				type: 'drop',
			})
		}

		if (type === 'billing') {
			const { fields, ...billing_form } = add_form_state.billing

			address_store.updateAddress(type, {
				...editing_address,
				...billing_form,
				id: editing_address_id.value,
				type: 'billing',
				dynamic_fields: address_field_store.dynamic_address_fields.map(field => ({
					...field,
					value: String(fields[field.field_key] ?? ''),
				})),
			})
		}

		if (type === 'shipping') {
			const { fields, ...shipping_form } = add_form_state.shipping

			address_store.updateAddress(type, {
				...editing_address,
				...shipping_form,
				id: editing_address_id.value,
				type: 'shipping',
				dynamic_fields: address_field_store.dynamic_address_fields.map(field => ({
					...field,
					value: String(fields[field.field_key] ?? ''),
				})),
			})
		}

		closeAddModal()
		toast_store.showToastWithTimer({
			message: 'Your address has been updated.',
			tone: 'primary',
			dismissible: true,
			variant: 'default',
		})
	}

	function saveAddress() {
		if (!validateActiveForm()) {
			return
		}

		if (address_modal_mode.value === 'edit') {
			updateAddressLocally()
			return
		}

		return addAddress()
	}

	function openAddModal() {
		address_modal_mode.value = 'add'
		editing_address_id.value = null
		editing_address_snapshot.value = null
		clearFieldErrors()
		is_add_modal_open.value = true
		populateDynamicFields(add_form_type.value)
	}

	function closeAddModal() {
		clearFieldErrors()
		is_add_modal_open.value = false
	}

	function openEditModal<T extends AddressType>(address: AddressMap[T]) {
		address_modal_mode.value = 'edit'
		editing_address_id.value = address.id
		editing_address_snapshot.value = address
		add_form_type.value = address.type
		add_form_state[address.type] = mapAddressToForm(address)
		clearFieldErrors()
		is_add_modal_open.value = true
	}




	/** Overlays */
	function startRequestOverlay() {
		loading_overlay_store.startLoading('add_address', {
			showCopy: true,
			testId: 'account-profile-upload-avatar-overlay',
			position: 'fixed'
		})
	}

	return {
		add_form_type,
		active_add_form,
		address_modal_mode,
		modal_submit_label,
		field_errors,

		is_add_modal_open,

		saveAddress,
		openAddModal,
		openEditModal,
		closeAddModal,
		setAddFormType,
		resetAddForm,
		updateActiveAddFormField,
		updateActiveDynamicField,
	}
}