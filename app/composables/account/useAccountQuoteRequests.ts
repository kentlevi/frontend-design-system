import { accountQuoteRequests } from '~/data/account/quoteRequests';
import { useAccountCollectionWithActive } from '~/composables/account/useAccountCollection';

export function useAccountQuoteRequests() {
	const { items, activeItem } = useAccountCollectionWithActive(accountQuoteRequests);

	return {
		requests: items,
		activeRequest: activeItem,
	};
}