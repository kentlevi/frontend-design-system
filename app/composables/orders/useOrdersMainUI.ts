export function useOrdersMainUI() {

	/**
	 * i18n
	 */
	const { t: translate } = useI18n()


	/**
	 * State
	 */
	const is_detail_open = ref(false)


	return {
		is_detail_open,

		translate,
	}
}