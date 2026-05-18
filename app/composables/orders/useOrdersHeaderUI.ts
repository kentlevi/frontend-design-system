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
	 * State
	 */
	const date_picker_open = ref(false)

	const selected_range = ref({
		start: new Date(),
		end: defaultRangeEnd(),
	})

	const filter_status = ref(false)
	const search_query = ref('')


	return {
		date_picker_open,
		selected_range,
		filter_status,
		search_query,
		active_options,

		translate,
	}
}