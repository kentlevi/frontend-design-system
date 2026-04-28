import type {
	CheckoutFieldKey,
	CheckoutPaymentMethodKey,
	CheckoutProvinceKey,
	CheckoutShippingMethodKey,
} from '~/types/checkout/options';

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
		icon: '/icons/custom/checkout/standard-shipping.svg',
		enabled: true,
	},
	{
		key: 'express',
		i18nKey: 'checkout.guest.shippingMethods.express',
		icon: '/icons/custom/checkout/express-shipping.svg',
		defaultSelected: true,
		enabled: true,
	},
];

export const checkoutPaymentMethods: ReadonlyArray<{
	key: CheckoutPaymentMethodKey;
	icon: string;
	i18nKey: 'creditCard' | 'paypal' | 'bankTransfer' | 'tossPayment';
	defaultSelected?: boolean;
	enabled?: boolean;
}> = [
	{
		key: 'credit-card',
		icon: '/icons/custom/checkout/credit-card.svg',
		i18nKey: 'creditCard',
		defaultSelected: true,
		enabled: true,
	},
	{
		key: 'bank-transfer',
		icon: '/icons/custom/checkout/bank-transfer.svg',
		i18nKey: 'bankTransfer',
		enabled: true,
	},
	{
		key: 'toss-payment',
		icon: '/icons/custom/checkout/toss-payment.png',
		i18nKey: 'tossPayment',
		enabled: true,
	},
];

export const checkoutPaymentBrands = [
	{
		key: 'visa',
		label: 'VISA',
		icon: '/icons/custom/payment-methods/visa.svg',
	},
	{
		key: 'mastercard',
		label: 'Mastercard',
		icon: '/icons/custom/payment-methods/mastercard.svg',
	},
	{
		key: 'american-express',
		label: 'American Express',
		icon: '/icons/custom/payment-methods/american-express.svg',
	},
	{
		key: 'jcb',
		label: 'JCB',
		icon: '/icons/custom/payment-methods/jcb.svg',
	},
	{
		key: 'unionpay',
		label: 'UnionPay',
		icon: '/icons/custom/payment-methods/unionpay.svg',
	},
] as const;

export const checkoutMemberPaymentBrands = [
	{
		key: 'kb-kookmin-bank',
		label: 'KB Kookmin Bank',
		icon: '/icons/custom/payment-methods/checkout-member-payment-brands/kb-kookmin-bank.svg',
	},
	{
		key: 'shinhan-card',
		label: 'Shinhan Card',
		icon: '/icons/custom/payment-methods/checkout-member-payment-brands/shinhan-card.svg',
	},
	{
		key: 'hyundai-card',
		label: 'Hyundai Card',
		icon: '/icons/custom/payment-methods/checkout-member-payment-brands/hyundai-card.svg',
	},
	{
		key: 'samsung-card',
		label: 'Samsung Card',
		icon: '/icons/custom/payment-methods/checkout-member-payment-brands/samsung-card.svg',
	},
	{
		key: 'nh-nonghyup-card',
		label: 'NH Nonghyup Card',
		icon: '/icons/custom/payment-methods/checkout-member-payment-brands/nh-nonghyup-card.svg',
	},
	{
		key: 'kakao-bank',
		label: 'Kakao Bank',
		icon: '/icons/custom/payment-methods/checkout-member-payment-brands/kakao-bank.svg',
	},
	{
		key: 'bc-card',
		label: 'BC Card',
		icon: '/icons/custom/payment-methods/checkout-member-payment-brands/bc-card.svg',
	},
] as const;

export const checkoutProvinceOptions: ReadonlyArray<{
	value: CheckoutProvinceKey;
	i18nKey: string;
	enabled?: boolean;
}> = [
	{ value: '', i18nKey: 'checkout.guest.provinceOptions.placeholder', enabled: true },
	{ value: 'seoul', i18nKey: 'checkout.guest.provinceOptions.seoul', enabled: true },
	{ value: 'busan', i18nKey: 'checkout.guest.provinceOptions.busan', enabled: true },
	{ value: 'incheon', i18nKey: 'checkout.guest.provinceOptions.incheon', enabled: true },
	{ value: 'daegu', i18nKey: 'checkout.guest.provinceOptions.daegu', enabled: true },
	{ value: 'daejeon', i18nKey: 'checkout.guest.provinceOptions.daejeon', enabled: true },
	{ value: 'gwangju', i18nKey: 'checkout.guest.provinceOptions.gwangju', enabled: true },
	{ value: 'ulsan', i18nKey: 'checkout.guest.provinceOptions.ulsan', enabled: true },
	{ value: 'sejong', i18nKey: 'checkout.guest.provinceOptions.sejong', enabled: true },
	{ value: 'gyeongju', i18nKey: 'checkout.guest.provinceOptions.gyeongju', enabled: true },
	{ value: 'suwon', i18nKey: 'checkout.guest.provinceOptions.suwon', enabled: true },
	{ value: 'changwon', i18nKey: 'checkout.guest.provinceOptions.changwon', enabled: true },
	{ value: 'jeonju', i18nKey: 'checkout.guest.provinceOptions.jeonju', enabled: true },
	{ value: 'cheongju', i18nKey: 'checkout.guest.provinceOptions.cheongju', enabled: true },
	{ value: 'pohang', i18nKey: 'checkout.guest.provinceOptions.pohang', enabled: true },
	{ value: 'jeju', i18nKey: 'checkout.guest.provinceOptions.jeju', enabled: true },
	{ value: 'andong', i18nKey: 'checkout.guest.provinceOptions.andong', enabled: true },
	{ value: 'gimhae', i18nKey: 'checkout.guest.provinceOptions.gimhae', enabled: true },
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