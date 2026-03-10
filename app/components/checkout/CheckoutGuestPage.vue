<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCheckoutGuest } from '~/composables/checkout/useCheckoutGuest';
import { useCountry } from '@/composables/app/useCountry';
import { useCheckoutCompletion } from '~/composables/checkout/useCheckoutCompletion';
import {
	checkoutFieldValidation,
	checkoutPaymentBrands,
	checkoutPaymentMethods,
	checkoutShippingMethods,
	type CheckoutPaymentMethodKey,
	type CheckoutShippingMethodKey,
} from '~/data/checkout/options';

const { t } = useI18n();
const { withCountry } = useCountry();

const {
	provinceOptions,
	email,
	fullName,
	company,
	address1,
	address2,
	province,
	city,
	postalCode,
	phone,
	cardNumber,
	expiry,
	cvv,
	useShippingAsBilling,
	selectedCheckoutItems,
	orderTotal,
	orderDiscount,
	orderShippingFee,
	orderSubtotal,
	formatPrice,
	sizeDimOnly,
} = useCheckoutGuest();

const activeShippingMethods = computed(() =>
	checkoutShippingMethods.filter((method) => method.enabled !== false).map((method) => ({ ...method }))
);
const activePaymentMethods = computed(() =>
	checkoutPaymentMethods.filter((method) => method.enabled !== false).map((method) => ({ ...method }))
);

const selectedShippingMethod = ref<CheckoutShippingMethodKey>(
	activeShippingMethods.value.find((method) => method.defaultSelected)?.key || 'express'
);
const selectedPaymentMethod = ref<CheckoutPaymentMethodKey>(
	activePaymentMethods.value.find((method) => method.defaultSelected)?.key || 'credit-card'
);

const fieldValidationByKey = computed(() =>
	Object.fromEntries(checkoutFieldValidation.map((rule) => [rule.fieldKey, rule]))
);
const emailLabelText = computed(() => t('checkout.guest.fields.email.label'));

const { completingCheckout, completeLoaderRef, completeCheckout } = useCheckoutCompletion({
	redirectPath: withCountry('/checkout/confirmation'),
});

function itemMeta(sizeLabel: string, qty: number) {
	return t('checkout.guest.summary.itemMeta', {
		size: sizeDimOnly(sizeLabel),
		qty: qty.toLocaleString(),
	});
}
</script>

