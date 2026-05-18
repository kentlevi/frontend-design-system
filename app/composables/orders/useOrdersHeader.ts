import { useOrdersListContext } from '~/composables/orders/context/useOrdersListContext'

export function useOrdersHeader() {

	/**
	 * Context
	 */
	const { active_mode } = useOrdersListContext()


	return {
		active_mode,
	}
}