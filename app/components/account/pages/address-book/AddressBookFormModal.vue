<script setup lang="ts">
import type { icons } from '~/data/ui/icons';
import { useDismissibleTooltip } from '~/composables/checkout/features/useDismissibleTooltip';
import { useAddressBookFeatureContext } from '~/composables/account/addressBook/addressBookFeatureContext';
import { useAddressFormModalHelpers } from '~/composables/account/addressBook/useAddressFormModalHelpers';
import type { AddressLabel, AddressType } from '~/types/address';

type IconName = keyof typeof icons;

const { t: translate } = useI18n();
const address_book_feature_context = useAddressBookFeatureContext();

const is_form_modal_open = address_book_feature_context.is_form_modal_open;
const form_modal_mode = address_book_feature_context.form_modal_mode;
const form_submit_label = address_book_feature_context.form_submit_label;
const form_type = address_book_feature_context.form_type;
const active_form = address_book_feature_context.active_form;
const dynamic_fields = address_book_feature_context.dynamic_fields;
const form_field_errors = address_book_feature_context.form_field_errors;

const setFormType = address_book_feature_context.setFormType;
const updateActiveFormField = address_book_feature_context.updateActiveFormField;
const updateFormDynamicField = address_book_feature_context.updateDynamicField;
const submitAddressForm = address_book_feature_context.submitAddressForm;
const closeFormModal = address_book_feature_context.closeFormModal;

const {
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
} = useAddressFormModalHelpers({
	active_form,
	dynamic_fields,
	form_field_errors,
	updateActiveFormField,
	updateFormDynamicField,
	translate,
})

const default_address_tooltip_open = ref(false)
const default_address_tooltip_ref = ref<HTMLElement | null>(null)

useDismissibleTooltip(default_address_tooltip_ref, default_address_tooltip_open)

const address_type_options: Array<{
	value: AddressType;
	label_key: string;
	icon: IconName;
}> = [
	{ value: 'shipping', label_key: 'shippingTitle', icon: 'regular-truck' },
	{ value: 'billing', label_key: 'billingTitle', icon: 'regular-file-dollar' },
	{ value: 'drop', label_key: 'dropTitle', icon: 'regular-boxes' },
]

const address_label_options: Array<{
	value: AddressLabel;
	label_key: string;
	icon: IconName;
}> = [
	{ value: 'home', label_key: 'home', icon: 'regular-home' },
	{ value: 'office', label_key: 'office', icon: 'regular-building' },
	{ value: 'client', label_key: 'client', icon: 'regular-user-circle' },
]

const modal_title = computed(() => {
	return form_modal_mode.value === 'edit'
		? translate('account.addressBook.editTitle')
		: translate('account.addressBook.addNew')
})

const save_label = computed(() => {
	const label_key = form_submit_label.value || (form_modal_mode.value === 'edit' ? 'update' : 'save')
	return translate(`account.addressBook.${label_key}`)
})

const edit_address_type_note = "Address type can't be changed to maintain data integrity and ensure smooth order processing."

const default_toggle_copy = computed(() => {
	if (form_type.value === 'shipping') return 'Save as my default shipping address'
	if (form_type.value === 'drop') return 'Save as my default drop shipping address'
	return 'Save as my default billing address'
})

const default_address_tooltip_props = {
	side: 'right',
	align: 'start',
	mobileSide: 'bottom',
	tone: 'neutral',
	offset: 10,
	slideDistance: 24,
	contentWidth: '420px',
	contentMinWidth: '420px',
	contentMaxWidth: 'min(420px, calc(100vw - 32px))',
	mobileContentWidth: 'min(320px, calc(100vw - 32px))',
} as const

const default_address_tooltip_content = computed(() => {
	if (form_type.value === 'shipping') {
		return {
			title: 'Default Shipping Address',
			text: 'Choose this option to automatically use this address as your default shipping address for future purchases.',
		}
	}

	if (form_type.value === 'billing') {
		return {
			title: 'Default Billing Address',
			text: 'Choose this option to automatically use this address as your default billing address for future purchases.',
		}
	}

	return {
		title: 'Default Drop Shipping Address',
		text: 'Choose this option to automatically use this address as your default drop shipping address for future purchases.',
	}
})

function closeModal() {
	closeFormModal()
}

function toggleDefaultAddressTooltip() {
	default_address_tooltip_open.value = !default_address_tooltip_open.value
}
</script>

