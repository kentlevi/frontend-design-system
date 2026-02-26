<script setup lang="ts">
import { ref } from 'vue';

const localePath = useLocalePath();
import { useCheckoutGuest } from '~/composables/checkout/useCheckoutGuest';

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

const selectedShippingMethod = ref<'standard' | 'express'>('express');
const selectedPaymentMethod = ref<'credit-card' | 'paypal' | 'bank-transfer'>('credit-card');
</script>

<template>
    <main class="checkout-page" data-testid="checkout-page">
        <section class="checkout-page-shell">
            <section class="checkout-form-column">
                <section class="checkout-section checkout-panel">
                    <div class="checkout-section-title">Contact Information</div>
                    <div class="checkout-contact-head">
                        <label class="checkout-label">Email Address*</label>
                        <div class="checkout-login-link">
                            <span class="checkout-login-link-text">Already have an account?</span>
                            <NuxtLink :to="localePath('/auth/login')" class="checkout-login-link-action">Login</NuxtLink>
                        </div>
                    </div>
                    <UiInput
                        v-model="email"
                        type="email"
                        size="lg"
                        class="checkout-input"
                        placeholder="Enter Email Address"
                    />
                </section>

                <section class="checkout-section checkout-panel">
                    <div class="checkout-section-title">Shipping Information</div>
                    <div class="checkout-grid checkout-grid-2">
                        <div class="checkout-field">
                            <label class="checkout-label">Full Name*</label>
                            <UiInput
                                v-model="fullName"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                placeholder="Enter Fullname"
                            />
                        </div>
                        <div class="checkout-field">
                            <label class="checkout-label">Company (Optional)</label>
                            <UiInput
                                v-model="company"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                placeholder="Enter Company Name"
                            />
                        </div>
                    </div>

                    <div class="checkout-field">
                        <label class="checkout-label">Street Address*</label>
                        <UiInput
                            v-model="address1"
                            type="text"
                            size="lg"
                            class="checkout-input"
                            placeholder="Enter Address Line 1"
                        />
                        <UiInput
                            v-model="address2"
                            type="text"
                            size="lg"
                            class="checkout-input"
                            placeholder="Enter Address Line 2"
                        />
                    </div>

                    <div class="checkout-grid checkout-grid-2">
                        <div class="checkout-field">
                            <label class="checkout-label">Province/Metropolitan City*</label>
                            <UiSelect
                                :model-value="province"
                                :options="provinceOptions"
                                placeholder="Select Province/Metropolitan City"
                                class="checkout-select"
                                @update:model-value="province = String($event)"
                            />
                        </div>
                        <div class="checkout-field">
                            <label class="checkout-label">City/Town*</label>
                            <UiInput
                                v-model="city"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                placeholder="Enter City/Town"
                            />
                        </div>
                    </div>

                    <div class="checkout-grid checkout-grid-2">
                        <div class="checkout-field">
                            <label class="checkout-label">Postal Code*</label>
                            <UiInput
                                v-model="postalCode"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                placeholder="Enter Postal Code"
                            />
                        </div>
                        <div class="checkout-field">
                            <label class="checkout-label">Phone Number</label>
                            <UiInput
                                v-model="phone"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                placeholder="(000) 000-0000"
                            />
                        </div>
                    </div>

                    <div class="checkout-shipping-method-wrap">
                        <div class="checkout-shipping-method-head">
                            <div class="checkout-label">Shipping Method</div>
                            <div class="checkout-shipping-note">
                                Note: This is the estimated delivery date if the order is confirmed today.
                            </div>
                        </div>
                        <div class="checkout-grid checkout-grid-2">
                            <button
                                type="button"
                                class="checkout-shipping-method-card"
                                :class="{ 'is-active': selectedShippingMethod === 'standard' }"
                                :aria-pressed="selectedShippingMethod === 'standard'"
                                @click="selectedShippingMethod = 'standard'"
                            >
                                <img
                                    src="/images/checkout/standard-shipping.svg"
                                    alt="Standard shipping"
                                    class="checkout-shipping-method-icon"
                                />
                                <div class="checkout-shipping-method-content">
                                    <div class="checkout-shipping-method-main">
                                        <div class="checkout-shipping-method-name">Standard</div>
                                        <div class="checkout-shipping-method-date">December 15, 2025</div>
                                    </div>
                                    <div class="checkout-shipping-method-price">Free</div>
                                </div>
                            </button>
                            <button
                                type="button"
                                class="checkout-shipping-method-card"
                                :class="{ 'is-active': selectedShippingMethod === 'express' }"
                                :aria-pressed="selectedShippingMethod === 'express'"
                                @click="selectedShippingMethod = 'express'"
                            >
                                <img
                                    src="/images/checkout/express-shipping.svg"
                                    alt="Express shipping"
                                    class="checkout-shipping-method-icon"
                                />
                                <div class="checkout-shipping-method-content">
                                    <div class="checkout-shipping-method-main">
                                        <div class="checkout-shipping-method-name">Express</div>
                                        <div class="checkout-shipping-method-date">December 12, 2025</div>
                                    </div>
                                    <div class="checkout-shipping-method-price">Free</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </section>

                <section class="checkout-section checkout-panel">
                    <div class="checkout-section-title">Payment</div>
                    <div class="checkout-grid checkout-grid-3">
                        <button
                            type="button"
                            class="checkout-pay-btn"
                            :class="{ 'is-active': selectedPaymentMethod === 'credit-card' }"
                            :aria-pressed="selectedPaymentMethod === 'credit-card'"
                            @click="selectedPaymentMethod = 'credit-card'"
                        >
                            <img
                                src="/images/checkout/credit-card.svg"
                                alt="Credit card"
                                class="checkout-pay-btn-icon"
                            />
                            <span class="checkout-pay-btn-label">Credit Card</span>
                        </button>
                        <button
                            type="button"
                            class="checkout-pay-btn"
                            :class="{ 'is-active': selectedPaymentMethod === 'paypal' }"
                            :aria-pressed="selectedPaymentMethod === 'paypal'"
                            @click="selectedPaymentMethod = 'paypal'"
                        >
                            <img
                                src="/images/checkout/paypal.svg"
                                alt="Paypal"
                                class="checkout-pay-btn-icon"
                            />
                            <span class="checkout-pay-btn-label">Paypal</span>
                        </button>
                        <button
                            type="button"
                            class="checkout-pay-btn"
                            :class="{ 'is-active': selectedPaymentMethod === 'bank-transfer' }"
                            :aria-pressed="selectedPaymentMethod === 'bank-transfer'"
                            @click="selectedPaymentMethod = 'bank-transfer'"
                        >
                            <img
                                src="/images/checkout/bank-transfer.svg"
                                alt="Bank transfer"
                                class="checkout-pay-btn-icon"
                            />
                            <span class="checkout-pay-btn-label">Bank Transfer</span>
                        </button>
                    </div>
                    <div class="checkout-subnote">Pay securely with your preferred payment method.</div>
                    <div class="checkout-payment-brands">
                        <span class="checkout-payment-brand">VISA</span>
                        <span class="checkout-payment-brand">Mastercard</span>
                        <span class="checkout-payment-brand">AMEX</span>
                        <span class="checkout-payment-brand">JCB</span>
                        <span class="checkout-payment-brand">UnionPay</span>
                    </div>

                    <div class="checkout-grid checkout-grid-2">
                        <div class="checkout-field checkout-field-full">
                            <label class="checkout-label">Card Number*</label>
                            <UiInput
                                v-model="cardNumber"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                placeholder="Enter Card Number"
                            />
                        </div>
                        <div class="checkout-field">
                            <label class="checkout-label">Expiration*</label>
                            <UiInput
                                v-model="expiry"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                placeholder="MM/YY"
                            />
                        </div>
                        <div class="checkout-field">
                            <label class="checkout-label">CVV*</label>
                            <UiInput
                                v-model="cvv"
                                type="text"
                                size="lg"
                                class="checkout-input"
                                placeholder="CVV"
                            />
                        </div>
                    </div>

                    <UiCheckbox v-model="useShippingAsBilling" class="checkout-checkbox">
                        Use shipping address as billing address
                    </UiCheckbox>
                    <button type="button" class="checkout-billing-link">
                        View Billing Addresses
                    </button>
                </section>
            </section>

            <aside class="checkout-summary-column">
                <section class="checkout-summary-card">
                    <div class="checkout-summary-title">Order Summary</div>
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
                                    {{ sizeDimOnly(item.sizeLabel) }}mm / {{ item.qty.toLocaleString() }}pcs.
                                </div>
                            </div>
                            <div class="checkout-summary-price">{{ formatPrice(item.total) }}</div>
                        </div>
                        <div v-if="selectedCheckoutItems.length === 0" class="checkout-summary-empty">
                            No items selected for checkout.
                        </div>
                    </div>

                    <div class="checkout-summary-lines">
                        <div class="checkout-summary-line">
                            <div class="checkout-summary-line-label">Subtotal:</div>
                            <div class="checkout-summary-line-value">{{ formatPrice(orderSubtotal) }}</div>
                        </div>
                        <div class="checkout-summary-line">
                            <div class="checkout-summary-line-label">Shipping Fee:</div>
                            <div class="checkout-summary-line-value">{{ formatPrice(orderShippingFee) }}</div>
                        </div>
                        <div class="checkout-summary-line">
                            <div class="checkout-summary-line-label">Discounts:</div>
                            <div class="checkout-summary-line-value is-discount">-{{ formatPrice(orderDiscount) }}</div>
                        </div>
                        <div class="checkout-summary-line is-total">
                            <div class="checkout-summary-line-label">Total:</div>
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
                        Complete Checkout
                    </UiButton>
                    <div class="checkout-summary-agreement">
                        <span class="checkout-summary-agreement-text">
                            By clicking "Complete Checkout", you agree with our
                        </span>
                        <a href="#" class="checkout-summary-agreement-link">Terms of Services</a>
                        <span class="checkout-summary-agreement-text">and</span>
                        <a href="#" class="checkout-summary-agreement-link">Privacy Policy</a>
                        <span class="checkout-summary-agreement-text">.</span>
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
