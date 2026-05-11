import { useAddressGeneralUI } from "./useAddressGeneralUI"

type composable_context = ReturnType<typeof useAddressGeneralUI>

const key = Symbol('user-address-general-ui')

export const provideAddressGeneralUI = () => {
	const flow = useAddressGeneralUI()

	const context = {
		...flow,
	}

	provide(key, context)

	return context
}

export const useAddressGeneralUIContext = () => {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useAddressGeneralUIContext')
	}

	return context
}