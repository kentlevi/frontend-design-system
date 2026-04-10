import { computed, type ComputedRef, type Ref } from 'vue'
import type {
	AddressDynamicFields,
	AddressFormField,
	AddressFormMap,
	AddressType,
	UpdateDynamicFieldPayload,
	UpdateFieldPayload,
} from '~/types/address'
import { hasAddressLines, hasPhoneNumber, onPhoneBeforeInput, onPhonePaste } from '~/utils/address'

type AddressFormModalHelpersOptions = {
	active_form: ComputedRef<AddressFormMap[AddressType]>
	dynamic_fields: ComputedRef<AddressDynamicFields[]>
	form_field_errors: Ref<Record<string, string>>
	updateActiveFormField: (payload: UpdateFieldPayload) => void
	updateFormDynamicField: (payload: UpdateDynamicFieldPayload) => void
	translate: (key: string) => string
}

export function useAddressFormModalHelpers(options: AddressFormModalHelpersOptions) {
	/** Generic helper to build a string model */
	function createStringFieldModel(
		field: AddressFormField,
		get_value: () => string
	) {
		return computed({
			/** Read current value from active form */
			get: get_value,

			/** Push changed value to shared form state */
			set: (value: string) => {
				options.updateActiveFormField({
					field,
					value,
				})
			},
		})
	}

	function createBooleanFieldModel(
		field: Extract<AddressFormField, 'is_default'>,
		get_value: () => boolean
	) {
		return computed({
			get: get_value,

			set: (value: boolean) => {
				options.updateActiveFormField({
					field,
					value,
				})
			},
		})
	}

	/** Shared fields */
	const contact_name_model = createStringFieldModel(
		'contact_name',
		() => options.active_form.value.contact_name
	)

	const company_model = createStringFieldModel(
		'company',
		() => options.active_form.value.company ?? ''
	)

	const is_default_model = createBooleanFieldModel(
		'is_default',
		() => options.active_form.value.is_default ?? false
	)

	/** Address line fields */
	const address_line_1_model = createStringFieldModel(
		'address_line_1',
		() => hasAddressLines(options.active_form.value)
			? options.active_form.value.address_line_1
			: ''
	)

	const address_line_2_model = createStringFieldModel(
		'address_line_2',
		() => hasAddressLines(options.active_form.value)
			? options.active_form.value.address_line_2 ?? ''
			: ''
	)

	const postcode_model = createStringFieldModel(
		'postcode',
		() => hasAddressLines(options.active_form.value)
			? options.active_form.value.postcode
			: ''
	)

	/** Shipping-only field */
	const phone_number_model = createStringFieldModel(
		'phone_number',
		() => hasPhoneNumber(options.active_form.value)
			? options.active_form.value.phone_number
			: ''
	)

	/** Send one dynamic field change to shared form state */
	function updateDynamicField(field_key: string, value: string | number) {
		options.updateFormDynamicField({
			field_key,
			value,
		})
	}

	function getDynamicFieldValue(field_key: string) {
		if (!hasAddressLines(options.active_form.value)) return ''

		const value = options.active_form.value.fields?.[field_key]
		const field = options.dynamic_fields.value?.find(f => f.field_key === field_key)

		// If it's a select field, return the option label
		if (field?.options?.length) {
			return field.options.find(opt => opt.id === value)?.value ?? ''
		}

		return value ?? ''
	}

	function onDynamicSelectChange(field_key: string, selected_value: string | number) {
		// If options carry `id` and `value`, map selected label/value back to option id
		const option = options.dynamic_fields.value
			.find(f => f.field_key === field_key)
			?.options?.find(opt => opt.value === selected_value)

		const id = option?.id ?? selected_value
		updateDynamicField(field_key, id)
	}

	function getFieldError(field_key: string) {
		return options.form_field_errors.value[field_key] ?? ''
	}

	function getDynamicFieldPlaceholder(field: AddressDynamicFields) {
		const normalized_label = field.field_label.toLowerCase()

		if (normalized_label.includes('province') || normalized_label.includes('metropolitan')) {
			return options.translate('account.addressBook.provincePlaceholder')
		}

		if (normalized_label.includes('city') || normalized_label.includes('town')) {
			return options.translate('account.addressBook.cityPlaceholder')
		}

		return field.field_label
	}

	return {
		hasAddressLines,
		hasPhoneNumber,
		contact_name_model,
		company_model,
		is_default_model,
		address_line_1_model,
		address_line_2_model,
		postcode_model,
		phone_number_model,
		onPhoneBeforeInput,
		onPhonePaste,
		updateDynamicField,
		getDynamicFieldValue,
		onDynamicSelectChange,
		getFieldError,
		getDynamicFieldPlaceholder,
	}
}