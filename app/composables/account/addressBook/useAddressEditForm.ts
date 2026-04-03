import type { Ref } from 'vue';
import { useAddressFieldStore, useAddressStore } from "~/stores/address";
import type { AddressFormState, AddressFormMap, AddressMap, AddressType, DynamicFieldDefinition } from "~/types/address";

type UseAddressEditFormOptions = {
	form_state: AddressFormState
	form_type: Ref<AddressType>
	openEditFormModal: () => void
	closeModal: () => void
	setCreateMode: () => void
	clearFormFieldErrors: () => void
}

export function useAddressEditForm(options: UseAddressEditFormOptions) {

	/**
     * Stores
     */

	const address_field_store = useAddressFieldStore()
	const address_store = useAddressStore()
	const toast_store = useToastStore()

	const editing_address_id = ref<number | null>(null)
	const editing_address_snapshot = ref<AddressMap[AddressType] | null>(null)

	function mapAddressToForm(
		address: AddressMap[AddressType]
	): AddressFormMap[AddressType] {
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
			} as AddressFormMap['drop']
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
			} as AddressFormMap['shipping']
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
		} as AddressFormMap['billing']
	}

	function resetEditState() {
		editing_address_id.value = null
		editing_address_snapshot.value = null
		options.clearFormFieldErrors()
	}

	function openEditModal(address: AddressMap[AddressType]) {
		editing_address_id.value = address.id
		editing_address_snapshot.value = address
		options.form_type.value = address.type

		if (address.type === 'shipping') {
			options.form_state.shipping = mapAddressToForm(address) as AddressFormMap['shipping']
		}

		if (address.type === 'billing') {
			options.form_state.billing = mapAddressToForm(address) as AddressFormMap['billing']
		}

		if (address.type === 'drop') {
			options.form_state.drop = mapAddressToForm(address) as AddressFormMap['drop']
		}

		options.clearFormFieldErrors()
		options.openEditFormModal()
	}

	function updateAddressLocally() {
		if (editing_address_id.value === null || !editing_address_snapshot.value) {
			options.closeModal()
			return
		}

		const type = options.form_type.value
		const editing_address = editing_address_snapshot.value

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
					value: String(fields[field.field_key] ?? ''),
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
					value: String(fields[field.field_key] ?? ''),
				})),
			})
		}

		options.closeModal()
		options.setCreateMode()
		resetEditState()
		toast_store.showToastWithTimer({
			message: 'Your address has been updated.',
			tone: 'primary',
			dismissible: true,
			variant: 'default',
		})
	}

	return {
		resetEditState,
		openEditModal,
		updateAddressLocally,
	}
}