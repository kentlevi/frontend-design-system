import { useUserAddressFormStateCheckout } from "./useUserAddressFormStateCheckout"

type composable_context = ReturnType<typeof useUserAddressFormStateCheckout>

const key = Symbol('user-address-form-state-checkout')

export const provideUserAddressFormStateCheckout = () => {
	const flow = useUserAddressFormStateCheckout()

	const context = {
		...flow,
	}

	provide(key, context)

	return context
}

export const useUserAddressFormStateCheckoutContext = () => {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useUserAddressFormStateCheckoutContext')
	}

	return context
}