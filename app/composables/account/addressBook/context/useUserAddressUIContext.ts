import { useUserAddressUI } from "./useUserAddressUI"

type composable_context = ReturnType<typeof useUserAddressUI>

const key = Symbol('user-address-ui')

export const provideUserAddressUI = () => {
	const flow = useUserAddressUI()

	const context = {
		...flow,
	}

	provide(key, context)

	return context
}

export const useUserAddressUIContext = () => {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useUserAddressUIContext')
	}

	return context
}