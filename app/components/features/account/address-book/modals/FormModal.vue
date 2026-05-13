<script setup lang="ts">
import AddressFormFields from '~/components/shared/address/AddressFormFields.vue';
import { useAddressBookFormModalUI } from '~/composables/account/addressBook/useAddressBookFormModalUI';
import { useAddressBookFormModal } from '~/composables/account/addressBook/useAddressBookFormModal';

const {
	translate,

	form_type,
	is_form_modal_open,
	form_modal_mode,
	default_address_tooltip_open,
	default_address_tooltip_ref,
	address_type_options,
	default_address_tooltip_props,
	save_label,
	default_toggle_copy,
	default_address_tooltip_content,
	modal_title,

	closeFormModal,
	toggleDefaultAddressTooltip,
} = useAddressBookFormModalUI()

const {
	active_form,
	form_field_errors,
	dynamic_fields,
	is_submitting,
	is_default_model,

	updateFormFieldByType,
	updateDynamicFieldByType,
	setFormType,
	submitForm,
} = useAddressBookFormModal()
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
								<span>{{ translate('account.addressBook.editAddressTypeNote') }}</span>
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
					@click="submitForm"
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
