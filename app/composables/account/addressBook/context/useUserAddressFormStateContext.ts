import { useUserAddressFormState } from "./useUserAddressFormState"

type composable_context = ReturnType<typeof useUserAddressFormState>

const key = Symbol('user-address-form-state')

export const provideUserAddressFormState = () => {
	const flow = useUserAddressFormState()

	const context = {
		...flow,
	}

	provide(key, context)

	return context
}

export const useUserAddressFormStateContext = () => {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useUserAddressFormStateContext')
	}

	return context
}