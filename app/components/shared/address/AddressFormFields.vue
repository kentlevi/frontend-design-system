<script setup lang="ts">
import type { AddressFormFieldsEmit, AddressFormFieldsProps } from '~/composables/shared/address/useAddressFormField'
import { useAddressFormField } from '~/composables/shared/address/useAddressFormField'

const props = withDefaults(defineProps<AddressFormFieldsProps>(), {
	errors: () => ({
		shipping: {},
		billing: {},
		drop: {},
	}),
	showLabelSelector: false,
})

const emit = defineEmits<AddressFormFieldsEmit>()

const { t: translate } = useI18n()

const {
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
	resolvePlaceholderKey,
} = useAddressFormField({
	props,
	emit,
	translate
})
</script>

<template>
	<div class="address-form-fields">
		<div class="address-form-fields-grid address-form-fields-grid--two">
			<UiFormField
				:label="translate('account.addressBook.fullName')"
				:required="true"
				:show-required-mark="true"
				:error="getFieldError(props.form.type, 'contact_name')"
			>
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						v-model="contact_name_model"
						:aria-describedby="describedBy || undefined"
						:placeholder="translate(resolvePlaceholderKey('fullNamePlaceholder'))"
						:state="getFieldError(props.form.type, 'contact_name') ? 'error' : 'default'"
					/>
				</template>
			</UiFormField>

			<UiFormField :label="translate('account.addressBook.companyOptional')">
				<template #label>
					<span class="address-form-fields-company-label">
						<span class="address-form-fields-company-label-text">{{ translate('account.addressBook.companyOptional') }}</span>
					</span>
				</template>

				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						v-model="company_model"
						:aria-describedby="describedBy || undefined"
						:placeholder="translate(resolvePlaceholderKey('companyPlaceholder'))"
					/>
				</template>
			</UiFormField>
		</div>

		<div v-if="props.showLabelSelector" class="address-form-fields-group">
			<h4 class="address-form-fields-label">
				{{ translate('account.addressBook.addressLabel') }}
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
					@click="emit('update:field', props.form.type, { field: 'label', value: option.value })"
				>
					<UiIcon :name="option.icon" :size="24" />
					<span>{{ translate(`account.addressBook.tags.${option.label_key}`) }}</span>
				</UiButton>
			</div>
		</div>

		<template v-if="hasAddressLines(props.form)">
			<div class="address-form-fields-grid address-form-fields-grid--two">
				<UiFormField
					v-for="(dynamic_field, index) in dynamic_fields"
					:key="index"
					:label="dynamic_field.field_label"
					:required="dynamic_field.is_required"
					:show-required-mark="dynamic_field.is_required"
					:error="getFieldError(props.form.type, `fields.${dynamic_field.field_key}`)"
				>
					<template #default="{ inputId, describedBy }">
						<UiSelect
							v-if="dynamic_field.input_type === 'select'"
							:options="getDynamicFieldOptions(dynamic_field)"
							:placeholder="getDynamicFieldPlaceholder(dynamic_field)"
							:model-value="getDynamicFieldValue(dynamic_field.field_key)"
							:highlighted-value-when-empty="getDynamicFieldHighlightedValueWhenEmpty(dynamic_field)"
							:trigger-class="getFieldError(props.form.type, `fields.${dynamic_field.field_key}`) ? 'address-form-fields-select-trigger--error' : ''"
							@update:model-value="onDynamicSelectChange(dynamic_field.field_key, $event)"
						/>

						<UiInput
							v-if="dynamic_field.input_type === 'text'"
							:id="inputId"
							:aria-describedby="describedBy || undefined"
							:placeholder="getDynamicFieldPlaceholder(dynamic_field)"
							:model-value="getDynamicFieldValue(dynamic_field.field_key)"
							:state="getFieldError(props.form.type, `fields.${dynamic_field.field_key}`) ? 'error' : 'default'"
							@update:model-value="updateDynamicField(dynamic_field.field_key, $event)"
						/>
					</template>
				</UiFormField>
			</div>

			<UiFormField
				:label="translate('account.addressBook.streetAddress')"
				:required="true"
				:show-required-mark="true"
				:error="getFieldError(props.form.type, 'address_line_1')"
			>
				<template #default="{ inputId, describedBy }">
					<div class="address-form-fields-stack">
						<UiInput
							:id="inputId"
							v-model="address_line_1_model"
							:aria-describedby="describedBy || undefined"
							:placeholder="translate(resolvePlaceholderKey('addressLine1Placeholder'))"
							:state="getFieldError(props.form.type, 'address_line_1') ? 'error' : 'default'"
						/>
						<UiInput
							v-model="address_line_2_model"
							:placeholder="translate(resolvePlaceholderKey('addressLine2Placeholder'))"
						/>
					</div>
				</template>
			</UiFormField>

			<div class="address-form-fields-grid address-form-fields-grid--two">
				<UiFormField
					:label="translate('account.addressBook.postalCode')"
					:required="true"
					:show-required-mark="true"
					:error="getFieldError(props.form.type, 'postcode')"
				>
					<template #default="{ inputId, describedBy }">
						<UiInput
							:id="inputId"
							v-model="postcode_model"
							:aria-describedby="describedBy || undefined"
							:placeholder="translate(resolvePlaceholderKey('postalCodePlaceholder'))"
							:state="getFieldError(props.form.type, 'postcode') ? 'error' : 'default'"
						/>
					</template>
				</UiFormField>

				<UiFormField
					v-if="hasPhoneNumber(props.form)"
					:label="translate('account.addressBook.phoneNumber')"
					:required="true"
					:show-required-mark="true"
					:error="getFieldError(props.form.type, 'phone_number')"
				>
					<template #default="{ inputId, describedBy }">
						<UiInput
							:id="inputId"
							v-model="phone_number_model"
							type="text"
							:aria-describedby="describedBy || undefined"
							:placeholder="translate('account.addressBook.phonePlaceholder')"
							:state="getFieldError(props.form.type, 'phone_number') ? 'error' : 'default'"
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

		.address-form-fields-label {
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-semibold);
			color: var(--text-primary);
		}

		.address-form-fields-segment {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 12px;

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
				font-weight: var(--font-weight-regular);
				box-shadow: none;

				&.ui-button:hover:not(:disabled) {
					background: var(--gray-10);
					border-color: var(--gray-50);
					color: var(--text-primary);
				}

				&.ui-button[data-selected='true'] {
					background: var(--gray-10);
					border-color: var(--gray-60);
					color: var(--text-primary);
					&:hover:not(:disabled) {
						border-color: var(--gray-60);
					}
				}
			}
		}
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

		.address-form-fields-company-label-text {
			color: var(--text-primary);
		}

		.address-form-fields-company-label-optional {
			color: var(--text-secondary);
			font-weight: var(--font-weight-regular);
		}
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