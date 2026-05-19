import type { UserOrderType } from '~/types/order/user-orders'
import { useOrdersListContext } from '~/composables/orders/context/useOrdersListContext'
import { useOrderDetailContext } from '~/composables/orders/context/useOrderDetailContext'
import { useCountry } from '~/composables/app/country/useCountry'
import { useUserOrdersStore } from '~/stores/orders/user-orders.store'
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from '~/constants/order-detail/status'

const active_options = [
	{ label: 'Active', value: 'active' },
	{ label: 'Inactive', value: 'inactive' },
]

function defaultRangeEnd() {
	const now = new Date()
	return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 4)
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
		search_query,
		committed_search,
		setSelectedStatuses,
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

	const selected_range = ref({
		start: new Date(),
		end: defaultRangeEnd(),
	})

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
		}))
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
	 * Watch input → auto-clear when emptied after a committed search
	 */
	watch(search_query, (val) => {
		if (val === '' && committed_search.value !== '') {
			clearSearch()
		}
	})


	return {
		date_picker_open,
		selected_range,
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
		submitSearch,
		clearSearch,
	}
}