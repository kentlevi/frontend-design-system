export const CART_STORAGE_KEY = 'musticker-product-cart-v1';
export const CHECKOUT_SELECTION_STORAGE_KEY = 'musticker-checkout-selection-v1';
export const CART_UPDATED_EVENT = 'musticker:cart-updated';

export const cartPaymentOptions = [
	{
		key: 'paypal',
		label: 'PayPal',
		icon: '/icons/custom/payment-methods/paypal.svg',
	},
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