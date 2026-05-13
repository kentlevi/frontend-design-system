import { useOrdersList } from "./useOrdersList"

type composable_context = ReturnType<typeof useOrdersList>

const key = Symbol('orders-list')

export const provideOrdersList = () => {
	const flow = useOrdersList()

	const context = {
		...flow,
	}

	provide(key, context)

	return context
}

export const useOrdersListContext = () => {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useOrdersListContext')
	}

	return context
}