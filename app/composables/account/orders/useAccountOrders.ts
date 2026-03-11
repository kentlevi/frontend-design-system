import { useAccountCollectionWithActive } from '~/composables/account/useAccountCollection'
import { accountOrders } from '~/data/account/orders'

export function useAccountOrders() {
	const { items, activeItem } = useAccountCollectionWithActive(accountOrders)

	return {
		orders: items,
		activeOrder: activeItem,
	}
}