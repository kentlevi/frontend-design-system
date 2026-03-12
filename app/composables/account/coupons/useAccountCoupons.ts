import { useAccountCollection } from '~/composables/account/useAccountCollection'
import { accountCoupons } from '~/data/account/coupons'

export function useAccountCoupons() {
	return {
		coupons: useAccountCollection(accountCoupons).items,
	}
}