import { accountCoupons } from '~/data/account/coupons';

export function useAccountCoupons() {
    return {
        coupons: accountCoupons,
    };
}
