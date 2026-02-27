<script setup lang="ts">
import { computed, ref } from 'vue';
import { useCheckoutGuest } from '~/composables/checkout/useCheckoutGuest';
import { useCountry } from '@/composables/app/useCountry';
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
    checkoutShippingMethods.filter((method) => method.enabled !== false)
);
const activePaymentMethods = computed(() =>
    checkoutPaymentMethods.filter((method) => method.enabled !== false)
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
</script>

<template>
    <main class="checkout-page" data-testid="checkout-page">
        <section class="checkout-page-shell">
            <section class="checkout-form-column">
                <section class="checkout-section checkout-panel">
                    <div class="checkout-section-title">{{ t('checkout.guest.contactInformation') }}</div>
                    <div class="checkout-contact-head">
                        <span class="checkout-label">{{ t('checkout.guest.fields.email.label') }}</span>
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
                </section>

                <section class="checkout-section checkout-panel">
                    <div class="checkout-section-title">{{ t('checkout.guest.shippingInformation') }}</div>
                    <div class="checkout-grid checkout-grid-2">
                        <UiFormField class="checkout-field" :label="t('checkout.guest.fields.fullName.label')">
                            <UiInput
                                v-model="fullName"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                :maxlength="fieldValidationByKey.fullName?.maxLength"
                                :placeholder="t('checkout.guest.fields.fullName.placeholder')"
                            />
                        </UiFormField>
                        <UiFormField class="checkout-field" :label="t('checkout.guest.fields.company.label')">
                            <UiInput
                                v-model="company"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                :maxlength="fieldValidationByKey.company?.maxLength"
                                :placeholder="t('checkout.guest.fields.company.placeholder')"
                            />
                        </UiFormField>
                    </div>

                    <UiFormField class="checkout-field" :label="t('checkout.guest.fields.streetAddress.label')">
                        <UiInput
                            v-model="address1"
                            type="text"
                            size="lg"
                            class="checkout-input"
                            :maxlength="fieldValidationByKey.streetAddress?.maxLength"
                            :placeholder="t('checkout.guest.fields.streetAddress.line1Placeholder')"
                        />
                        <UiInput
                            v-model="address2"
                            type="text"
                            size="lg"
                            class="checkout-input"
                            :maxlength="fieldValidationByKey.streetAddress?.maxLength"
                            :placeholder="t('checkout.guest.fields.streetAddress.line2Placeholder')"
                        />
                    </UiFormField>

                    <div class="checkout-grid checkout-grid-2">
                        <UiFormField class="checkout-field" :label="t('checkout.guest.fields.province.label')">
                            <UiSelect
                                :model-value="province"
                                :options="provinceOptions"
                                :placeholder="t('checkout.guest.fields.province.placeholder')"
                                class="checkout-select"
                                @update:model-value="province = String($event)"
                            />
                        </UiFormField>
                        <UiFormField class="checkout-field" :label="t('checkout.guest.fields.city.label')">
                            <UiInput
                                v-model="city"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                :maxlength="fieldValidationByKey.city?.maxLength"
                                :placeholder="t('checkout.guest.fields.city.placeholder')"
                            />
                        </UiFormField>
                    </div>

                    <div class="checkout-grid checkout-grid-2">
                        <UiFormField class="checkout-field" :label="t('checkout.guest.fields.postalCode.label')">
                            <UiInput
                                v-model="postalCode"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                :maxlength="fieldValidationByKey.postalCode?.maxLength"
                                :placeholder="t('checkout.guest.fields.postalCode.placeholder')"
                            />
                        </UiFormField>
                        <UiFormField class="checkout-field" :label="t('checkout.guest.fields.phone.label')">
                            <UiInput
                                v-model="phone"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                :maxlength="fieldValidationByKey.phone?.maxLength"
                                :placeholder="t('checkout.guest.fields.phone.placeholder')"
                            />
                        </UiFormField>
                    </div>

                    <div class="checkout-shipping-method-wrap">
                        <div class="checkout-shipping-method-head">
                            <div class="checkout-label">{{ t('checkout.guest.shippingMethod') }}</div>
                            <div class="checkout-shipping-note">
                                {{ t('checkout.guest.shippingNote') }}
                            </div>
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
                                <img
                                    :src="method.icon"
                                    :alt="t(`${method.i18nKey}.alt`)"
                                    class="checkout-shipping-method-icon"
                                />
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
                </section>

                <section class="checkout-section checkout-panel">
                    <div class="checkout-section-title">{{ t('checkout.guest.payment') }}</div>
                    <div class="checkout-grid checkout-grid-3">
                        <button
                            v-for="method in activePaymentMethods"
                            :key="method.key"
                            type="button"
                            class="checkout-pay-btn"
                            :class="{ 'is-active': selectedPaymentMethod === method.key }"
                            :aria-pressed="selectedPaymentMethod === method.key"
                            @click="selectedPaymentMethod = method.key"
                        >
                            <img
                                :src="method.icon"
                                :alt="t(`checkout.guest.paymentMethods.${method.i18nKey}.alt`)"
                                class="checkout-pay-btn-icon"
                            />
                            <span class="checkout-pay-btn-label">{{ t(`checkout.guest.paymentMethods.${method.i18nKey}.label`) }}</span>
                        </button>
                    </div>
                    <div class="checkout-subnote">{{ t('checkout.guest.paymentSubnote') }}</div>
                    <div class="checkout-payment-brands">
                        <span
                            v-for="brand in checkoutPaymentBrands"
                            :key="brand"
                            class="checkout-payment-brand"
                        >
                            {{ brand }}
                        </span>
                    </div>

                    <div class="checkout-grid checkout-grid-2">
                        <UiFormField
                            class="checkout-field checkout-field-full"
                            :label="t('checkout.guest.fields.cardNumber.label')"
                        >
                            <UiInput
                                v-model="cardNumber"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                :maxlength="fieldValidationByKey.cardNumber?.maxLength"
                                :placeholder="t('checkout.guest.fields.cardNumber.placeholder')"
                            />
                        </UiFormField>
                        <UiFormField class="checkout-field" :label="t('checkout.guest.fields.expiration.label')">
                            <UiInput
                                v-model="expiry"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                :maxlength="fieldValidationByKey.expiration?.maxLength"
                                :placeholder="t('checkout.guest.fields.expiration.placeholder')"
                            />
                        </UiFormField>
                        <UiFormField class="checkout-field" :label="t('checkout.guest.fields.cvv.label')">
                            <UiInput
                                v-model="cvv"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                :maxlength="fieldValidationByKey.cvv?.maxLength"
                                :placeholder="t('checkout.guest.fields.cvv.placeholder')"
                            />
                        </UiFormField>
                    </div>

                    <UiCheckbox v-model="useShippingAsBilling" class="checkout-checkbox">
                        {{ t('checkout.guest.useShippingAsBilling') }}
                    </UiCheckbox>
                    <button type="button" class="checkout-billing-link">
                        {{ t('checkout.guest.viewBillingAddresses') }}
                    </button>
                </section>
            </section>

            <aside class="checkout-summary-column">
                <section class="checkout-summary-card">
                    <div class="checkout-summary-title">{{ t('checkout.guest.orderSummary') }}</div>
                    <div class="checkout-summary-list">
                        <div
                            v-for="item in selectedCheckoutItems"
                            :key="item.id"
                            class="checkout-summary-item"
                        >
                            <div class="checkout-summary-thumb">
                                <img
                                    :src="item.artworkPreviewUrl || item.product.image"
                                    :alt="item.product.name"
                                    class="checkout-summary-thumb-image"
                                />
                            </div>
                            <div class="checkout-summary-info">
                                <div class="checkout-summary-name">{{ item.product.name }}</div>
                                <div class="checkout-summary-meta">
                                    {{ t('checkout.guest.summary.itemMeta', { size: sizeDimOnly(item.sizeLabel), qty: item.qty.toLocaleString() }) }}
                                </div>
                            </div>
                            <div class="checkout-summary-price">{{ formatPrice(item.total) }}</div>
                        </div>
                        <div v-if="selectedCheckoutItems.length === 0" class="checkout-summary-empty">
                            {{ t('checkout.guest.noItemsSelected') }}
                        </div>
                    </div>

                    <div class="checkout-summary-lines">
                        <div class="checkout-summary-line">
                            <div class="checkout-summary-line-label">{{ t('checkout.guest.summary.subtotal') }}</div>
                            <div class="checkout-summary-line-value">{{ formatPrice(orderSubtotal) }}</div>
                        </div>
                        <div class="checkout-summary-line">
                            <div class="checkout-summary-line-label">{{ t('checkout.guest.summary.shippingFee') }}</div>
                            <div class="checkout-summary-line-value">{{ formatPrice(orderShippingFee) }}</div>
                        </div>
                        <div class="checkout-summary-line">
                            <div class="checkout-summary-line-label">{{ t('checkout.guest.summary.discounts') }}</div>
                            <div class="checkout-summary-line-value is-discount">-{{ formatPrice(orderDiscount) }}</div>
                        </div>
                        <div class="checkout-summary-line is-total">
                            <div class="checkout-summary-line-label">{{ t('checkout.guest.summary.total') }}</div>
                            <div class="checkout-summary-line-value">{{ formatPrice(orderTotal) }}</div>
                        </div>
                    </div>

                    <UiButton
                        variant="filled"
                        tone="neutral"
                        size="lg"
                        class="checkout-submit-btn"
                        :disabled="selectedCheckoutItems.length === 0"
                    >
                        {{ t('checkout.guest.completeCheckout') }}
                    </UiButton>
                    <div class="checkout-summary-agreement">
                        <span class="checkout-summary-agreement-text">
                            {{ t('checkout.guest.agreement.prefix') }}
                        </span>
                        <a href="#" class="checkout-summary-agreement-link">{{ t('checkout.guest.agreement.terms') }}</a>
                        <span class="checkout-summary-agreement-text">{{ t('checkout.guest.agreement.and') }}</span>
                        <a href="#" class="checkout-summary-agreement-link">{{ t('checkout.guest.agreement.privacy') }}</a>
                        <span class="checkout-summary-agreement-text">{{ t('checkout.guest.agreement.suffix') }}</span>
                    </div>
                </section>
            </aside>
        </section>
    </main>
</template>

<style scoped lang="scss">
.checkout-page {
    padding: 28px 24px 80px;
    background: var(--bg-page);

    .checkout-page-shell {
        max-width: 1200px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: minmax(0, 1fr) 360px;
        gap: 36px;
    }

    .checkout-form-column {
        display: flex;
        flex-direction: column;
        gap: 28px;
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

    .checkout-section-title {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        line-height: 28px;
        color: var(--text-primary);
    }

    .checkout-contact-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .checkout-login-link {
        display: inline-flex;
        align-items: center;
        gap: 0;
        margin: 0;
        color: var(--text-primary);
        font-size: 14px;
        line-height: 24px;

        .checkout-login-link-action {
            margin-left: 4px;
            color: var(--gold-60);
            font-weight: 600;
            text-decoration: underline;
            text-underline-offset: 3px;
            text-decoration-thickness: 2px;
        }
    }

    .checkout-grid {
        display: grid;
        gap: 10px 12px;

        &.checkout-grid-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        &.checkout-grid-3 {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    .checkout-field {
        display: flex;
        flex-direction: column;
        gap: 6px;

        :deep(.ui-form-field-label) {
            font-size: 14px;
            line-height: 24px;
            font-weight: 600;
            color: var(--text-primary);
        }
    }

    .checkout-field-full {
        grid-column: 1 / -1;
    }

    .checkout-label {
        font-size: 14px;
        line-height: 24px;
        font-weight: 600;
        color: var(--text-primary);
    }

    .checkout-input {
        width: 100%;
        box-shadow: none;
        transition: border-color 0.15s ease, background 0.15s ease;

        :deep(.ui-input) {
            box-shadow: none !important;
            transition: border-color 0.15s ease, background 0.15s ease;
        }

        :deep(.ui-input[data-size='lg']),
        :deep(.ui-input[data-size='md']),
        :deep(.ui-input[data-size='sm']) {
            box-shadow: none !important;
        }

        :deep(.ui-input-field) {
            height: 48px;
            border-radius: 8px;
            box-shadow: none;
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

    .checkout-pay-btn {
        border: 1px solid var(--gray-40);
        background: var(--contrast-light);
        min-height: 80px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-primary);
        cursor: pointer;
        transition: border-color 0.16s ease, background-color 0.16s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 16px;

        &.is-active {
            border-color: var(--gray-60);
            background: var(--gray-20);
        }
    }

    .checkout-pay-btn-icon {
        width: 48px;
        height: 48px;
        object-fit: contain;
        flex-shrink: 0;
    }

    .checkout-pay-btn-label {
        font-size: 14px;
        line-height: 20px;
        font-weight: 600;
        color: inherit;
    }

    .checkout-subnote {
        margin: 0;
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 20px;
    }

    .checkout-shipping-method-wrap {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .checkout-shipping-method-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    }

    .checkout-shipping-note {
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 20px;
        text-align: right;
    }

    .checkout-shipping-method-card {
        min-height: 80px;
        border: 1px solid var(--gray-40);
        border-radius: 8px;
        background: var(--contrast-light);
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        text-align: left;
        cursor: pointer;

        &.is-active {
            border-color: var(--gray-60);
            background: var(--gray-20);
        }
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

    .checkout-shipping-method-name {
        color: var(--text-primary);
        font-size: 14px;
        line-height: 20px;
        font-weight: 600;
    }

    .checkout-shipping-method-date {
        color: var(--text-secondary);
        font-size: 14px;
        line-height: 20px;
    }

    .checkout-shipping-method-price {
        color: var(--text-primary);
        font-size: 14px;
        line-height: 20px;
        font-weight: 600;
    }

    .checkout-payment-brands {
        display: flex;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
    }

    .checkout-payment-brand {
        color: var(--text-primary);
        font-size: 14px;
        line-height: 20px;
        font-weight: 700;
    }

    .checkout-checkbox {
        margin-top: 2px;
        color: var(--text-primary);
        font-size: 14px;
    }

    .checkout-billing-link {
        border: 0;
        background: transparent;
        margin-left: auto;
        color: var(--gold-60);
        font-size: 14px;
        line-height: 20px;
        font-weight: 600;
        cursor: pointer;
    }

    .checkout-summary-column {
        align-self: start;
        position: sticky;
        top: 24px;
    }

    .checkout-summary-card {
        border: 1px solid var(--gray-40);
        border-radius: 10px;
        background: var(--contrast-light);
        overflow: hidden;
        box-shadow: none;

        .checkout-summary-title {
            margin: 0;
            padding: 12px 24px;
            border-bottom: 1px solid var(--gray-40);
            font-size: 14px;
            line-height: 24px;
            font-weight: 700;
            color: var(--text-primary);
        }

        .checkout-summary-list {
            max-height: 360px;
            overflow: auto;
        }

        .checkout-summary-item {
            display: grid;
            grid-template-columns: 46px 1fr auto;
            align-items: center;
            gap: 12px;
            padding: 16px 18px;
            border-bottom: 1px solid var(--gray-40);
        }

        .checkout-summary-empty {
            padding: 14px 18px;
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 20px;
            border-bottom: 1px solid var(--gray-40);
        }

        .checkout-summary-thumb {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            background: var(--gray-20);
            overflow: hidden;
            display: grid;
            place-items: center;

            .checkout-summary-thumb-image {
                width: 26px;
                height: 26px;
                object-fit: cover;
            }
        }

        .checkout-summary-name {
            margin: 0;
            color: var(--text-primary);
            font-size: 14px;
            font-weight: 700;
            line-height: 24px;
        }

        .checkout-summary-meta {
            margin: 0;
            color: var(--text-secondary);
            font-size: 14px;
            line-height: 24px;
        }

        .checkout-summary-price {
            font-size: 16px;
            font-weight: 700;
            line-height: 28px;
            color: var(--text-primary);
        }

        .checkout-summary-lines {
            padding: 16px 24px;
            display: flex;
            flex-direction: column;
            gap: 4px;

            .checkout-summary-line {
                margin: 0;
                display: flex;
                align-items: center;
                justify-content: space-between;
                color: var(--text-secondary);
                font-size: 14px;
                line-height: 24px;

                .checkout-summary-line-value {
                    color: var(--text-primary);
                    font-weight: 600;

                    &.is-discount {
                        color: var(--error);
                    }
                }

                &.is-total {
                    margin-top: 6px;
                    color: var(--text-primary);
                    font-weight: 700;

                    .checkout-summary-line-value {
                        font-size: 24px;
                        line-height: 36px;
                        font-weight: 700;
                    }
                }
            }
        }

        .checkout-submit-btn {
            width: calc(100% - 36px);
            margin: 8px 18px 0;
            border-radius: 16px;
            min-height: 56px;
            box-shadow: none;
            font-size: 16px;
            line-height: 28px;
        }

        .checkout-summary-agreement {
            margin: 12px 18px 18px;
            text-align: center;
            font-size: 12px;
            line-height: 18px;
            color: var(--text-secondary);

            .checkout-summary-agreement-link {
                color: var(--text-primary);
                font-weight: 600;
                text-decoration: underline;
                margin-inline: 2px;
            }
        }
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

        .checkout-section-title {
            font-size: 28px;
        }

        .checkout-summary-card {
            .checkout-summary-title {
                font-size: 28px;
                padding: 14px 16px;
            }
        }

        .checkout-grid {
            &.checkout-grid-2,
            &.checkout-grid-3 {
                grid-template-columns: 1fr;
            }
        }

        .checkout-contact-head {
            align-items: flex-start;
            flex-direction: column;
            gap: 4px;
        }

        .checkout-shipping-method-head {
            align-items: flex-start;
            flex-direction: column;
            gap: 4px;
        }

        .checkout-shipping-note {
            text-align: left;
        }
    }
}
</style>
