<script setup lang="ts">
import type { icons } from '~/data/ui/icons';
import { useDismissibleTooltip } from '~/composables/checkout/features/useDismissibleTooltip';
import { useAddressBookFormContext } from '~/composables/account/addressBook/context/useAddressBookFormContext';
import AddressFormFields from '~/components/shared/address/AddressFormFields.vue';
import type { AddressType } from '~/types/user-address';
import { useUserAddressUIContext } from '~/composables/account/addressBook/context/useUserAddressUIContext';

type IconName = keyof typeof icons;

const {
	is_form_modal_open,

	closeFormModal
} = useUserAddressUIContext()

const { t: translate } = useI18n();
const address_book_form_context = useAddressBookFormContext();

const form_modal_mode = address_book_form_context.form_modal_mode;
const form_submit_label = address_book_form_context.form_submit_label;
const form_type = address_book_form_context.form_type;
const active_form = address_book_form_context.active_form;
const dynamic_fields = address_book_form_context.dynamic_fields;
const form_field_errors = address_book_form_context.form_field_errors;
const is_submitting = computed(() => address_book_form_context.is_submitting.value)

const setFormType = address_book_form_context.setFormType;
const updateFormFieldByType = address_book_form_context.updateFormFieldByType;
const updateDynamicFieldByType = address_book_form_context.updateDynamicFieldByType;
const submitAddressForm = address_book_form_context.submitAddressForm;

const default_address_tooltip_open = ref(false)
const default_address_tooltip_ref = ref<HTMLElement | null>(null)

useDismissibleTooltip(default_address_tooltip_ref, default_address_tooltip_open)

const is_default_model = computed({
	get: () => active_form.value.is_default ?? false,
	set: (value: boolean) => {
		updateFormFieldByType(active_form.value.type, {
			field: 'is_default',
			value,
		})
	},
})

const address_type_options: Array<{
	value: AddressType;
	label_key: string;
	icon: IconName;
}> = [
	{ value: 'shipping', label_key: 'shippingTitle', icon: 'regular-truck' },
	{ value: 'billing', label_key: 'billingTitle', icon: 'regular-file-dollar' },
	{ value: 'drop', label_key: 'dropTitle', icon: 'regular-boxes' },
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

const edit_address_type_note = computed(() => translate('account.addressBook.editAddressTypeNote'))

const default_toggle_copy = computed(() => {
	if (form_type.value === 'shipping') return translate('account.addressBook.defaultToggleShipping')
	if (form_type.value === 'drop') return translate('account.addressBook.defaultToggleDrop')
	return translate('account.addressBook.defaultToggleBilling')
})

const default_address_tooltip_props = {
	side: 'right',
	align: 'start',
	mobileSide: 'bottom',
	tone: 'neutral',
	offset: 10,
	slideDistance: 24,
	contentWidth: '480px',
	contentMinWidth: '480px',
	contentMaxWidth: 'min(480px, calc(100vw - 32px))',
	mobileContentWidth: 'min(320px, calc(100vw - 32px))',
} as const

const default_address_tooltip_content = computed(() => {
	if (form_type.value === 'shipping') {
		return {
			title: translate('account.addressBook.defaultTooltipShippingTitle'),
			text: translate('account.addressBook.defaultTooltipShippingText'),
		}
	}

	if (form_type.value === 'billing') {
		return {
			title: translate('account.addressBook.defaultTooltipBillingTitle'),
			text: translate('account.addressBook.defaultTooltipBillingText'),
		}
	}

	return {
		title: translate('account.addressBook.defaultTooltipDropTitle'),
		text: translate('account.addressBook.defaultTooltipDropText'),
	}
})

function toggleDefaultAddressTooltip() {
	default_address_tooltip_open.value = !default_address_tooltip_open.value
}

async function handleSubmit() {
	if (is_submitting.value) return
	await submitAddressForm()
}
</script>

<template>
	<UiModal
		:model-value="is_form_modal_open"
		align="top"
		width="710px"
		:title="modal_title"
		modal-class="account-address-book-add-modal-shell"
		:close-on-backdrop="false"
		@update:model-value="!$event ? closeFormModal() : undefined"
	>
		<template #overlay>
			<UiLoadingOverlay
				:visible="is_submitting"
				variant="modal"
				position="absolute"
				:label="translate('account.addressBook.saving')"
			/>
		</template>

		<section class="account-address-book-add-modal" data-testid="account-address-book-add-modal">
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
									:disabled="form_modal_mode === 'edit' || is_submitting"
									@click="setFormType(option.value)"
								>
									<UiIcon :name="option.icon" :size="24" />
									<span>{{ translate(`account.addressBook.${option.label_key}`) }}</span>
								</UiButton>
							</div>

							<p v-if="form_modal_mode === 'edit'" class="account-address-book-add-modal-note">
								<UiIcon name="regular-info-circle" :size="20" color="var(--gray-90)" />
								<span>{{ edit_address_type_note }}</span>
							</p>
						</div>
					</div>
				</div>

				<div class="account-address-book-add-modal-bottom-group">
					<AddressFormFields
						:form="active_form"
						:errors="form_field_errors"
						:dynamic-fields="dynamic_fields"
						copy-context="addressBook"
						:show-label-selector="true"
						@update:field="updateFormFieldByType"
						@update:dynamic-field="updateDynamicFieldByType"
					/>

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
		</section>

		<template #footer>
			<div class="account-address-book-add-modal-actions ui-modal-footer-item">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="md"
					class="account-address-book-add-modal-cancel"
					:disabled="is_submitting"
					@click="closeFormModal"
				>
					{{ translate('account.addressBook.cancel') }}
				</UiButton>

				<UiButton
					type="button"
					variant="filled"
					tone="neutral"
					size="md"
					class="account-address-book-add-modal-save"
					:disabled="is_submitting"
					@click="handleSubmit"
				>
					{{ save_label }}
				</UiButton>
			</div>
		</template>
	</UiModal>
</template>

<style scoped lang="scss">
.account-address-book-add-modal {
	background: var(--contrast-light);
	border-radius: 16px;
	overflow: visible;
	width: 100%;

	.account-address-book-add-modal-body {
		display: flex;
		flex-direction: column;
		gap: 40px;
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
		gap: 8px;
	}

	.account-address-book-add-modal-note {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}

	.account-address-book-add-modal-label {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
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
	}

	:deep(.account-address-book-add-modal-choice .ui-button-indicator) {
		display: none;
	}

	.account-address-book-add-modal-choice.ui-button:hover:not(:disabled) {
		background: var(--gray-10);
		border-color: var(--gray-50);
		color: var(--text-primary);
	}

	.account-address-book-add-modal-choice.ui-button[data-selected='true'] {
		background: var(--gray-10);
		border-color: var(--gray-60);
		color: var(--text-primary);

		&:hover:not(:disabled) {
			background: var(--gray-10);
			border-color: var(--gray-60);
		}
	}

	.account-address-book-add-modal-choice:disabled {
		background: var(--gray-10);
		border-color: var(--gray-30);
		color: var(--gray-50);
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

		.account-address-book-add-modal-segment {
			grid-template-columns: minmax(0, 1fr);
		}

		.account-address-book-add-modal-footer-row {
			flex-direction: column;
			align-items: stretch;
		}

		:deep(.ui-modal-footer) {
			padding: 0 20px 20px;

			.account-address-book-add-modal-actions {
				width: 100%;
				justify-content: flex-end;
			}
		}
	}
}
</style>