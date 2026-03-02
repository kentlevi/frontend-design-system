import { accountReviews } from '~/data/account/reviews';

export function useAccountReviews() {
    return {
        reviews: accountReviews,
    };
}
