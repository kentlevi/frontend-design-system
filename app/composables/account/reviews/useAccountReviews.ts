import { useAccountCollection } from '~/composables/account/useAccountCollection'
import { accountReviews } from '~/data/account/reviews'

export function useAccountReviews() {
	return {
		reviews: useAccountCollection(accountReviews).items,
	}
}