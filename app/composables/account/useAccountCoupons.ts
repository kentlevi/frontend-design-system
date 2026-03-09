import { accountCoupons } from '~/data/account/coupons';
import { useAccountCollection } from '~/composables/account/useAccountCollection';

export function useAccountCoupons() {
	return {
		coupons: useAccountCollection(accountCoupons).items,
	};
}