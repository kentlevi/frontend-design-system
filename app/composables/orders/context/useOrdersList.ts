import { useUserOrdersStore } from "~/stores/orders/user-orders.store"
import type { UserOrder, UserOrderType } from '~/types/order/user-orders'
import { ORDER_STATUSES } from '~/constants/order-detail/status'

const DAYS_THRESHOLD = 30
const MS_PER_DAY = 24 * 60 * 60 * 1000

export type OrdersActiveMode = 'active' | 'inactive'

export function useOrdersList() {

	/**
	 * Stores
	 */
	const user_orders_store = useUserOrdersStore()


	/**
	 * State
	 */
	const active_mode = ref<OrdersActiveMode>('active')
	const selected_statuses = ref<Set<UserOrderType>>(new Set(ORDER_STATUSES))


	/**
	 * Functions
	 */
	function isOlderThanThreshold(order: UserOrder) {
		const created = new Date(order.created_at).getTime()
		if (Number.isNaN(created)) return false
		return Date.now() - created > DAYS_THRESHOLD * MS_PER_DAY
	}

	function filterByMode(orders: UserOrder[], type: UserOrderType) {
		const is_archivable = type === 'completed' || type === 'cancelled'

		if (active_mode.value === 'active') {
			return is_archivable
				? orders.filter(o => !isOlderThanThreshold(o))
				: orders
		}

		return is_archivable
			? orders.filter(isOlderThanThreshold)
			: []
	}

	function setSelectedStatuses(statuses: Set<UserOrderType>) {
		selected_statuses.value = new Set(statuses)
	}


	/**
	 * Computed
	 */
	const ongoing         = computed(() => filterByMode(user_orders_store.ongoing, 'ongoing'))
	const action_required = computed(() => filterByMode(user_orders_store.action_required, 'action_required'))
	const to_receive      = computed(() => filterByMode(user_orders_store.to_receive, 'to_receive'))
	const completed       = computed(() => filterByMode(user_orders_store.completed, 'completed'))
	const cancelled       = computed(() => filterByMode(user_orders_store.cancelled, 'cancelled'))
	const is_loading      = computed(() =>
		user_orders_store.isLoading('fetch', 'ongoing') ||
		user_orders_store.isLoading('fetch', 'action_required') ||
		user_orders_store.isLoading('fetch', 'to_receive') ||
		user_orders_store.isLoading('fetch', 'completed') ||
		user_orders_store.isLoading('fetch', 'cancelled')
	)
	const has_any_orders  = computed(() =>
		user_orders_store.ongoing.length > 0 ||
		user_orders_store.action_required.length > 0 ||
		user_orders_store.to_receive.length > 0 ||
		user_orders_store.completed.length > 0 ||
		user_orders_store.cancelled.length > 0
	)


	return {
		active_mode,
		selected_statuses,

		ongoing,
		action_required,
		to_receive,
		completed,
		cancelled,
		is_loading,
		has_any_orders,

		setSelectedStatuses,
	}
}