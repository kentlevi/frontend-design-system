import { accountReviews } from '~/data/account/reviews';
import { useAccountCollection } from '~/composables/account/useAccountCollection';

export function useAccountReviews() {
	return {
		reviews: useAccountCollection(accountReviews).items,
	};
}