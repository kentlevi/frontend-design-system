export type CheckoutShippingMethodKey = 'standard' | 'express';
export type CheckoutPaymentMethodKey = 'credit-card' | 'paypal' | 'bank-transfer' | 'toss-payment';
export type CheckoutProvinceKey =
	| ''
	| 'seoul'
	| 'busan'
	| 'incheon'
	| 'daegu'
	| 'daejeon'
	| 'gwangju'
	| 'ulsan'
	| 'sejong'
	| 'gyeongju'
	| 'suwon'
	| 'changwon'
	| 'jeonju'
	| 'cheongju'
	| 'pohang'
	| 'jeju'
	| 'andong'
	| 'gimhae';
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