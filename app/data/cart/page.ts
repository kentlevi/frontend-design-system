export const CART_STORAGE_KEY = 'musticker-product-cart-v1';
export const CHECKOUT_SELECTION_STORAGE_KEY = 'musticker-checkout-selection-v1';
export const CART_UPDATED_EVENT = 'musticker:cart-updated';

export const cartPaymentOptions = [
	{
		key: 'woori-card',
		label: 'Woori Card',
		icon: '/icons/custom/payment-methods/bank-logos/woori-card.svg',
	},
	{
		key: 'shinhan-card',
		label: 'Shinhan Card',
		icon: '/icons/custom/payment-methods/bank-logos/shinhan-card.svg',
	},
	{
		key: 'lotte-card',
		label: 'Lotte Card',
		icon: '/icons/custom/payment-methods/bank-logos/lotte-card.svg',
	},
	{
		key: 'samsung-card',
		label: 'Samsung Card',
		icon: '/icons/custom/payment-methods/bank-logos/samsung-card.svg',
	},
	{
		key: 'nh-nonghyup-card',
		label: 'NH Nonghyup Card',
		icon: '/icons/custom/payment-methods/bank-logos/nh-nonghyup-card.svg',
	},
	{
		key: 'kb-kookmin-bank',
		label: 'KB Kookmin Bank',
		icon: '/icons/custom/payment-methods/bank-logos/kb-kookmin-bank.svg',
	},
	{
		key: 'hana-card',
		label: 'Hana Card',
		icon: '/icons/custom/payment-methods/bank-logos/hana-card.svg',
	},
	{
		key: 'citibank',
		label: 'Citibank',
		icon: '/icons/custom/payment-methods/bank-logos/citibank.svg',
	},
	{
		key: 'kakao-bank',
		label: 'Kakao Bank',
		icon: '/icons/custom/payment-methods/bank-logos/kakao-bank.svg',
	},
	{
		key: 'kbank',
		label: 'Kbank',
		icon: '/icons/custom/payment-methods/bank-logos/kbank.svg',
	},
	{
		key: 'hyundai-card',
		label: 'Hyundai Card',
		icon: '/icons/custom/payment-methods/bank-logos/hyundai-card.svg',
	},
	{
		key: 'bc-card',
		label: 'BC Card',
		icon: '/icons/custom/payment-methods/bank-logos/bc-card.svg',
	},
	{
		key: 'shuhyup-bank',
		label: 'Shuhyup Bank',
		icon: '/icons/custom/payment-methods/bank-logos/shuhyup-bank.svg',
	},
	{
		key: 'jeonbuk-bank',
		label: 'Jeonbuk Bank',
		icon: '/icons/custom/payment-methods/bank-logos/jeonbuk-bank.svg',
	},
	{
		key: 'korea-post',
		label: 'Korea Post',
		icon: '/icons/custom/payment-methods/bank-logos/korea-post.svg',
	},
	{
		key: 'kwangju-bank',
		label: 'Kwangju Bank',
		icon: '/icons/custom/payment-methods/bank-logos/kwangju-bank.svg',
	},
	{
		key: 'mg-saemaul-geumgo',
		label: 'MG Saemaul Geumgo',
		icon: '/icons/custom/payment-methods/bank-logos/mg-saemaul-geumgo.svg',
	},
	{
		key: 'shinhyup-credit-union',
		label: 'Shinhyup Credit Union',
		icon: '/icons/custom/payment-methods/bank-logos/shinhyup-credit-union.svg',
	},
] as const;