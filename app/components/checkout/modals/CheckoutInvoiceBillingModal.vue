<script setup lang="ts">
import AddressFormFields from '~/components/shared/address/AddressFormFields.vue';
import { useCheckoutInvoiceBillingModal } from '~/composables/checkout/invoice/billing-address/useCheckoutInvoiceBillingModal';

const {
	translate,

	billing_modal_open,
	billing_form,
	form_field_errors,

	updateFormFieldByType,
	updateDynamicFieldByType,
	closeModal,
	saveBillingDetails,
} = useCheckoutInvoiceBillingModal()
</script>

<template>
	<UiModal
		:model-value="billing_modal_open"
		align="top"
		width="720px"
		padding="0"
		gap="0"
		modal-class="checkout-invoice-billing-modal-shell"
		@update:model-value="closeModal"
	>
		<section class="checkout-invoice-billing-modal">
			<header class="checkout-invoice-billing-modal-header">
				<h3 class="checkout-invoice-billing-modal-title">{{ translate('checkout.invoice.billingModal.title') }}</h3>
				<button
					type="button"
					class="checkout-invoice-billing-modal-close"
					:aria-label="translate('checkout.invoice.billingModal.closeModal')"
					@click="closeModal"
				>
					<UiIcon name="regular-times" size="24" color="var(--text-primary)" decorative />
				</button>
			</header>

			<AddressFormFields
				:form="billing_form"
				:errors="form_field_errors"
				@update:field="updateFormFieldByType"
				@update:dynamic-field="updateDynamicFieldByType"
			/>

			<footer class="checkout-invoice-billing-modal-footer">
				<UiButton type="button" variant="ghost" tone="neutral" size="sm" :no-hover="true" @click="closeModal">
					{{ translate('checkout.invoice.billingModal.cancel') }}
				</UiButton>
				<UiButton type="button" variant="filled" tone="neutral" size="md" @click="saveBillingDetails">
					{{ translate('checkout.invoice.billingModal.save') }}
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