<template>
	<UiModal
		:model-value="is_form_modal_open"
		align="top"
		padding="0"
		gap="0"
		width="710px"
		modal-class="account-address-book-add-modal-shell"
		@update:model-value="!$event ? closeModal() : undefined"
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
								{{ translate('account.addressBook.addressType') }}
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
									:selected="form_type === option.value"
									:disabled="form_modal_mode === 'edit'"
									@click="setFormType(option.value)"
								>
									<UiIcon :name="option.icon" :size="24" />
									<span>{{ translate(`account.addressBook.${option.label_key}`) }}</span>
								</UiButton>
							</div>

							<p v-if="form_modal_mode === 'edit'" class="account-address-book-add-modal-note">
								<UiIcon name="regular-info-circle" :size="16" />
								<span>{{ edit_address_type_note }}</span>
							</p>
						</div>
					</div>

					<div class="account-address-book-add-modal-section">
						<div class="account-address-book-add-modal-grid account-address-book-add-modal-grid--two">
							<UiFormField
								:label="translate('account.addressBook.fullName')"
								:required="true"
								:show-required-mark="true"
								:error="getFieldError('contact_name')"
							>
								<template #default="{ inputId, describedBy }">
									<UiInput
										:id="inputId"
										v-model="contact_name_model"
										:aria-describedby="describedBy || undefined"
										:placeholder="translate('account.addressBook.fullNamePlaceholder')"
										:state="getFieldError('contact_name') ? 'error' : 'default'"
									/>
								</template>
							</UiFormField>

							<UiFormField :label="translate('account.addressBook.companyOptional')">
								<template #label>
									<span class="account-address-book-add-modal-company-label">
										<span class="account-address-book-add-modal-company-label-text">
											Company
										</span>
										<span class="account-address-book-add-modal-company-label-optional">
											(Optional)
										</span>
									</span>
								</template>

								<template #default="{ inputId, describedBy }">
									<UiInput
										:id="inputId"
										v-model="company_model"
										:aria-describedby="describedBy || undefined"
										:placeholder="translate('account.addressBook.companyPlaceholder')"
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
								{{ translate('account.addressBook.addressLabel') }}
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
									:selected="active_form.label === option.value"
									@click="updateActiveFormField({ field: 'label', value: option.value })"
								>
									<UiIcon :name="option.icon" :size="24" />
									<span>{{ translate(`account.addressBook.tags.${option.label_key}`) }}</span>
								</UiButton>
							</div>
						</div>

						<template v-if="hasAddressLines(active_form)">
							<UiFormField
								:label="translate('account.addressBook.streetAddress')"
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
											:placeholder="translate('account.addressBook.addressLine1Placeholder')"
											:state="getFieldError('address_line_1') ? 'error' : 'default'"
										/>
										<UiInput
											v-model="address_line_2_model"
											:placeholder="translate('account.addressBook.addressLine2Placeholder')"
										/>
									</div>
								</template>
							</UiFormField>

							<div class="account-address-book-add-modal-grid account-address-book-add-modal-grid--two">
								<UiFormField
									v-for="(dynamic_field, index) in dynamic_fields"
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
											:trigger-class="getFieldError(`fields.${dynamic_field.field_key}`) ? 'account-address-book-add-modal-select-trigger--error' : ''"
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

							<div
								class="account-address-book-add-modal-grid account-address-book-add-modal-grid--two"
							>
								<UiFormField
									:label="translate('account.addressBook.postalCode')"
									:required="true"
									:show-required-mark="true"
									:error="getFieldError('postcode')"
								>
									<template #default="{ inputId, describedBy }">
										<UiInput
											:id="inputId"
											v-model="postcode_model"
											:aria-describedby="describedBy || undefined"
											:placeholder="translate('account.addressBook.postalCodePlaceholder')"
											:state="getFieldError('postcode') ? 'error' : 'default'"
										/>
									</template>
								</UiFormField>

								<UiFormField
									v-if="hasPhoneNumber(active_form)"
									:label="translate('account.addressBook.phoneNumber')"
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
											:placeholder="translate('account.addressBook.phonePlaceholder')"
											:state="getFieldError('phone_number') ? 'error' : 'default'"
											@beforeinput="onPhoneBeforeInput"
											@paste="onPhonePaste"
										/>
									</template>
								</UiFormField>
							</div>
						</template>

					</div>

					<div class="account-address-book-add-modal-footer-row">
						<div
							ref="default_address_tooltip_ref"
							class="account-address-book-add-modal-switch-row"
						>
							<label class="account-address-book-add-modal-switch">
								<input
									v-model="is_default_model"
									type="checkbox"
									class="account-address-book-add-modal-switch-input"
								>
								<span class="account-address-book-add-modal-switch-track" />
								<span class="account-address-book-add-modal-switch-copy">
									{{ default_toggle_copy }}
								</span>
							</label>

							<UiTooltip :open="default_address_tooltip_open" v-bind="default_address_tooltip_props">
								<template #trigger>
									<button
										type="button"
										class="ui-tooltip-icon-trigger"
										@click.stop.prevent="toggleDefaultAddressTooltip"
									>
										<UiIcon
											:name="default_address_tooltip_open ? 'strong-question-circle' : 'regular-question-circle'"
											:size="24"
											color="var(--gray-90)"
											decorative
										/>
									</button>
								</template>

								<div class="ui-tooltip-copy">
									<strong class="ui-tooltip-title">
										{{ default_address_tooltip_content.title }}
									</strong>
									<p class="ui-tooltip-text">
										{{ default_address_tooltip_content.text }}
									</p>
								</div>
							</UiTooltip>
						</div>
					</div>
				</div>

			</div>

			<footer class="account-address-book-add-modal-footer">
				<div class="account-address-book-add-modal-actions">
					<UiButton
						type="button"
						variant="ghost"
						tone="neutral"
						size="md"
						class="account-address-book-add-modal-cancel"
						@click="closeModal"
					>
						{{ translate('account.addressBook.cancel') }}
					</UiButton>

					<UiButton
						type="button"
						variant="filled"
						tone="neutral"
						size="md"
						class="account-address-book-add-modal-save"
						@click="submitAddressForm"
					>
						{{ save_label }}
					</UiButton>
				</div>
			</footer>
		</section>
	</UiModal>
