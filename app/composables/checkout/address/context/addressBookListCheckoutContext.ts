import { useUserAddressDataCheckout } from "./useUserAddressDataCheckout"

type composable_context = ReturnType<typeof useUserAddressDataCheckout>

const key = Symbol('user-address-data-checkout')

export const provideUserAddressDataCheckout = () => {
	const flow = useUserAddressDataCheckout()

	const context = {
		...flow,
	}

	provide(key, context)

	return context
}

export const useUserAddressDataCheckoutContext = () => {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useUserAddressDataCheckoutContext')
	}

	return context
}