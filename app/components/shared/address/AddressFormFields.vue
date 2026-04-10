<script setup lang="ts">
import type { icons } from '~/data/ui/icons'
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

type Props = {
	type: AddressType
	form: AddressFormMap[AddressType]
	errors?: Record<string, string>
	dynamicFields?: AddressDynamicFields[]
	showLabelSelector?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	errors: () => ({}),
	dynamicFields: () => [],
	showLabelSelector: false,
})

const emit = defineEmits<{
	(e: 'update:field', payload: UpdateFieldPayload): void
	(e: 'update:dynamic-field', payload: UpdateDynamicFieldPayload): void
}>()

const { t } = useI18n()

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
			emit('update:field', {
				field,
				value,
			})
		},
	})
}

const contact_name_model = createStringFieldModel(
	'contact_name',
	() => props.form.contact_name
)

const company_model = createStringFieldModel(
	'company',
	() => props.form.company ?? ''
)

const address_line_1_model = createStringFieldModel(
	'address_line_1',
	() => hasAddressLines(props.form)
		? props.form.address_line_1
		: ''
)

const address_line_2_model = createStringFieldModel(
	'address_line_2',
	() => hasAddressLines(props.form)
		? props.form.address_line_2 ?? ''
		: ''
)

const postcode_model = createStringFieldModel(
	'postcode',
	() => hasAddressLines(props.form)
		? props.form.postcode
		: ''
)

const phone_number_model = createStringFieldModel(
	'phone_number',
	() => hasPhoneNumber(props.form)
		? props.form.phone_number
		: ''
)

function updateDynamicField(field_key: string, value: string | number) {
	emit('update:dynamic-field', {
		field_key,
		value,
	})
}

function getDynamicFieldValue(field_key: string) {
	if (!hasAddressLines(props.form)) return ''

	const value = props.form.fields?.[field_key]
	const field = props.dynamicFields?.find(f => f.field_key === field_key)

	if (field?.options?.length) {
		return field.options.find(opt => opt.id === value)?.value ?? ''
	}

	return value ?? ''
}

function onDynamicSelectChange(field_key: string, selected_value: string | number) {
	const option = props.dynamicFields
		.find(f => f.field_key === field_key)
		?.options?.find(opt => opt.value === selected_value)

	updateDynamicField(field_key, option?.id ?? selected_value)
}

function getFieldError(field_key: string) {
	return props.errors[field_key] ?? ''
}

function getDynamicFieldPlaceholder(field: AddressDynamicFields) {
	const normalized_label = field.field_label.toLowerCase()

	if (normalized_label.includes('province') || normalized_label.includes('metropolitan')) {
		return t('account.addressBook.provincePlaceholder')
	}

	if (normalized_label.includes('city') || normalized_label.includes('town')) {
		return t('account.addressBook.cityPlaceholder')
	}

	return field.field_label
}
</script>

