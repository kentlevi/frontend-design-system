import { useOrderDetailUI } from './useOrderDetailUI'

type composable_context = ReturnType<typeof useOrderDetailUI>

const key = Symbol('order-detail-ui')

export const provideOrderDetailUI = () => {
	const flow = useOrderDetailUI()

	provide(key, flow)

	return flow
}

export const useOrderDetailUIContext = () => {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useOrderDetailUIContext')
	}

	return context
}