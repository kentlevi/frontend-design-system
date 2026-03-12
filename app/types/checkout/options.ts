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