import { useUserAddressData } from "./useUserAddressData"

type composable_context = ReturnType<typeof useUserAddressData>

const key = Symbol('user-address-data')

export const provideUserAddressData = () => {
	const flow = useUserAddressData()

	const context = {
		...flow,
	}

	provide(key, context)

	return context
}

export const useUserAddressDataContext = () => {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useUserAddressDataContext')
	}

	return context
}