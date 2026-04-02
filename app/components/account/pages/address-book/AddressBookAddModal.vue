<script setup lang="ts">
import type { icons } from '~/data/ui/icons';
import type { AddressDynamicFields, AddressFormField, AddressFormMap, AddressLabel, AddressLineForm, AddressType, UpdateDynamicFieldPayload, UpdateFieldPayload } from '~/types/address';

type IconName = keyof typeof icons;

const { t } = useI18n();

const props = defineProps<{
	modelValue: boolean;
	mode: 'add' | 'edit';
	addFormType: AddressType;
	activeAddForm: AddressFormMap[AddressType];
	dynamicFields: AddressDynamicFields[];
	fieldErrors: Record<string, string>;
	submitLabel?: string;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'set-form-type', value: AddressType): void;
	(e: 'update-field', payload: UpdateFieldPayload): void;
	(e: 'update-dynamic-field', payload: UpdateDynamicFieldPayload): void;
	(e: 'add-address'): void;
}>();

/** Check whether the form supports address lines */
function hasAddressLines(form: AddressFormMap[AddressType]): form is AddressLineForm {
	return form.type !== 'drop'
}

/** Check whether the form supports phone number */
function hasPhoneNumber(form: AddressFormMap[AddressType]): form is AddressFormMap['shipping'] {
	return form.type === 'shipping'
}

