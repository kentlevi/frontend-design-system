import { useCheckoutInvoiceBilling } from "./useCheckoutInvoiceBilling"

type composable_context = ReturnType<typeof useCheckoutInvoiceBilling>

const key = Symbol('checkout-invoice-billing')

export const provideCheckoutInvoiceBilling = () => {
	const flow = useCheckoutInvoiceBilling()

	const context = {
		...flow,
	}

	provide(key, context)

	return context
}

export const useCheckoutInvoiceBillingContext = () => {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useCheckoutInvoiceBillingContext')
	}

	return context
}