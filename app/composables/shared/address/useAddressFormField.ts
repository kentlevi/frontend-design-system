import { useCountry } from '~/composables/app/country/useCountry'
import type { icons } from '~/data/ui/icons'
import { useAddressFieldStore } from '~/stores/user-address'
import type { CountryFieldOption } from '~/types/country_field_option'
import type {
	AddressDynamicFields,
	AddressFormField,
	AddressFormMap,
	AddressLabel,
	AddressType,
	UpdateDynamicFieldPayload,
	UpdateFieldPayload,
} from '~/types/user-address'
import { useAddressHelper } from '~/utils/address'

type IconName = keyof typeof icons

export type AddressFormFieldsProps = {
	form: AddressFormMap[AddressType]
	errors?: Record<AddressType, Record<string, string>>
	showLabelSelector?: boolean
	copyContext?: 'checkout' | 'addressBook'
}

export type AddressFormFieldsEmit = {
	(event: 'update:field', type: AddressType, payload: UpdateFieldPayload): void
	(event: 'update:dynamic-field', type: AddressType, payload: UpdateDynamicFieldPayload): void
}

type UseAddressFormFieldOptions = {
	props: AddressFormFieldsProps
	emit: AddressFormFieldsEmit
}

export function useAddressFormField(options: UseAddressFormFieldOptions) {
	const { t: translate } = useI18n()
	const { country } = useCountry();

	const address_field_store = useAddressFieldStore()
	const dynamic_fields = computed(() => address_field_store.dynamic_address_fields ?? [])
	const copy_context = computed(() => options.props.copyContext ?? 'checkout')

	const { hasAddressLines, hasPhoneNumber, onPhoneBeforeInput, onPhonePaste } = useAddressHelper()

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
				options.emit('update:field', options.props.form.type, {
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
		options.emit('update:dynamic-field', options.props.form.type, {
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

		if (field && selected_value === field.field_label) {
			updateDynamicField(field_key, '')
			return
		}

		const option = dynamic_fields.value
			?.find(f => f.field_key === field_key)
			?.options?.find(opt => opt.value === selected_value)

		updateDynamicField(field_key, option?.id ?? selected_value)
	}

	function getFieldError(type: AddressType, field_key: string) {
		return options.props.errors?.[type]?.[field_key] ?? ''
	}

	function createDefaultSelectOption(field: AddressDynamicFields): CountryFieldOption {
		const default_label = getDynamicFieldPlaceholder(field)

		return {
			id: '' as unknown as number,
			country_field_id: field.id,
			label: default_label,
			value: field.field_label,
			sort_order: -1,
			is_active: true,
		}
	}

	function getDynamicFieldOptions(field: AddressDynamicFields) {
		const current_options = field.options ?? []

		return [createDefaultSelectOption(field), ...current_options]
	}

	function getDynamicFieldPlaceholder(field: AddressDynamicFields) {
		if (field.input_type === 'select') {
			return country.value === 'kr'
				? `${field.field_label}${translate(`account.addressBook.select`)}`
				: `${translate(`account.addressBook.select`)} ${field.field_label}`
		} else {
			return country.value === 'kr'
				? `${field.field_label}${translate(`account.addressBook.enter`)}`
				: `${translate(`account.addressBook.enter`)} ${field.field_label}`
		}
	}

	function resolvePlaceholderKey(
		key: 'fullNamePlaceholder' | 'companyPlaceholder' | 'addressLine1Placeholder' | 'addressLine2Placeholder' | 'postalCodePlaceholder'
	) {
		if (copy_context.value === 'addressBook') {
			return `account.addressBook.accountForm.${key}`
		}

		return `account.addressBook.${key}`
	}

	return {
		translate,

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
		getDynamicFieldPlaceholder,
		resolvePlaceholderKey,
	}
}