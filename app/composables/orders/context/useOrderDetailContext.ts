import { useOrderDetail } from './useOrderDetail'

type composable_context = ReturnType<typeof useOrderDetail>

const key = Symbol('order-detail')

export const provideOrderDetail = () => {
	const flow = useOrderDetail()

	provide(key, flow)

	return flow
}

export const useOrderDetailContext = () => {
	const context = inject<composable_context>(key)

	if (!context) {
		throw new Error('useOrderDetailContext')
	}

	return context
}