<template>
	<CheckoutPageBase
		page-class="checkout-page"
		shell-class="checkout-page-shell"
		main-class="checkout-form-column"
		summary-class="checkout-summary-column"
		test-id="checkout-page"
		loading-test-id="checkout-complete-loading-overlay"
		:loading="completingCheckout"
		:loading-label="t('checkout.guest.completeCheckout')"
	>
		<template #loader>
			<div ref="completeLoaderRef" />
		</template>

		<template #main>
			<section class="checkout-section checkout-panel">
				<div class="checkout-section-title">{{ t('checkout.guest.contactInformation') }}</div>
				<div class="checkout-contact-group">
					<div class="checkout-contact-head">
						<div class="checkout-contact-label-wrap">
							<span class="checkout-label">
								{{ emailLabelText }}
								<span class="checkout-label-required" aria-hidden="true">*</span>
							</span>
							<UiIcon name="regular-question-circle" size="20" color="var(--text-secondary)" decorative />
						</div>
						<div class="checkout-login-link">
							<span class="checkout-login-link-text">{{ t('checkout.guest.loginPrompt') }}</span>
							<NuxtLink :to="withCountry('/auth/login')" class="checkout-login-link-action">{{ t('checkout.guest.login') }}</NuxtLink>
						</div>
					</div>
					<UiInput
						v-model="email"
						type="email"
						size="lg"
						class="checkout-input"
						:maxlength="fieldValidationByKey.email?.maxLength"
						:placeholder="t('checkout.guest.fields.email.placeholder')"
					/>
				</div>
			</section>

			<section class="checkout-section checkout-panel">
				<div class="checkout-section-title">{{ t('checkout.guest.shippingInformation') }}</div>
				<div class="checkout-section-content-group">
					<div class="checkout-grid checkout-grid-2">
						<UiFormField
							class="checkout-field"
							:label="t('checkout.guest.fields.fullName.label')"
							:required="true"
							:show-required-mark="true"
							head-class="checkout-form-field-head"
							label-class="checkout-form-field-label"
							label-text-class="checkout-form-field-label-text"
						>
							<UiInput v-model="fullName" type="text" size="lg" class="checkout-input" :maxlength="fieldValidationByKey.fullName?.maxLength" :placeholder="t('checkout.guest.fields.fullName.placeholder')" />
						</UiFormField>
						<UiFormField
							class="checkout-field"
							:label="t('checkout.guest.fields.company.label')"
							head-class="checkout-form-field-head"
							label-class="checkout-form-field-label"
							label-text-class="checkout-form-field-label-text"
						>
							<UiInput v-model="company" type="text" size="lg" class="checkout-input" :maxlength="fieldValidationByKey.company?.maxLength" :placeholder="t('checkout.guest.fields.company.placeholder')" />
						</UiFormField>
					</div>

					<UiFormField
						class="checkout-field"
						:label="t('checkout.guest.fields.streetAddress.label')"
						:required="true"
						:show-required-mark="true"
						head-class="checkout-form-field-head"
						label-class="checkout-form-field-label"
						label-text-class="checkout-form-field-label-text"
					>
						<UiInput v-model="address1" type="text" size="lg" class="checkout-input" :maxlength="fieldValidationByKey.streetAddress?.maxLength" :placeholder="t('checkout.guest.fields.streetAddress.line1Placeholder')" />
						<UiInput v-model="address2" type="text" size="lg" class="checkout-input" :maxlength="fieldValidationByKey.streetAddress?.maxLength" :placeholder="t('checkout.guest.fields.streetAddress.line2Placeholder')" />
					</UiFormField>

					<div class="checkout-grid checkout-grid-2">
						<UiFormField
							class="checkout-field"
							:label="t('checkout.guest.fields.province.label')"
							:required="true"
							:show-required-mark="true"
							head-class="checkout-form-field-head"
							label-class="checkout-form-field-label"
							label-text-class="checkout-form-field-label-text"
						>
							<UiSelect
								:model-value="province"
								:options="provinceOptions"
								:placeholder="t('checkout.guest.fields.province.placeholder')"
								class="checkout-select"
								@update:model-value="province = String($event)"
							/>
						</UiFormField>
						<UiFormField
							class="checkout-field"
							:label="t('checkout.guest.fields.city.label')"
							:required="true"
							:show-required-mark="true"
							head-class="checkout-form-field-head"
							label-class="checkout-form-field-label"
							label-text-class="checkout-form-field-label-text"
						>
							<UiInput v-model="city" type="text" size="lg" class="checkout-input" :maxlength="fieldValidationByKey.city?.maxLength" :placeholder="t('checkout.guest.fields.city.placeholder')" />
						</UiFormField>
					</div>

					<div class="checkout-grid checkout-grid-2">
						<UiFormField
							class="checkout-field"
							:label="t('checkout.guest.fields.postalCode.label')"
							:required="true"
							:show-required-mark="true"
							head-class="checkout-form-field-head"
							label-class="checkout-form-field-label"
							label-text-class="checkout-form-field-label-text"
						>
							<UiInput v-model="postalCode" type="text" size="lg" class="checkout-input" :maxlength="fieldValidationByKey.postalCode?.maxLength" :placeholder="t('checkout.guest.fields.postalCode.placeholder')" />
						</UiFormField>
						<UiFormField
							class="checkout-field"
							:label="t('checkout.guest.fields.phone.label')"
							head-class="checkout-form-field-head"
							label-class="checkout-form-field-label"
							label-text-class="checkout-form-field-label-text"
						>
							<div class="checkout-phone-field">
								<div class="checkout-phone-prefix">+82</div>
								<UiInput
									v-model="phone"
									type="text"
									size="lg"
									class="checkout-input checkout-phone-input"
									:maxlength="fieldValidationByKey.phone?.maxLength"
									:placeholder="t('checkout.guest.fields.phone.placeholder')"
								/>
							</div>
						</UiFormField>
					</div>

					<div class="checkout-shipping-method-wrap">
						<div class="checkout-shipping-method-head">
							<div class="checkout-label">{{ t('checkout.guest.shippingMethod') }}</div>
							<div class="checkout-shipping-note">{{ t('checkout.guest.shippingNote') }}</div>
						</div>
						<div class="checkout-grid checkout-grid-2">
							<button
								v-for="method in activeShippingMethods"
								:key="method.key"
								type="button"
								class="checkout-shipping-method-card"
								:class="{ 'is-active': selectedShippingMethod === method.key }"
								:aria-pressed="selectedShippingMethod === method.key"
								@click="selectedShippingMethod = method.key"
							>
								<img :src="method.icon" :alt="t(`${method.i18nKey}.alt`)" class="checkout-shipping-method-icon">
								<div class="checkout-shipping-method-content">
									<div class="checkout-shipping-method-main">
										<div class="checkout-shipping-method-name">{{ t(`${method.i18nKey}.name`) }}</div>
										<div class="checkout-shipping-method-date">{{ t(`${method.i18nKey}.date`) }}</div>
									</div>
									<div class="checkout-shipping-method-price">{{ t(`${method.i18nKey}.price`) }}</div>
								</div>
							</button>
						</div>
					</div>
				</div>
			</section>

			<section class="checkout-section checkout-panel">
				<div class="checkout-section-title">{{ t('checkout.guest.payment') }}</div>
				<div class="checkout-payment-group">
					<div class="checkout-grid checkout-grid-2">
						<button
							v-for="method in activePaymentMethods"
							:key="method.key"
							type="button"
							class="checkout-pay-btn"
							:class="{ 'is-active': selectedPaymentMethod === method.key }"
							:aria-pressed="selectedPaymentMethod === method.key"
							@click="selectedPaymentMethod = method.key"
						>
							<img :src="method.icon" :alt="t(`checkout.guest.paymentMethods.${method.i18nKey}.alt`)" class="checkout-pay-btn-icon">
							<span class="checkout-pay-btn-label">{{ t(`checkout.guest.paymentMethods.${method.i18nKey}.label`) }}</span>
						</button>
					</div>
					<div class="checkout-payment-meta">
						<div class="checkout-subnote">{{ t('checkout.guest.paymentSubnote') }}</div>
						<div class="checkout-payment-brands">
							<span v-for="brand in checkoutPaymentBrands" :key="brand.key" class="checkout-payment-brand">
								<img :src="brand.icon" :alt="brand.label" class="checkout-payment-brand-icon" loading="lazy">
							</span>
						</div>
					</div>
				</div>

				<div class="checkout-grid checkout-grid-2">
					<UiFormField
						class="checkout-field checkout-field-full"
						:label="t('checkout.guest.fields.cardNumber.label')"
						:required="true"
						:show-required-mark="true"
						head-class="checkout-form-field-head"
						label-class="checkout-form-field-label"
						label-text-class="checkout-form-field-label-text"
					>
						<UiInput v-model="cardNumber" type="text" size="lg" class="checkout-input" :maxlength="fieldValidationByKey.cardNumber?.maxLength" :placeholder="t('checkout.guest.fields.cardNumber.placeholder')" />
					</UiFormField>
					<UiFormField
						class="checkout-field"
						:label="t('checkout.guest.fields.expiration.label')"
						:required="true"
						:show-required-mark="true"
						head-class="checkout-form-field-head"
						label-class="checkout-form-field-label"
						label-text-class="checkout-form-field-label-text"
					>
						<UiInput v-model="expiry" type="text" size="lg" class="checkout-input" :maxlength="fieldValidationByKey.expiration?.maxLength" :placeholder="t('checkout.guest.fields.expiration.placeholder')" />
					</UiFormField>
					<UiFormField
						class="checkout-field"
						:label="t('checkout.guest.fields.cvv.label')"
						:required="true"
						:show-required-mark="true"
						head-class="checkout-form-field-head"
						label-class="checkout-form-field-label"
						label-text-class="checkout-form-field-label-text"
					>
						<UiInput v-model="cvv" type="text" size="lg" class="checkout-input" :maxlength="fieldValidationByKey.cvv?.maxLength" :placeholder="t('checkout.guest.fields.cvv.placeholder')" />
					</UiFormField>
				</div>

				<UiCheckbox v-model="useShippingAsBilling" class="checkout-checkbox">{{ t('checkout.guest.useShippingAsBilling') }}</UiCheckbox>
				<button type="button" class="checkout-billing-link">{{ t('checkout.guest.viewBillingAddresses') }}</button>
			</section>
		</template>

		<template #summary>
			<CheckoutSummaryCard
				tone="guest"
				:title="t('checkout.guest.orderSummary')"
				:items="selectedCheckoutItems"
				:subtotal-label="t('checkout.guest.summary.subtotal')"
				:shipping-fee-label="t('checkout.guest.summary.shippingFee')"
				:discounts-label="t('checkout.guest.summary.discounts')"
				:total-label="t('checkout.guest.summary.total')"
				:subtotal-value="formatPrice(orderSubtotal)"
				:shipping-fee-value="formatPrice(orderShippingFee)"
				:discount-value="`-${formatPrice(orderDiscount)}`"
				:total-value="formatPrice(orderTotal)"
				:complete-label="t('checkout.guest.completeCheckout')"
				:agreement-prefix="t('checkout.guest.agreement.prefix')"
				:agreement-terms="t('checkout.guest.agreement.terms')"
				:agreement-and="t('checkout.guest.agreement.and')"
				:agreement-privacy="t('checkout.guest.agreement.privacy')"
				:agreement-suffix="t('checkout.guest.agreement.suffix')"
				:terms-path="withCountry('/terms-of-use')"
				:privacy-path="withCountry('/privacy-policy')"
				:disabled="selectedCheckoutItems.length === 0"
				:loading="completingCheckout"
				:size-dim-only="sizeDimOnly"
				:format-price="formatPrice"
				:item-meta="itemMeta"
				@submit="completeCheckout(selectedCheckoutItems.length > 0)"
			/>
		</template>
	</CheckoutPageBase>
