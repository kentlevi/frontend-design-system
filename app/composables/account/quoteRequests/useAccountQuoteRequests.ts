import { useAccountCollectionWithActive } from '~/composables/account/useAccountCollection'
import { accountQuoteRequests } from '~/data/account/quoteRequests'

export function useAccountQuoteRequests() {
	const { items, activeItem } = useAccountCollectionWithActive(accountQuoteRequests)

	return {
		requests: items,
		activeRequest: activeItem,
	}
}