</template>

<style scoped lang="scss">
.account-address-book-add-modal {
	background: var(--contrast-light);
	border-radius: 16px;
	overflow: visible;
	width: 100%;

	.account-address-book-add-modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 18px 28px;
		border-bottom: 1px solid var(--gray-20);

		.account-address-book-add-modal-title {
			font-size: var(--type-size-350, 2rem);
			line-height: 1.2;
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
			width: 24px;
			height: 24px;
		}
	}

	.account-address-book-add-modal-body {
		display: flex;
		flex-direction: column;
		gap: 36px;
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
		gap: 16px;
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
		line-height: 1.5;
	}

	.account-address-book-add-modal-label {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

	.account-address-book-add-modal-company-label {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.account-address-book-add-modal-company-label-text {
		color: var(--text-primary);
	}

	.account-address-book-add-modal-company-label-optional {
		color: var(--text-secondary);
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

	:deep(.account-address-book-add-modal-choice .ui-button-indicator) {
		display: none;
	}

	.account-address-book-add-modal-choice:hover {
		background: var(--gray-10);
		border-color: var(--gray-50);
		color: var(--text-primary);
	}

	.account-address-book-add-modal-choice[data-selected='true'] {
		background: var(--gray-10);
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
		gap: 18px 14px;

		&.account-address-book-add-modal-grid--two {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			column-gap: 14px;
		}
	}

	.account-address-book-add-modal-stack {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.account-address-book-add-modal-grid-spacer {
		min-height: 1px;
	}

	:deep(.account-address-book-add-modal-province-trigger) {
		border-radius: 8px;
		min-height: 44px;
		box-shadow: none;
	}

	:deep(.account-address-book-add-modal-select-trigger--error) {
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

	.account-address-book-add-modal-footer-row {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 16px;
	}

	.account-address-book-add-modal-switch-row {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.account-address-book-add-modal-footer {
		display: flex;
		justify-content: flex-end;
		padding: 0 24px 24px;
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
	}

	.account-address-book-add-modal-cancel {
		padding-inline: 16px;
		min-height: auto;
		box-shadow: none;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
	}

	.account-address-book-add-modal-save {
		min-width: 84px;
		min-height: 38px;
		border-radius: 999px;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
	}
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

		.account-address-book-add-modal-footer {
			padding: 16px 20px 20px;

			.account-address-book-add-modal-actions {
				width: 100%;
				justify-content: flex-end;
			}
		}
	}
}
</style>