</template>

<style lang="scss">
.checkout-page {
	padding: 28px 24px 80px;
	background: var(--bg-page);
	position: relative;

	.checkout-page-shell {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 360px;
		gap: 36px;
	}

	.checkout-summary-column {
		align-self: start;
		position: sticky;
		top: 24px;
	}

	.checkout-form-column {
		display: flex;
		flex-direction: column;
		gap: 24px;
		max-width: 690px;
	}

	.checkout-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.checkout-panel {
		padding: 0;
	}

	.checkout-section-content-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
	}

	.checkout-section-title {
		margin: 0;
		font-size: var(--type-size-300);
		font-weight: var(--font-weight-semibold);
		line-height: var(--type-line-200);
		color: var(--text-primary);
	}

	.checkout-contact-group {
		display: flex;
		flex-direction: column;
		gap: 8px;

		.checkout-contact-head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}
	}

	.checkout-contact-label-wrap {
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}

	.checkout-label-required {
		color: var(--error);
	}

	.checkout-login-link {
		display: inline-flex;
		align-items: center;
		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);

		.checkout-login-link-action {
			margin-left: 4px;
			color: var(--gold-60);
			font-weight: var(--font-weight-semibold);
			text-decoration: underline;
			text-underline-offset: 3px;
			text-decoration-thickness: 2px;
		}
	}

	.checkout-grid {
		display: grid;
		gap: 10px 16px;

		&.checkout-grid-2 {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.checkout-field {
		display: flex;
		flex-direction: column;
		gap: 8px;

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

	.checkout-field-full {
		grid-column: 1 / -1;
	}

	.checkout-label {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
	}

	.checkout-input {
		width: 100%;
		box-shadow: none;
	}

	.checkout-phone-field {
		display: grid;
		grid-template-columns: 104px minmax(0, 1fr);
		border: 1px solid var(--gray-40);
		border-radius: 16px;
		overflow: hidden;
		background: var(--contrast-light);

		.checkout-phone-prefix {
			display: flex;
			align-items: center;
			justify-content: center;
			background: var(--gray-20);
			border-right: 1px solid var(--gray-40);
			font-size: var(--type-size-300);
			line-height: var(--type-line-200);
			font-weight: var(--font-weight-regular);
			color: var(--text-primary);
			padding: 0 16px;
			min-height: 86px;
		}

		.checkout-phone-input {
			width: 100%;

			:deep(.ui-input) {
				border: 0;
				border-radius: 0;
				box-shadow: none;
				background: transparent;
				min-height: 86px;
				height: 100%;
			}

			:deep(.ui-input-field) {
				font-size: var(--type-size-300);
				line-height: var(--type-line-200);
				height: 100%;
				min-height: 86px;
				padding-left: 38px;
			}
		}
	}

	.checkout-select {
		width: 100%;

		:deep(.ui-select-trigger) {
			height: 48px;
			border-radius: 8px;
			box-shadow: none;
		}
	}

	.checkout-pay-btn,
	.checkout-shipping-method-card {
		border: 1px solid var(--gray-40);
		background: var(--contrast-light);
		min-height: 80px;
		border-radius: 10px;
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		color: var(--text-primary);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 16px;

		&.is-active {
			border-color: var(--gray-60);
			background: var(--gray-20);
		}
	}

	.checkout-pay-btn {
		justify-content: center;
	}

	.checkout-shipping-method-card {
		padding: 16px 20px;
		justify-content: space-between;
		text-align: left;
	}

	.checkout-pay-btn-icon {
		width: 48px;
		height: 48px;
		object-fit: contain;
		flex-shrink: 0;
	}

	.checkout-pay-btn-label,
	.checkout-shipping-method-name,
	.checkout-shipping-method-price {
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		color: inherit;
	}

	.checkout-subnote,
	.checkout-shipping-note,
	.checkout-shipping-method-date {
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}

	.checkout-shipping-method-wrap {
		display: flex;
		flex-direction: column;
		gap: 8px;

		.checkout-shipping-method-head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}

		.checkout-shipping-note {
			text-align: right;
		}

		.checkout-shipping-method-icon {
			width: 36px;
			height: 36px;
			object-fit: contain;
			flex-shrink: 0;
		}

		.checkout-shipping-method-main {
			display: flex;
			flex-direction: column;
			gap: 2px;
		}

		.checkout-shipping-method-content {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}
	}

	.checkout-payment-group {
		display: grid;
		gap: 8px;

		.checkout-payment-meta {
			display: flex;
			align-items: center;
			justify-content: space-between;
		}

		.checkout-payment-brands {
			display: flex;
			align-items: center;
			gap: 12px;
			flex-wrap: nowrap;
		}

		.checkout-payment-brand {
			flex: 0 0 58px;
			width: 58px;
			height: 36px;
			border-radius: 10px;
			background: var(--contrast-light);
			display: grid;
			place-items: center;

			.checkout-payment-brand-icon {
				max-width: 100%;
				width: 100%;
				max-height: 25px;
				object-fit: contain;
				display: block;
			}
		}
	}

	.checkout-checkbox {
		margin-top: 2px;
		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}

	.checkout-billing-link {
		border: 0;
		background: transparent;
		margin-left: auto;
		color: var(--gold-60);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		cursor: pointer;
	}
}

@media (max-width: 1100px) {
	.checkout-page {
		.checkout-page-shell {
			grid-template-columns: 1fr;
		}

		.checkout-summary-column {
			position: static;
		}
	}
}

@media (max-width: 760px) {
	.checkout-page {
		padding: 20px 16px 56px;

		.checkout-grid.checkout-grid-2 {
			grid-template-columns: 1fr;
		}

		.checkout-contact-head,
		.checkout-shipping-method-head {
			align-items: flex-start;
			flex-direction: column;
			gap: 4px;
		}

		.checkout-payment-group {
			.checkout-payment-meta {
				align-items: flex-start;
				flex-direction: column;
			}
		}

		.checkout-shipping-note {
			text-align: left;
		}
	}
}
</style>