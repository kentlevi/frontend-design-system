export type CheckoutShippingMethodKey = 'standard' | 'express';
export type CheckoutPaymentMethodKey = 'credit-card' | 'paypal' | 'bank-transfer';
export type CheckoutProvinceKey = '' | 'california' | 'new-york' | 'texas' | 'florida';
export type CheckoutFieldKey =
    | 'email'
    | 'fullName'
    | 'company'
    | 'streetAddress'
    | 'province'
    | 'city'
    | 'postalCode'
    | 'phone'
    | 'cardNumber'
    | 'expiration'
    | 'cvv';

export const checkoutShippingMethods: ReadonlyArray<{
    key: CheckoutShippingMethodKey;
    i18nKey: `checkout.guest.shippingMethods.${CheckoutShippingMethodKey}`;
    icon: string;
    defaultSelected?: boolean;
    enabled?: boolean;
}> = [
    {
        key: 'standard',
        i18nKey: 'checkout.guest.shippingMethods.standard',
        icon: '/images/checkout/standard-shipping.svg',
        enabled: true,
    },
    {
        key: 'express',
        i18nKey: 'checkout.guest.shippingMethods.express',
        icon: '/images/checkout/express-shipping.svg',
        defaultSelected: true,
        enabled: true,
    },
];

export const checkoutPaymentMethods: ReadonlyArray<{
    key: CheckoutPaymentMethodKey;
    icon: string;
    i18nKey: 'creditCard' | 'paypal' | 'bankTransfer';
    defaultSelected?: boolean;
    enabled?: boolean;
}> = [
    {
        key: 'credit-card',
        icon: '/images/checkout/credit-card.svg',
        i18nKey: 'creditCard',
        defaultSelected: true,
        enabled: true,
    },
    { key: 'paypal', icon: '/images/checkout/paypal.svg', i18nKey: 'paypal', enabled: true },
    {
        key: 'bank-transfer',
        icon: '/images/checkout/bank-transfer.svg',
        i18nKey: 'bankTransfer',
        enabled: true,
    },
];

export const checkoutPaymentBrands = ['VISA', 'Mastercard', 'AMEX', 'JCB', 'UnionPay'] as const;

export const checkoutProvinceOptions: ReadonlyArray<{
    value: CheckoutProvinceKey;
    i18nKey: string;
    enabled?: boolean;
}> = [
    { value: '', i18nKey: 'checkout.guest.provinceOptions.placeholder', enabled: true },
    { value: 'california', i18nKey: 'checkout.guest.provinceOptions.california', enabled: true },
    { value: 'new-york', i18nKey: 'checkout.guest.provinceOptions.new-york', enabled: true },
    { value: 'texas', i18nKey: 'checkout.guest.provinceOptions.texas', enabled: true },
    { value: 'florida', i18nKey: 'checkout.guest.provinceOptions.florida', enabled: true },
];

export const checkoutFieldValidation: ReadonlyArray<{
    fieldKey: CheckoutFieldKey;
    required: boolean;
    pattern?: string;
    maxLength?: number;
}> = [
    { fieldKey: 'email', required: true, pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' },
    { fieldKey: 'fullName', required: true, maxLength: 120 },
    { fieldKey: 'company', required: false, maxLength: 120 },
    { fieldKey: 'streetAddress', required: true, maxLength: 200 },
    { fieldKey: 'province', required: true },
    { fieldKey: 'city', required: true, maxLength: 120 },
    { fieldKey: 'postalCode', required: true, maxLength: 20 },
    { fieldKey: 'phone', required: false, maxLength: 30 },
    { fieldKey: 'cardNumber', required: true, pattern: '^[0-9 ]+$', maxLength: 24 },
    { fieldKey: 'expiration', required: true, pattern: '^(0[1-9]|1[0-2])\\/[0-9]{2}$', maxLength: 5 },
    { fieldKey: 'cvv', required: true, pattern: '^[0-9]{3,4}$', maxLength: 4 },
];
