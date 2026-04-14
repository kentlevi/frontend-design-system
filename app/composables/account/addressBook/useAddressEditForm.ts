import type { Ref } from 'vue';
import { mapAddressToForm } from '~/factories/address';
import { updateUserAddress } from '~/services/profile/address.service';
import { useAddressFieldStore, useAddressStore } from "~/stores/address";
import type { AddressFormState, AddressFormMap, AddressMap, AddressType } from "~/types/address";
import type { CountryField } from '~/types/country_field';
import { useAddressHelper } from '~/utils/address';

type UseAddressEditFormOptions = {
	form_state: AddressFormState
	form_type: Ref<AddressType>
	active_form: ComputedRef<AddressFormMap[AddressType]>
	form_field_errors: Ref<Record<string, string>>

	openEditFormModal: () => void
	closeFormModal: () => void
	setCreateMode: () => void
	clearFormFieldErrors: () => void
}

export function useAddressEditForm(options: UseAddressEditFormOptions) {

	const is_submitting = ref(false)
	const { mapApiFieldErrors } = useAddressHelper()

	/** Stores */
	const address_field_store = useAddressFieldStore()
	const address_store = useAddressStore()
	const toast_store = useToastStore()
	const editing_address_id = ref<number | null>(null)
	const editing_address_snapshot = ref<AddressMap[AddressType] | null>(null)

	function resetEditState() {
		editing_address_id.value = null
		editing_address_snapshot.value = null
		options.clearFormFieldErrors()
	}

	function openEditModal(address: AddressMap[AddressType]) {
		editing_address_id.value = address.id
		editing_address_snapshot.value = address

		// 1) point active_form to the right bucket first
		options.form_type.value = address.type

		// 2) map API address -> form shape
		const mapped_form = mapAddressToForm(address, address_field_store.dynamic_address_fields)

		// 3) write into the currently active form object
		Object.assign(options.active_form.value, mapped_form)

		options.clearFormFieldErrors()
		options.openEditFormModal()
	}

	async function updateAddress() {
		if (editing_address_id.value === null || !editing_address_snapshot.value) {
			options.closeFormModal()
			return
		}
		is_submitting.value = true

		const type = options.form_type.value
		const editing_address = editing_address_snapshot.value
		const payload = { ...options.active_form.value };

		try {
			const response = await updateUserAddress(editing_address_id.value, payload)

			if (response.success) {
				if (type === 'drop') {
					address_store.updateAddress(type, {
						...editing_address,
						...options.form_state.drop,
						country_id: editing_address.country_id,
						type: 'drop',
					})
				}

				if (type === 'billing') {
					const { fields, ...billing_form } = options.form_state.billing

					address_store.updateAddress(type, {
						...editing_address,
						...billing_form,
						id: editing_address_id.value,
						country_id: editing_address.country_id,
						type: 'billing',
						dynamic_fields: address_field_store.dynamic_address_fields.map(field => ({
							...field,
							value: String(getValue(field, fields[field.field_key] ?? '')),
						})),
					})
				}

				if (type === 'shipping') {
					const { fields, ...shipping_form } = options.form_state.shipping

					address_store.updateAddress(type, {
						...editing_address,
						...shipping_form,
						id: editing_address_id.value,
						country_id: editing_address.country_id,
						type: 'shipping',
						dynamic_fields: address_field_store.dynamic_address_fields.map(field => ({
							...field,
							value: String(getValue(field, fields[field.field_key] ?? '')),
						})),
					})
				}

				toast_store.handleApiResponse(response)
				options.closeFormModal()
				resetEditState()
				options.setCreateMode()
			} else {
				const next_errors = mapApiFieldErrors(response.data)
				options.form_field_errors.value = next_errors
			}
		} catch (_error: unknown) {
			console.log(_error);
		} finally {
			is_submitting.value = false
		}
	}

	function getValue(field: CountryField, field_value: string | number) {

		if (field.input_type !== 'text') {
			const value = field.options?.find((option) => option.id === field_value)

			return value?.value ?? ''
		}

		return field_value
	}

	return {
		is_submitting,
		resetEditState,
		openEditModal,
		updateAddress,
	}
}