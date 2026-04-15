import type { icons } from '~/data/ui/icons'
import { useAddressFieldStore } from '~/stores/address'
import type { CountryFieldOption } from '~/types/country_field_option'
import type {
	AddressDynamicFields,
	AddressFormField,
	AddressFormMap,
	AddressLabel,
	AddressType,
	UpdateDynamicFieldPayload,
	UpdateFieldPayload,
} from '~/types/address'
import { hasAddressLines, hasPhoneNumber, onPhoneBeforeInput, onPhonePaste } from '~/utils/address'

type IconName = keyof typeof icons

export type AddressFormFieldsProps = {
	form: AddressFormMap[AddressType]
	errors?: Record<string, string>
	showLabelSelector?: boolean
}

export type AddressFormFieldsEmit = {
	(event: 'update:field', payload: UpdateFieldPayload): void
	(event: 'update:dynamic-field', payload: UpdateDynamicFieldPayload): void
}

type UseAddressFormFieldOptions = {
	props: AddressFormFieldsProps
	emit: AddressFormFieldsEmit
	translate: (key: string) => string
}

export function useAddressFormField(options: UseAddressFormFieldOptions) {
	const address_field_store = useAddressFieldStore()
	const dynamic_fields = computed(() => address_field_store.dynamic_address_fields ?? [])

	const address_label_options: Array<{
		value: AddressLabel
		label_key: string
		icon: IconName
	}> = [
		{ value: 'home', label_key: 'home', icon: 'regular-home' },
		{ value: 'office', label_key: 'office', icon: 'regular-building' },
		{ value: 'client', label_key: 'client', icon: 'regular-user-circle' },
	]

	function createStringFieldModel(
		field: AddressFormField,
		get_value: () => string
	) {
		return computed({
			get: get_value,
			set: (value: string) => {
				options.emit('update:field', {
					field,
					value,
				})
			},
		})
	}

	const contact_name_model = createStringFieldModel(
		'contact_name',
		() => options.props.form.contact_name
	)

	const company_model = createStringFieldModel(
		'company',
		() => options.props.form.company ?? ''
	)

	const address_line_1_model = createStringFieldModel(
		'address_line_1',
		() => hasAddressLines(options.props.form)
			? options.props.form.address_line_1
			: ''
	)

	const address_line_2_model = createStringFieldModel(
		'address_line_2',
		() => hasAddressLines(options.props.form)
			? options.props.form.address_line_2 ?? ''
			: ''
	)

	const postcode_model = createStringFieldModel(
		'postcode',
		() => hasAddressLines(options.props.form)
			? options.props.form.postcode
			: ''
	)

	const phone_number_model = createStringFieldModel(
		'phone_number',
		() => hasPhoneNumber(options.props.form)
			? options.props.form.phone_number
			: ''
	)

	function updateDynamicField(field_key: string, value: string | number) {
		options.emit('update:dynamic-field', {
			field_key,
			value,
		})
	}

	function getDynamicFieldValue(field_key: string) {
		if (!hasAddressLines(options.props.form)) return ''

		const value = options.props.form.fields?.[field_key]
		const field = dynamic_fields.value?.find(f => f.field_key === field_key)

		if (field?.options?.length) {
			return field.options.find(opt => opt.id === value)?.value ?? ''
		}

		return value ?? ''
	}

	function onDynamicSelectChange(field_key: string, selected_value: string | number) {
		const field = dynamic_fields.value?.find(f => f.field_key === field_key)

		if (
			field
			&& field.input_type === 'select'
			&& hasProvinceLabel(field)
			&& selected_value === getDefaultSelectOptionValue(field)
		) {
			updateDynamicField(field_key, '')
			return
		}

		const option = dynamic_fields.value
			?.find(f => f.field_key === field_key)
			?.options?.find(opt => opt.value === selected_value)

		updateDynamicField(field_key, option?.id ?? selected_value)
	}

	function getFieldError(field_key: string) {
		return options.props.errors?.[field_key] ?? ''
	}

	function hasProvinceLabel(field: AddressDynamicFields) {
		const normalized_label = field.field_label.toLowerCase()
		return normalized_label.includes('province') || normalized_label.includes('metropolitan')
	}

	function createDefaultSelectOption(field: AddressDynamicFields): CountryFieldOption {
		const default_label = hasProvinceLabel(field)
			? options.translate('account.addressBook.provincePlaceholder')
			: field.field_label

		return {
			id: '' as unknown as number,
			country_field_id: field.id,
			label: default_label,
			value: getDefaultSelectOptionValue(field),
			sort_order: -1,
			is_active: true,
		}
	}

	function getDefaultSelectOptionValue(field: AddressDynamicFields) {
		return `__placeholder__${field.field_key}`
	}

	function getDynamicFieldOptions(field: AddressDynamicFields) {
		if (field.input_type !== 'select') return field.options ?? []
		if (!hasProvinceLabel(field)) return field.options ?? []

		const current_options = field.options ?? []
		const has_existing_default = current_options.some((option) => option.id === ('' as unknown as number))

		if (has_existing_default) return current_options

		return [createDefaultSelectOption(field), ...current_options]
	}

	function getDynamicFieldPlaceholder(field: AddressDynamicFields) {
		if (hasProvinceLabel(field)) {
			return options.translate('account.addressBook.provincePlaceholder')
		}

		const normalized_label = field.field_label.toLowerCase()

		if (normalized_label.includes('city') || normalized_label.includes('town')) {
			return options.translate('account.addressBook.cityPlaceholder')
		}

		return field.field_label
	}

	function getDynamicFieldHighlightedValueWhenEmpty(field: AddressDynamicFields) {
		if (field.input_type !== 'select') return null
		if (!hasProvinceLabel(field)) return null

		return getDefaultSelectOptionValue(field)
	}

	return {
		hasAddressLines,
		hasPhoneNumber,
		onPhoneBeforeInput,
		onPhonePaste,
		address_label_options,
		contact_name_model,
		company_model,
		address_line_1_model,
		address_line_2_model,
		postcode_model,
		phone_number_model,
		dynamic_fields,
		updateDynamicField,
		getDynamicFieldValue,
		onDynamicSelectChange,
		getFieldError,
		getDynamicFieldOptions,
		getDynamicFieldHighlightedValueWhenEmpty,
		getDynamicFieldPlaceholder,
	}
}