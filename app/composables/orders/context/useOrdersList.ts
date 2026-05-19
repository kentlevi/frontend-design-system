import { useUserOrdersStore } from "~/stores/orders/user-orders.store"
import type { UserOrder, UserOrderType } from '~/types/order/user-orders'

const DAYS_THRESHOLD = 30
const MS_PER_DAY = 24 * 60 * 60 * 1000

export type OrdersActiveMode = 'active' | 'inactive'

export type DateRange = {
	start: Date | null
	end: Date | null
}

function startOfDay(d: Date): Date {
	const r = new Date(d)
	r.setHours(0, 0, 0, 0)
	return r
}

function endOfDay(d: Date): Date {
	const r = new Date(d)
	r.setHours(23, 59, 59, 999)
	return r
}

export function useOrdersList() {

	/**
	 * Stores
	 */
	const user_orders_store = useUserOrdersStore()


	/**
	 * State
	 */
	const active_mode = ref<OrdersActiveMode>('active')
	const selected_statuses = ref<Set<UserOrderType>>(new Set())
	const selected_date_range = ref<DateRange>({ start: null, end: null })
	const search_query = ref('')
	const committed_search = ref('')


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

	function matchesSearch(order: UserOrder) {
		const query = committed_search.value.trim()
		if (!query) return true
		return order.order_number === query
	}

	function matchesDateRange(order: UserOrder) {
		const { start, end } = selected_date_range.value
		if (!start && !end) return true

		const created = new Date(order.created_at)
		if (Number.isNaN(created.getTime())) return false

		if (start && created < startOfDay(start)) return false
		if (end && created > endOfDay(end)) return false
		return true
	}

	function applyFilters(orders: UserOrder[], type: UserOrderType) {
		return filterByMode(orders, type)
			.filter(matchesSearch)
			.filter(matchesDateRange)
	}

	function setSelectedStatuses(statuses: Set<UserOrderType>) {
		selected_statuses.value = new Set(statuses)
	}

	function setSelectedDateRange(range: DateRange) {
		selected_date_range.value = { ...range }
	}

	function clearSelectedDateRange() {
		selected_date_range.value = { start: null, end: null }
	}

	function submitSearch() {
		committed_search.value = search_query.value.trim()
	}

	function clearSearch() {
		search_query.value = ''
		committed_search.value = ''
	}


	/**
	 * Computed
	 */
	const ongoing         = computed(() => applyFilters(user_orders_store.ongoing, 'ongoing'))
	const action_required = computed(() => applyFilters(user_orders_store.action_required, 'action_required'))
	const to_receive      = computed(() => applyFilters(user_orders_store.to_receive, 'to_receive'))
	const completed       = computed(() => applyFilters(user_orders_store.completed, 'completed'))
	const cancelled       = computed(() => applyFilters(user_orders_store.cancelled, 'cancelled'))
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
		selected_date_range,
		search_query,
		committed_search,

		ongoing,
		action_required,
		to_receive,
		completed,
		cancelled,
		is_loading,
		has_any_orders,

		setSelectedStatuses,
		setSelectedDateRange,
		clearSelectedDateRange,
		submitSearch,
		clearSearch,
	}
}