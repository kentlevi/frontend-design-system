import type { UserOrderType } from '~/types/order/user-orders'
import type { DateRange } from '~/composables/orders/context/useOrdersList'
import { useOrdersListContext } from '~/composables/orders/context/useOrdersListContext'
import { useOrderDetailContext } from '~/composables/orders/context/useOrderDetailContext'
import { useCountry } from '~/composables/app/country/useCountry'
import { useUserOrdersStore } from '~/stores/orders/user-orders.store'
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '~/constants/order-detail/status'

const active_options = [
	{ label: 'Active', value: 'active' },
	{ label: 'Inactive', value: 'inactive' },
]

type QuickFilterKey = 'today' | 'this-week' | 'this-month' | 'last-7-days' | 'last-30-days'

type QuickFilter = {
	key: QuickFilterKey
	label: string
	resolve: () => DateRange
}

const quick_filters: QuickFilter[] = [
	{
		key: 'today',
		label: 'Today',
		resolve: () => {
			const today = new Date()
			return { start: today, end: today }
		},
	},
	{
		key: 'this-week',
		label: 'This Week',
		resolve: () => {
			const today = new Date()
			const start = new Date(today)
			start.setDate(today.getDate() - today.getDay())
			const end = new Date(start)
			end.setDate(start.getDate() + 6)
			return { start, end }
		},
	},
	{
		key: 'this-month',
		label: 'This Month',
		resolve: () => {
			const today = new Date()
			const start = new Date(today.getFullYear(), today.getMonth(), 1)
			const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
			return { start, end }
		},
	},
	{
		key: 'last-7-days',
		label: 'Last 7 days',
		resolve: () => {
			const end = new Date()
			const start = new Date(end)
			start.setDate(end.getDate() - 6)
			return { start, end }
		},
	},
	{
		key: 'last-30-days',
		label: 'Last 30 days',
		resolve: () => {
			const end = new Date()
			const start = new Date(end)
			start.setDate(end.getDate() - 29)
			return { start, end }
		},
	},
]

function isSameDay(a: Date, b: Date) {
	return a.getFullYear() === b.getFullYear()
		&& a.getMonth() === b.getMonth()
		&& a.getDate() === b.getDate()
}

function formatDateRange(range: DateRange) {
	const { start, end } = range
	if (!start && !end) return 'Select Date'

	if (start && end) {
		return isSameDay(start, end)
			? start.toLocaleDateString()
			: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`
	}

	return (start ?? end)?.toLocaleDateString() ?? 'Select Date'
}

export function useOrdersHeaderUI() {

	/**
	 * i18n
	 */
	const { t: translate } = useI18n()


	/**
	 * Context
	 */
	const {
		ongoing,
		action_required,
		to_receive,
		completed,
		cancelled,
		selected_statuses,
		selected_date_range,
		search_query,
		committed_search,
		setSelectedStatuses,
		setSelectedDateRange,
		clearSelectedDateRange,
		submitSearch: commitSearch,
		clearSearch: resetSearchState,
	} = useOrdersListContext()

	const { has_selected, loadOrderDetail } = useOrderDetailContext()

	const { withCountry } = useCountry()


	/**
	 * Store
	 */
	const user_orders_store = useUserOrdersStore()


	/**
	 * State
	 */
	const date_picker_open = ref(false)
	const pending_date_range = ref<DateRange>({ ...selected_date_range.value })
	const active_quick_filter = ref<QuickFilterKey | null>(null)
	let setting_from_quick_filter = false

	const filter_status = ref(false)
	const pending_statuses = ref<Set<UserOrderType>>(new Set(selected_statuses.value))


	/**
	 * Computed
	 */
	const counts_by_type = computed<Record<UserOrderType, number>>(() => ({
		ongoing: ongoing.value.length,
		action_required: action_required.value.length,
		to_receive: to_receive.value.length,
		completed: completed.value.length,
		cancelled: cancelled.value.length,
	}))

	const status_options = computed(() =>
		ORDER_STATUSES.map(type => ({
			type,
			label: ORDER_STATUS_LABELS[type],
			count: counts_by_type.value[type],
		})),
	)

	const date_button_label = computed(() => formatDateRange(selected_date_range.value))
	const pending_date_label = computed(() => formatDateRange(pending_date_range.value))
	const has_date_filter = computed(() =>
		selected_date_range.value.start !== null || selected_date_range.value.end !== null,
	)


	/**
	 * Functions
	 */
	function isStatusPending(type: UserOrderType) {
		return pending_statuses.value.has(type)
	}

	function toggleStatus(type: UserOrderType) {
		const next = new Set(pending_statuses.value)
		if (next.has(type)) next.delete(type)
		else next.add(type)
		pending_statuses.value = next
	}

	function openFilter() {
		pending_statuses.value = new Set(selected_statuses.value)
		filter_status.value = true
	}

	function applyFilter() {
		setSelectedStatuses(pending_statuses.value)
		filter_status.value = false
	}

	function cancelFilter() {
		pending_statuses.value = new Set(selected_statuses.value)
		filter_status.value = false
	}

	function toggleFilter() {
		if (filter_status.value) cancelFilter()
		else openFilter()
	}

	function selectQuickFilter(filter: QuickFilter) {
		setting_from_quick_filter = true
		active_quick_filter.value = filter.key
		pending_date_range.value = filter.resolve()
		nextTick(() => {
			setting_from_quick_filter = false
		})
	}

	function openDatePicker() {
		pending_date_range.value = { ...selected_date_range.value }
		active_quick_filter.value = null
		date_picker_open.value = true
	}

	function applyDatePicker() {
		setSelectedDateRange(pending_date_range.value)
		date_picker_open.value = false
	}

	function cancelDatePicker() {
		pending_date_range.value = { ...selected_date_range.value }
		date_picker_open.value = false
	}

	function toggleDatePicker() {
		if (date_picker_open.value) cancelDatePicker()
		else openDatePicker()
	}

	function clearDateFilter() {
		clearSelectedDateRange()
		pending_date_range.value = { start: null, end: null }
		active_quick_filter.value = null
		date_picker_open.value = false
	}

	function submitSearch() {
		commitSearch()

		const query = committed_search.value
		if (!query) return

		const match = user_orders_store.findByOrderNumber(query)
		if (match) loadOrderDetail(match.id)
	}

	function clearSearch() {
		resetSearchState()

		const first = user_orders_store.findFirst()
		if (first) {
			loadOrderDetail(first.id)
		} else {
			has_selected.value = false
			navigateTo(withCountry('/account/orders'))
		}
	}


	/**
	 * Watchers
	 */
	watch(search_query, (val) => {
		if (val === '' && committed_search.value !== '') {
			clearSearch()
		}
	})

	watch(pending_date_range, () => {
		if (setting_from_quick_filter) return
		active_quick_filter.value = null
	}, { deep: true })


	return {
		date_picker_open,
		pending_date_range,
		active_quick_filter,
		date_button_label,
		pending_date_label,
		has_date_filter,
		quick_filters,
		filter_status,
		search_query,
		active_options,
		status_options,

		translate,
		isStatusPending,
		toggleStatus,
		toggleFilter,
		applyFilter,
		cancelFilter,
		selectQuickFilter,
		toggleDatePicker,
		applyDatePicker,
		cancelDatePicker,
		clearDateFilter,
		submitSearch,
		clearSearch,
	}
}