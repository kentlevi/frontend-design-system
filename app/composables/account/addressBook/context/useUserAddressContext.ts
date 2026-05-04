import { useUserAddress } from "./useUserAddress"

type composable_context = ReturnType<typeof useUserAddress>

const key = Symbol('user-address')

export const provideUserAddress = () => {
	const flow = useUserAddress()

	const context = {
		...flow,
	}

	provide(key, context)

	return context
}

export const useUserAddressContext = () => {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useUserAddressContext')
	}

	return context
}