<template>
	<div class="address-form-fields">
		<div class="address-form-fields-grid address-form-fields-grid--two">
			<UiFormField
				:label="t('account.addressBook.fullName')"
				:required="true"
				:show-required-mark="true"
				:error="getFieldError('contact_name')"
			>
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						v-model="contact_name_model"
						:aria-describedby="describedBy || undefined"
						:placeholder="t('account.addressBook.fullNamePlaceholder')"
						:state="getFieldError('contact_name') ? 'error' : 'default'"
					/>
				</template>
			</UiFormField>

			<UiFormField :label="t('account.addressBook.companyOptional')">
				<template #label>
					<span class="address-form-fields-company-label">
						<span class="address-form-fields-company-label-text">Company</span>
						<span class="address-form-fields-company-label-optional">(Optional)</span>
					</span>
				</template>

				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						v-model="company_model"
						:aria-describedby="describedBy || undefined"
						:placeholder="t('account.addressBook.companyPlaceholder')"
					/>
				</template>
			</UiFormField>
		</div>

		<div v-if="props.showLabelSelector" class="address-form-fields-group">
			<h4 class="address-form-fields-label">
				{{ t('account.addressBook.addressLabel') }}
			</h4>

			<div class="address-form-fields-segment">
				<UiButton
					v-for="option in address_label_options"
					:key="option.value"
					type="button"
					variant="ghost"
					tone="neutral"
					size="40"
					class="address-form-fields-choice"
					:selected="props.form.label === option.value"
					@click="emit('update:field', { field: 'label', value: option.value })"
				>
					<UiIcon :name="option.icon" :size="24" />
					<span>{{ t(`account.addressBook.tags.${option.label_key}`) }}</span>
				</UiButton>
			</div>
		</div>

		<template v-if="hasAddressLines(props.form)">
			<UiFormField
				:label="t('account.addressBook.streetAddress')"
				:required="true"
				:show-required-mark="true"
				:error="getFieldError('address_line_1')"
			>
				<template #default="{ inputId, describedBy }">
					<div class="address-form-fields-stack">
						<UiInput
							:id="inputId"
							v-model="address_line_1_model"
							:aria-describedby="describedBy || undefined"
							:placeholder="t('account.addressBook.addressLine1Placeholder')"
							:state="getFieldError('address_line_1') ? 'error' : 'default'"
						/>
						<UiInput
							v-model="address_line_2_model"
							:placeholder="t('account.addressBook.addressLine2Placeholder')"
						/>
					</div>
				</template>
			</UiFormField>

			<div class="address-form-fields-grid address-form-fields-grid--two">
				<UiFormField
					v-for="(dynamic_field, index) in props.dynamicFields"
					:key="index"
					:label="dynamic_field.field_label"
					:required="dynamic_field.is_required"
					:show-required-mark="dynamic_field.is_required"
					:error="getFieldError(`fields.${dynamic_field.field_key}`)"
				>
					<template #default="{ inputId, describedBy }">
						<UiSelect
							v-if="dynamic_field.input_type === 'select'"
							:options="dynamic_field.options"
							:placeholder="getDynamicFieldPlaceholder(dynamic_field)"
							:model-value="getDynamicFieldValue(dynamic_field.field_key)"
							:trigger-class="getFieldError(`fields.${dynamic_field.field_key}`) ? 'address-form-fields-select-trigger--error' : ''"
							@update:model-value="onDynamicSelectChange(dynamic_field.field_key, $event)"
						/>

						<UiInput
							v-if="dynamic_field.input_type === 'text'"
							:id="inputId"
							:aria-describedby="describedBy || undefined"
							:placeholder="getDynamicFieldPlaceholder(dynamic_field)"
							:model-value="getDynamicFieldValue(dynamic_field.field_key)"
							:state="getFieldError(`fields.${dynamic_field.field_key}`) ? 'error' : 'default'"
							@update:model-value="updateDynamicField(dynamic_field.field_key, $event)"
						/>
					</template>
				</UiFormField>
			</div>

			<div class="address-form-fields-grid address-form-fields-grid--two">
				<UiFormField
					:label="t('account.addressBook.postalCode')"
					:required="true"
					:show-required-mark="true"
					:error="getFieldError('postcode')"
				>
					<template #default="{ inputId, describedBy }">
						<UiInput
							:id="inputId"
							v-model="postcode_model"
							:aria-describedby="describedBy || undefined"
							:placeholder="t('account.addressBook.postalCodePlaceholder')"
							:state="getFieldError('postcode') ? 'error' : 'default'"
						/>
					</template>
				</UiFormField>

				<UiFormField
					v-if="hasPhoneNumber(props.form)"
					:label="t('account.addressBook.phoneNumber')"
					:required="true"
					:show-required-mark="true"
					:error="getFieldError('phone_number')"
				>
					<template #default="{ inputId, describedBy }">
						<UiInput
							:id="inputId"
							v-model="phone_number_model"
							type="text"
							:aria-describedby="describedBy || undefined"
							:placeholder="t('account.addressBook.phonePlaceholder')"
							:state="getFieldError('phone_number') ? 'error' : 'default'"
							@beforeinput="onPhoneBeforeInput"
							@paste="onPhonePaste"
						/>
					</template>
				</UiFormField>
			</div>
		</template>
	</div>
</template>

<style scoped lang="scss">
.address-form-fields {
	display: flex;
	flex-direction: column;
	gap: 16px;

	.address-form-fields-group {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.address-form-fields-label {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

	.address-form-fields-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 18px 14px;

		&.address-form-fields-grid--two {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			column-gap: 14px;
		}
	}

	.address-form-fields-stack {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.address-form-fields-company-label {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.address-form-fields-company-label-text {
		color: var(--text-primary);
	}

	.address-form-fields-company-label-optional {
		color: var(--text-secondary);
	}

	.address-form-fields-segment {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}

	.address-form-fields-choice {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 10px;
		min-height: 38px;
		padding: 10px 16px;
		border: 1px solid var(--gray-40);
		border-radius: 10px;
		color: var(--text-primary);
		background: var(--contrast-light);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-medium, 500);
		box-shadow: none;
	}

	.address-form-fields-choice:hover {
		background: var(--gray-10);
		border-color: var(--gray-50);
		color: var(--text-primary);
	}

	.address-form-fields-choice[data-selected='true'] {
		background: var(--gray-10);
		border-color: var(--gray-60);
		color: var(--text-primary);
	}

	:deep(.address-form-fields-choice .ui-button-indicator) {
		display: none;
	}

	:deep(.address-form-fields-select-trigger--error) {
		border-color: var(--error);
	}

	:deep(.ui-form-field-label) {
		gap: 0;
	}

	:deep(.ui-form-field-label-text) {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

	:deep(.ui-input-wrap),
	:deep(.ui-select-trigger) {
		border-radius: 8px;
		box-shadow: none;
	}

	:deep(.ui-select-trigger:hover) {
		background: var(--contrast-light);
		box-shadow: none;
	}

	:deep(.ui-input) {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}
}

@media (max-width: 767px) {
	.address-form-fields {
		.address-form-fields-grid.address-form-fields-grid--two,
		.address-form-fields-segment {
			grid-template-columns: minmax(0, 1fr);
		}
	}
}
</style>