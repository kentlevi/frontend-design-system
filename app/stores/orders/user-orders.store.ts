import type { UserOrder, UserOrderType } from '~/types/order/user-orders'

export const useUserOrdersStore = defineStore('user-orders', () => {
	const ongoing         = ref<UserOrder[]>([])
	const action_required = ref<UserOrder[]>([])
	const to_receive      = ref<UserOrder[]>([])
	const completed       = ref<UserOrder[]>([])
	const cancelled       = ref<UserOrder[]>([])

	const order_refs: Record<UserOrderType, Ref<UserOrder[]>> = {
		ongoing,
		action_required,
		to_receive,
		completed,
		cancelled,
	}

	function setOrders(type: UserOrderType, value: UserOrder[]) {
		order_refs[type].value = value
	}

	function findById(id: number): UserOrder | undefined {
		return [
			...ongoing.value,
			...action_required.value,
			...to_receive.value,
			...completed.value,
			...cancelled.value,
		].find(o => o.id === id)
	}




	type OrderAction = 'fetch'

	const loader_map = ref<Record<string, boolean>>({})

	function getKey(action: OrderAction, scope?: UserOrderType) {
		return scope ? `${action}:${scope}` : action
	}

	function isLoading(action: OrderAction, scope?: UserOrderType) {
		return !!loader_map.value[getKey(action, scope)]
	}

	function startLoading(action: OrderAction, scope?: UserOrderType) {
		loader_map.value[getKey(action, scope)] = true
	}

	function stopLoading(action: OrderAction, scope?: UserOrderType) {
		loader_map.value[getKey(action, scope)] = false
	}

	return {
		ongoing,
		action_required,
		to_receive,
		completed,
		cancelled,

		setOrders,
		findById,
		isLoading,
		startLoading,
		stopLoading,
	}
})