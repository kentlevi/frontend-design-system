import type { Ref } from 'vue';
import { updateUserAddress } from '~/services/profile/address.service';
import { useAddressFieldStore, useAddressStore } from "~/stores/address";
import type { AddressFormState, AddressFormMap, AddressMap, AddressType, DynamicFieldDefinition } from "~/types/address";
import type { CountryField } from '~/types/country_field';

type UseAddressEditFormOptions = {
	form_state: AddressFormState
	form_type: Ref<AddressType>
	active_form: ComputedRef<AddressFormMap[AddressType]>
	openEditFormModal: () => void
	closeFormModal: () => void
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
	const loading_overlay_store = useLoadingOverlayStore()

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

		/**
         * Resolve dynamic fields that have a value of option_id
         * else return text_value
         */
		const fields = address.dynamic_fields.reduce((acc, field) => {
			if (field.input_type !== 'text') {
				const dynamic_field = address_field_store.dynamic_address_fields.find((dynamic_field) => {
					return dynamic_field.field_key === field.field_key
				})

				const matched_option = dynamic_field?.options?.find((option) => {
					return option.value === (field.value ?? '')
				})

				acc[field.field_key] = matched_option?.id ?? field.value ?? ''
				return acc
			}

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

		// 1) point active_form to the right bucket first
		options.form_type.value = address.type

		// 2) map API address -> form shape
		const mapped_form = mapAddressToForm(address)

		// 3) write into the currently active form object
		Object.assign(options.active_form.value, mapped_form)

		options.clearFormFieldErrors()
		options.openEditFormModal()
	}

	async function updateAddressLocally() {
		if (editing_address_id.value === null || !editing_address_snapshot.value) {
			options.closeFormModal()
			return
		}
		options.closeFormModal()
		startUpdateOverlay()

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
				resetEditState()
				options.setCreateMode()
			} else {
				options.openEditFormModal()
			}

			toast_store.handleApiResponse(response)
		} catch (_error: unknown) {
			console.log(_error);
		} finally {
			loading_overlay_store.stopLoading('update_address')
		}
	}

	function getValue(field: CountryField, field_value: string | number) {

		if (field.input_type !== 'text') {
			const value = field.options?.find((option) => option.id === field_value)

			return value?.value ?? ''
		}

		return field_value
	}

	/** Overlays */
	function startUpdateOverlay() {
		loading_overlay_store.startLoading('update_address', {
			showCopy: true,
			testId: 'account-profile-upload-avatar-overlay',
			position: 'fixed'
		})
	}

	return {
		resetEditState,
		openEditModal,
		updateAddressLocally,
	}
}