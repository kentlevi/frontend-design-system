<script setup lang="ts">
import type { icons } from '~/data/ui/icons';
import type { AddressSection, AddressType } from '~/types/account/addressBook';

type IconName = keyof typeof icons;
type SelectOption = {
	label: string;
	value: string;
};

const props = defineProps<{
	modelValue: boolean;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();

const { t } = useI18n();

const address_type = ref<AddressSection>('shipping');
const address_label = ref<AddressType>('Home');
const full_name = ref('');
const company = ref('');
const address_line_1 = ref('');
const address_line_2 = ref('');
const province = ref<string | null>(null);
const city = ref('');
const postal_code = ref('');
const phone = ref('');
const is_default = ref(false);

const province_options: SelectOption[] = [
	{ label: 'Seoul', value: 'seoul' },
	{ label: 'Busan', value: 'busan' },
	{ label: 'Incheon', value: 'incheon' },
	{ label: 'Gyeonggi-do', value: 'gyeonggi-do' },
];

const address_type_options: Array<{
	value: AddressSection;
	label_key: string;
	icon: IconName;
}> = [
	{ value: 'shipping', label_key: 'shippingTitle', icon: 'regular-truck' },
	{ value: 'billing', label_key: 'billingTitle', icon: 'regular-invoice-check' },
	{ value: 'dropShipping', label_key: 'dropShippingTitle', icon: 'strong-boxes-full' },
];

const address_label_options: Array<{
	value: AddressType;
	label_key: string;
	icon: IconName;
}> = [
	{ value: 'Home', label_key: 'Home', icon: 'regular-home' },
	{ value: 'Office', label_key: 'Office', icon: 'regular-building' },
	{ value: 'Client', label_key: 'Client', icon: 'regular-user-circle' },
];

function closeModal() {
	emit('update:modelValue', false);
}

function handleSave() {
	closeModal();
}
</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		align="center"
		padding="0"
		gap="0"
		width="710px"
		modal-class="account-address-book-add-modal-shell"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<section class="account-address-book-add-modal" data-testid="account-address-book-add-modal">
			<header class="account-address-book-add-modal-header">
				<h3 class="account-address-book-add-modal-title">
					{{ t('account.addressBook.addNew') }}
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
									tone="default"
									size="40"
									class="account-address-book-add-modal-choice"
									:selected="address_type === option.value"
									@click="address_type = option.value"
								>
									<UiIcon :name="option.icon" :size="24" />
									<span>{{ t(`account.addressBook.${option.label_key}`) }}</span>
								</UiButton>
							</div>
						</div>
					</div>

					<div class="account-address-book-add-modal-section">
						<div class="account-address-book-add-modal-grid account-address-book-add-modal-grid--two">
							<UiFormField
								:label="t('account.addressBook.fullName')"
								:required="true"
								:show-required-mark="true"
							>
								<template #default="{ inputId, describedBy }">
									<UiInput
										:id="inputId"
										v-model="full_name"
										:aria-describedby="describedBy || undefined"
										:placeholder="t('account.addressBook.fullNamePlaceholder')"
									/>
								</template>
							</UiFormField>

							<UiFormField :label="t('account.addressBook.companyOptional')">
								<template #default="{ inputId, describedBy }">
									<UiInput
										:id="inputId"
										v-model="company"
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
									tone="default"
									size="40"
									class="account-address-book-add-modal-choice"
									:selected="address_label === option.value"
									@click="address_label = option.value"
								>
									<UiIcon :name="option.icon" :size="24" />
									<span>{{ t(`account.addressBook.tags.${option.label_key}`) }}</span>
								</UiButton>
							</div>
						</div>
						<UiFormField
							:label="t('account.addressBook.streetAddress')"
							:required="true"
							:show-required-mark="true"
						>
							<template #default="{ inputId, describedBy }">
								<div class="account-address-book-add-modal-stack">
									<UiInput
										:id="inputId"
										v-model="address_line_1"
										:aria-describedby="describedBy || undefined"
										:placeholder="t('account.addressBook.addressLine1Placeholder')"
									/>
									<UiInput
										v-model="address_line_2"
										:placeholder="t('account.addressBook.addressLine2Placeholder')"
									/>
								</div>
							</template>
						</UiFormField>

						<div class="account-address-book-add-modal-grid account-address-book-add-modal-grid--two">
							<UiFormField
								:label="t('account.addressBook.province')"
								:required="true"
								:show-required-mark="true"
							>
								<template #default>
									<UiSelect
										v-model="province"
										:options="province_options"
										:placeholder="t('account.addressBook.provincePlaceholder')"
										trigger-class="account-address-book-add-modal-province-trigger"
									/>
								</template>
							</UiFormField>

							<UiFormField
								:label="t('account.addressBook.city')"
								:required="true"
								:show-required-mark="true"
							>
								<template #default="{ inputId, describedBy }">
									<UiInput
										:id="inputId"
										v-model="city"
										:aria-describedby="describedBy || undefined"
										:placeholder="t('account.addressBook.cityPlaceholder')"
									/>
								</template>
							</UiFormField>
						</div>

						<div class="account-address-book-add-modal-grid account-address-book-add-modal-grid--two">
							<UiFormField
								:label="t('account.addressBook.postalCode')"
								:required="true"
								:show-required-mark="true"
							>
								<template #default="{ inputId, describedBy }">
									<UiInput
										:id="inputId"
										v-model="postal_code"
										:aria-describedby="describedBy || undefined"
										:placeholder="t('account.addressBook.postalCodePlaceholder')"
									/>
								</template>
							</UiFormField>

							<UiFormField
								:label="t('account.addressBook.phoneNumber')"
								:required="true"
								:show-required-mark="true"
							>
								<template #default="{ inputId, describedBy }">
									<div class="account-address-book-add-modal-phone">
										<div class="account-address-book-add-modal-phone-prefix">+82</div>
										<UiInput
											:id="inputId"
											v-model="phone"
											type="text"
											size="lg"
											:aria-describedby="describedBy || undefined"
											:placeholder="t('account.addressBook.phonePlaceholder')"
											class="account-address-book-add-modal-phone-input-wrap"
											input-class="account-address-book-add-modal-phone-input"
										/>
									</div>
								</template>
							</UiFormField>
						</div>

						<label class="account-address-book-add-modal-switch">
							<input
								v-model="is_default"
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
								@click="handleSave"
							>
								{{ t('account.addressBook.save') }}
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