/** Generic helper to build a string model */
function createStringFieldModel(
	field: AddressFormField,
	get_value: () => string
) {
	return computed({
		/** Read current value from prop */
		get: get_value,

		/** Send changed value to parent */
		set: (value: string) => {
			emit('update-field', {
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
			emit('update-field', {
				field,
				value
			})
		},
	});
}

/** Shared fields */
const contact_name_model = createStringFieldModel(
	'contact_name',
	() => props.activeAddForm.contact_name
)

const company_model = createStringFieldModel(
	'company',
	() => props.activeAddForm.company ?? ''
)

const is_default_model = createBooleanFieldModel(
	'is_default',
	() => props.activeAddForm.is_default ?? false
)

/** Address line fields */
const address_line_1_model = createStringFieldModel(
	'address_line_1',
	() => hasAddressLines(props.activeAddForm)
		? props.activeAddForm.address_line_1
		: ''
)

const address_line_2_model = createStringFieldModel(
	'address_line_2',
	() => hasAddressLines(props.activeAddForm)
		? props.activeAddForm.address_line_2 ?? ''
		: ''
)

const postcode_model = createStringFieldModel(
	'postcode',
	() => hasAddressLines(props.activeAddForm)
		? props.activeAddForm.postcode
		: ''
)

/** Shipping-only field */
const phone_number_model = createStringFieldModel(
	'phone_number',
	() => hasPhoneNumber(props.activeAddForm)
		? props.activeAddForm.phone_number
		: ''
)

/** Send one dynamic field change to the parent */
function updateDynamicField(field_key: string, value: string | number) {
	emit('update-dynamic-field', {
		field_key,
		value,
	})
}

function getDynamicFieldValue(field_key: string) {
	if (!hasAddressLines(props.activeAddForm)) return ''

	const value = props.activeAddForm.fields?.[field_key]
	const field = props.dynamicFields?.find(f => f.field_key === field_key)

	// If it's a select field, return the option label
	if (field?.options?.length) {
		return field.options.find(opt => opt.id === value)?.value ?? ''
	}

	return value ?? ''
}

function onDynamicSelectChange(field_key: string, selected_value: string | number) {

	// if options carry `id` and `value`, transform:
	const option = props.dynamicFields
		.find(f => f.field_key === field_key)
		?.options?.find(opt => opt.value === selected_value)

	const id = option?.id ?? selected_value
	updateDynamicField(field_key, id)
}

function getFieldError(field_key: string) {
	return props.fieldErrors[field_key] ?? ''
}

const address_type_options: Array<{
	value: AddressType;
	label_key: string;
	icon: IconName;
}> = [
	{ value: 'shipping', label_key: 'shippingTitle', icon: 'regular-truck' },
	{ value: 'billing', label_key: 'billingTitle', icon: 'regular-invoice-check' },
	{ value: 'drop', label_key: 'dropTitle', icon: 'strong-boxes-full' },
];

const address_label_options: Array<{
	value: AddressLabel;
	label_key: string;
	icon: IconName;
}> = [
	{ value: 'home', label_key: 'home', icon: 'regular-home' },
	{ value: 'office', label_key: 'office', icon: 'regular-building' },
	{ value: 'client', label_key: 'client', icon: 'regular-user-circle' },
];

const modal_title = computed(() => {
	return props.mode === 'edit'
		? t('account.addressBook.editTitle')
		: t('account.addressBook.addNew')
});
const save_label = computed(() => {
	const label_key = props.submitLabel ?? (props.mode === 'edit' ? 'update' : 'save')

	return t(`account.addressBook.${label_key}`)
});
const edit_address_type_note = 'Address type can’t be changed to maintain data integrity and ensure smooth order processing.'

function closeModal() {
	emit('update:modelValue', false);
}

</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		align="top"
		padding="0"
		gap="0"
		width="710px"
		modal-class="account-address-book-add-modal-shell"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<section class="account-address-book-add-modal" data-testid="account-address-book-add-modal">
			<header class="account-address-book-add-modal-header">
				<h3 class="account-address-book-add-modal-title">
					{{ modal_title }}
				</h3>

				<button
					type="button"
					class="account-address-book-add-modal-close"
					aria-label="Close add address modal"
					data-testid="account-address-book-add-modal-close"
					@click="closeModal"
				>
					<UiIcon name="regular-times" :size="24" />
				</button>
			</header>

			<div class="account-address-book-add-modal-body">
				<div class="account-address-book-add-modal-section-group">
					<div class="account-address-book-add-modal-section">
						<div class="account-address-book-add-modal-group">
							<h4 class="account-address-book-add-modal-label">
								{{ t('account.addressBook.addressType') }}
							</h4>

							<div class="account-address-book-add-modal-segment">
								<UiButton
									v-for="option in address_type_options"
									:key="option.value"
									type="button"
									variant="ghost"
									tone="neutral"
									size="40"
									class="account-address-book-add-modal-choice"
									:selected="props.addFormType === option.value"
									:disabled="props.mode === 'edit'"
									@click="emit('set-form-type', option.value)"
								>
									<UiIcon :name="option.icon" :size="24" />
									<span>{{ t(`account.addressBook.${option.label_key}`) }}</span>
								</UiButton>
							</div>

							<p v-if="props.mode === 'edit'" class="account-address-book-add-modal-note">
								<UiIcon name="regular-info-circle" :size="16" />
								<span>{{ edit_address_type_note }}</span>
							</p>
						</div>
					</div>

					<div class="account-address-book-add-modal-section">
						<div class="account-address-book-add-modal-grid account-address-book-add-modal-grid--two">
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
					</div>
				</div>

				<div class="account-address-book-add-modal-bottom-group">
					<div class="account-address-book-add-modal-section">
						<div class="account-address-book-add-modal-group">
							<h4 class="account-address-book-add-modal-label">
								{{ t('account.addressBook.addressLabel') }}
							</h4>

							<div class="account-address-book-add-modal-segment">
								<UiButton
									v-for="option in address_label_options"
									:key="option.value"
									type="button"
									variant="ghost"
									tone="neutral"
									size="40"
									class="account-address-book-add-modal-choice"
									:selected="props.activeAddForm.label === option.value"
									@click="emit('update-field', { field: 'label', value: option.value })"
								>
									<UiIcon :name="option.icon" :size="24" />
									<span>{{ t(`account.addressBook.tags.${option.label_key}`) }}</span>
								</UiButton>
							</div>
						</div>

						<template v-if="hasAddressLines(props.activeAddForm)">
							<UiFormField
								:label="t('account.addressBook.streetAddress')"
								:required="true"
								:show-required-mark="true"
								:error="getFieldError('address_line_1')"
							>
								<template #default="{ inputId, describedBy }">
									<div class="account-address-book-add-modal-stack">
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

							<div class="account-address-book-add-modal-grid account-address-book-add-modal-grid--two">
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
											:placeholder="dynamic_field.field_label"
											:model-value="getDynamicFieldValue(dynamic_field.field_key)"
											:trigger-class="getFieldError(`fields.${dynamic_field.field_key}`) ? 'account-address-book-add-modal-select-trigger--error' : ''"
											@update:model-value="onDynamicSelectChange(dynamic_field.field_key, $event)"
										/>

										<UiInput
											v-if="dynamic_field.input_type === 'text'"
											:id="inputId"
											:aria-describedby="describedBy || undefined"
											:placeholder="dynamic_field.field_label"
											:model-value="getDynamicFieldValue(dynamic_field.field_key)"
											:state="getFieldError(`fields.${dynamic_field.field_key}`) ? 'error' : 'default'"
											@update:model-value="updateDynamicField(dynamic_field.field_key, $event)"
										/>
									</template>
								</UiFormField>
							</div>

							<div
								class="account-address-book-add-modal-grid account-address-book-add-modal-grid--two"
							>
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
									v-if="hasPhoneNumber(props.activeAddForm)"
									:label="t('account.addressBook.phoneNumber')"
									:required="true"
									:show-required-mark="true"
									:error="getFieldError('phone_number')"
								>
									<template #default="{ inputId, describedBy }">
										<div
											class="account-address-book-add-modal-phone"
											:class="{ 'account-address-book-add-modal-phone--error': getFieldError('phone_number') }"
										>
											<div class="account-address-book-add-modal-phone-prefix">+82</div>
											<UiInput
												:id="inputId"
												v-model="phone_number_model"
												type="text"
												size="lg"
												:aria-describedby="describedBy || undefined"
												:placeholder="t('account.addressBook.phonePlaceholder')"
												class="account-address-book-add-modal-phone-input-wrap"
												input-class="account-address-book-add-modal-phone-input"
												:state="getFieldError('phone_number') ? 'error' : 'default'"
											/>
										</div>
									</template>
								</UiFormField>
							</div>
						</template>

						<label class="account-address-book-add-modal-switch">
							<input
								v-model="is_default_model"
								type="checkbox"
								class="account-address-book-add-modal-switch-input"
							>
							<span class="account-address-book-add-modal-switch-track" />
							<span class="account-address-book-add-modal-switch-copy-group">
								<span class="account-address-book-add-modal-switch-copy">
									{{ t('account.addressBook.saveAsDefault') }}
								</span>
								<UiIcon name="regular-question-circle" :size="20" />
							</span>
						</label>
					</div>

					<div class="account-address-book-add-modal-footer-row">
						<div class="account-address-book-add-modal-actions">
							<UiButton
								type="button"
								variant="ghost"
								tone="neutral"
								size="md"
								class="account-address-book-add-modal-cancel"
								@click="closeModal"
							>
								{{ t('account.addressBook.cancel') }}
							</UiButton>

							<UiButton
								type="button"
								variant="filled"
								tone="neutral"
								size="md"
								class="account-address-book-add-modal-save"
								@click="emit('add-address')"
							>
								{{ save_label }}
							</UiButton>
						</div>
					</div>
				</div>
			</div>
		</section>
	</UiModal>
</template>

<style scoped lang="scss">
.account-address-book-add-modal {
	background: var(--contrast-light);
	border-radius: 16px;
	overflow: hidden;
	width: 100%;

	.account-address-book-add-modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 24px;
		border-bottom: 1px solid var(--gray-20);

		.account-address-book-add-modal-title {
			font-size: var(--type-size-300);
			line-height: var(--type-line-300);
			font-weight: var(--font-weight-bold);
			color: var(--text-primary);
		}

		.account-address-book-add-modal-close {
			display: grid;
			place-items: center;
			padding: 0;
			border: 0;
			background: transparent;
			cursor: pointer;
			color: var(--text-primary);
		}
	}

	.account-address-book-add-modal-body {
		display: flex;
		flex-direction: column;
		gap: 40px;
		padding: 24px;
	}

	.account-address-book-add-modal-section {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.account-address-book-add-modal-section-group {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.account-address-book-add-modal-bottom-group {
		display: flex;
		flex-direction: column;
		gap: 24px;
	}

	.account-address-book-add-modal-group {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.account-address-book-add-modal-note {
		display: inline-flex;
		align-items: flex-start;
		gap: 8px;
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: 1.6;
	}

	.account-address-book-add-modal-label {
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

	.account-address-book-add-modal-segment {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}

	.account-address-book-add-modal-choice {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 1px solid var(--gray-50);
		border-radius: 10px;
		color: var(--text-primary);
		background: var(--contrast-light);
	}

	:deep(.account-address-book-add-modal-choice .ui-button-indicator) {
		display: none;
	}

	.account-address-book-add-modal-choice:hover {
		background: var(--gray-20);
		border-color: var(--gray-50);
		color: var(--text-primary);
	}

	.account-address-book-add-modal-choice[data-selected='true'] {
		background: var(--gray-20);
		border-color: var(--gray-60);
		color: var(--text-primary);
	}

	.account-address-book-add-modal-choice:disabled {
		cursor: default;
		opacity: 0.56;
	}

	.account-address-book-add-modal-grid {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		gap: 16px;

		&.account-address-book-add-modal-grid--two {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			column-gap: 14px;
		}
	}

	.account-address-book-add-modal-stack {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.account-address-book-add-modal-grid-spacer {
		min-height: 1px;
	}

	.account-address-book-add-modal-phone {
		display: grid;
		grid-template-columns: 54px minmax(0, 1fr);
		border: 1px solid var(--gray-40);
		border-radius: 8px;
		overflow: hidden;
		background: var(--contrast-light);
		transition: border-color 0.15s ease;

		&:hover {
			border-color: var(--border-strong);
		}

		&:focus-within {
			border-color: var(--border-strong);
		}

		.account-address-book-add-modal-phone-prefix {
			display: grid;
			place-items: center;
			border-right: 1px solid var(--gray-40);
			background: var(--gray-10);
			color: var(--text-primary);
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-regular);
		}
	}

	:deep(.account-address-book-add-modal-phone-input-wrap) {
		width: 100%;
		border: 0;
		border-radius: 0;
		box-shadow: none;
		background: transparent;
		min-height: 40px;
		height: 100%;
		padding-inline: 0;
		gap: 0;
	}

	:deep(.account-address-book-add-modal-phone-input) {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		height: 100%;
		min-height: 40px;
		padding: 0 16px;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	:deep(.account-address-book-add-modal-province-trigger) {
		border-radius: 8px;
	}

	:deep(.account-address-book-add-modal-select-trigger--error) {
		border-color: var(--error);
	}

	.account-address-book-add-modal-phone--error {
		border-color: var(--error);
	}

	.account-address-book-add-modal-footer-row {
		display: flex;
		justify-content: flex-end;
	}

	.account-address-book-add-modal-switch {
		position: relative;
		display: inline-flex;
		align-items: center;
		gap: 12px;
		cursor: pointer;

		.account-address-book-add-modal-switch-input {
			position: absolute;
			opacity: 0;
			pointer-events: none;
		}

		.account-address-book-add-modal-switch-track {
			position: relative;
			width: 36px;
			height: 20px;
			border-radius: 999px;
			border: 1px solid var(--gray-60);
			background: var(--contrast-light);
			flex-shrink: 0;

			&::after {
				content: '';
				position: absolute;
				top: 50%;
				left: 2px;
				width: 14px;
				height: 14px;
				border-radius: 50%;
				background: var(--black-base);
				transform: translateY(-50%);
				transition: transform 0.2s ease;
			}
		}

		.account-address-book-add-modal-switch-copy {
			font-size: var(--type-size-100);
			line-height: var(--type-line-100);
			font-weight: var(--font-weight-semibold);
			color: var(--text-primary);
		}

		.account-address-book-add-modal-switch-copy-group {
			display: inline-flex;
			align-items: center;
			gap: 4px;
		}

		.account-address-book-add-modal-switch-input:checked + .account-address-book-add-modal-switch-track {
			background: var(--text-primary);
			border-color: var(--text-primary);
		}

		.account-address-book-add-modal-switch-input:checked + .account-address-book-add-modal-switch-track::after {
			background: var(--contrast-light);
			transform: translate(16px, -50%);
		}
	}

	.account-address-book-add-modal-actions {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		margin-left: auto;
	}

	.account-address-book-add-modal-cancel {
		padding-inline: 12px;
	}

	.account-address-book-add-modal-save {
		min-width: 74px;
		border-radius: 18px;
	}
}

:global(.account-address-book-add-modal-shell) {
	max-width: 710px;
	border-radius: 16px;
	overflow: hidden;
}

@media (max-width: 767px) {
	.account-address-book-add-modal {
		.account-address-book-add-modal-body {
			padding: 20px;
		}

		.account-address-book-add-modal-segment,
		.account-address-book-add-modal-grid.account-address-book-add-modal-grid--two {
			grid-template-columns: minmax(0, 1fr);
		}

		.account-address-book-add-modal-footer-row {
			flex-direction: column;
			align-items: stretch;
		}

		.account-address-book-add-modal-actions {
			width: 100%;
			justify-content: flex-end;
		}
	}
}
</style>