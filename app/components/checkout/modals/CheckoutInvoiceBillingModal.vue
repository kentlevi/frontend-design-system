<script setup lang="ts">
import { reactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';

type BillingDetails = {
	fullName: string;
	company: string;
	address1: string;
	address2: string;
	province: string;
	city: string;
	postalCode: string;
};

const props = defineProps<{
	modelValue: boolean;
	value: BillingDetails;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'save', value: BillingDetails): void;
}>();

const { t } = useI18n();

const province_options = [
	{ value: 'incheon', label: 'Incheon' },
	{ value: 'seoul', label: 'Seoul' },
	{ value: 'busan', label: 'Busan' },
];

const form = reactive<BillingDetails>({
	fullName: '',
	company: '',
	address1: '',
	address2: '',
	province: '',
	city: '',
	postalCode: '',
});

watch(
	() => props.modelValue,
	(is_open) => {
		if (!is_open) return;
		Object.assign(form, props.value);
	},
	{ immediate: true }
);

function closeModal() {
	emit('update:modelValue', false);
}

function saveBillingDetails() {
	emit('save', { ...form });
	closeModal();
}
</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		align="top"
		width="720px"
		padding="0"
		gap="0"
		modal-class="checkout-invoice-billing-modal-shell"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<section class="checkout-invoice-billing-modal">
			<header class="checkout-invoice-billing-modal-header">
				<h3 class="checkout-invoice-billing-modal-title">{{ t('checkout.invoice.billingModal.title') }}</h3>
				<button
					type="button"
					class="checkout-invoice-billing-modal-close"
					:aria-label="t('checkout.invoice.billingModal.closeModal')"
					@click="closeModal"
				>
					<UiIcon name="regular-times" size="24" color="var(--text-primary)" decorative />
				</button>
			</header>

			<div class="checkout-invoice-billing-modal-body">
				<div class="checkout-invoice-billing-modal-grid">
					<UiFormField
						:label="t('checkout.guest.fields.fullName.label')"
						:required="true"
						:show-required-mark="true"
						head-class="checkout-form-field-head"
						label-class="checkout-form-field-label"
						label-text-class="checkout-form-field-label-text"
					>
						<UiInput v-model="form.fullName" size="md" />
					</UiFormField>

					<UiFormField
						:label="t('checkout.guest.fields.company.label')"
						head-class="checkout-form-field-head"
						label-class="checkout-form-field-label"
						label-text-class="checkout-form-field-label-text"
					>
						<UiInput v-model="form.company" size="md" />
					</UiFormField>
				</div>

				<div class="checkout-invoice-billing-modal-stack">
					<UiFormField
						:label="t('checkout.guest.fields.streetAddress.label')"
						:required="true"
						:show-required-mark="true"
						head-class="checkout-form-field-head"
						label-class="checkout-form-field-label"
						label-text-class="checkout-form-field-label-text"
					>
						<UiInput v-model="form.address1" size="md" />
					</UiFormField>

					<UiInput v-model="form.address2" size="md" :placeholder="t('checkout.guest.fields.streetAddress.line2Placeholder')" />
				</div>

				<div class="checkout-invoice-billing-modal-grid">
					<UiFormField
						:label="t('checkout.guest.fields.province.label')"
						:required="true"
						:show-required-mark="true"
						head-class="checkout-form-field-head"
						label-class="checkout-form-field-label"
						label-text-class="checkout-form-field-label-text"
					>
						<UiSelect
							:model-value="form.province"
							:options="province_options"
							class="checkout-invoice-billing-modal-select"
							trigger-class="checkout-invoice-billing-modal-select-trigger"
							@update:model-value="form.province = String($event)"
						/>
					</UiFormField>

					<UiFormField
						:label="t('checkout.guest.fields.city.label')"
						:required="true"
						:show-required-mark="true"
						head-class="checkout-form-field-head"
						label-class="checkout-form-field-label"
						label-text-class="checkout-form-field-label-text"
					>
						<UiInput v-model="form.city" size="md" />
					</UiFormField>
				</div>

				<div class="checkout-invoice-billing-modal-grid checkout-invoice-billing-modal-grid--postal">
					<UiFormField
						:label="t('checkout.guest.fields.postalCode.label')"
						:required="true"
						:show-required-mark="true"
						head-class="checkout-form-field-head"
						label-class="checkout-form-field-label"
						label-text-class="checkout-form-field-label-text"
					>
						<UiInput v-model="form.postalCode" size="md" />
					</UiFormField>
				</div>
			</div>

			<footer class="checkout-invoice-billing-modal-footer">
				<UiButton type="button" variant="ghost" tone="neutral" size="sm" :no-hover="true" @click="closeModal">
					{{ t('checkout.invoice.billingModal.cancel') }}
				</UiButton>
				<UiButton type="button" variant="filled" tone="neutral" size="md" @click="saveBillingDetails">
					{{ t('checkout.invoice.billingModal.save') }}
				</UiButton>
			</footer>
		</section>
	</UiModal>
</template>

<style scoped lang="scss">
:global(.ui-modal.checkout-invoice-billing-modal-shell) {
	width: min(720px, calc(100vw - 32px));
	padding: 0;
	gap: 0;
}

.checkout-invoice-billing-modal {
	display: grid;
	grid-template-rows: auto minmax(0, 1fr) auto;
	max-height: min(760px, calc(100vh - 40px));
	overflow: hidden;

	.checkout-invoice-billing-modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 20px 24px;
		border-bottom: 1px solid var(--gray-40);
	}

	.checkout-invoice-billing-modal-title {
		font-size: var(--type-size-200);
		line-height: var(--type-line-200);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
	}

	.checkout-invoice-billing-modal-close {
		border: 0;
		background: transparent;
		padding: 0;
		width: 24px;
		height: 24px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.checkout-invoice-billing-modal-body {
		display: grid;
		gap: 18px;
		padding: 24px;
		overflow-y: visible;
	}

	.checkout-invoice-billing-modal-grid,
	.checkout-invoice-billing-modal-stack {
		display: grid;
		gap: 14px 16px;
	}

	.checkout-invoice-billing-modal-grid {
		grid-template-columns: repeat(2, minmax(0, 1fr));

		&.checkout-invoice-billing-modal-grid--postal {
			grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);

			> *:first-child {
				grid-column: span 1;
			}
		}
	}

	.checkout-invoice-billing-modal-select {
		width: 100%;
	}

	.checkout-invoice-billing-modal-footer {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 12px;
		padding: 16px 24px 24px;
		border-top: 1px solid var(--gray-40);
	}

	.checkout-form-field-head {
		.checkout-form-field-label {
			.checkout-form-field-label-text {
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-semibold);
				color: var(--text-primary);
			}
		}
	}
}

:global(.ui-select-trigger.checkout-invoice-billing-modal-select-trigger) {
	height: 44px;
	border-radius: 8px;
	box-shadow: none;
}

@media (max-width: 720px) {
	.checkout-invoice-billing-modal {
		.checkout-invoice-billing-modal-body {
			padding: 20px 16px;
		}

		.checkout-invoice-billing-modal-grid {
			grid-template-columns: 1fr;
		}

		.checkout-invoice-billing-modal-footer {
			padding: 16px;
		}
	}
}
</style>