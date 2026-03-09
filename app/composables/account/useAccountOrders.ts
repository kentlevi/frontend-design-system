import { accountOrders } from '~/data/account/orders';
import { useAccountCollectionWithActive } from '~/composables/account/useAccountCollection';

export function useAccountOrders() {
	const { items, activeItem } = useAccountCollectionWithActive(accountOrders);

	return {
		orders: items,
		activeOrder: activeItem,
	};
}