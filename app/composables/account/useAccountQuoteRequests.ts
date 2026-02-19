import { computed } from 'vue';
import { accountQuoteRequests } from '~/data/account/quoteRequests';

export function useAccountQuoteRequests() {
    const activeRequest = computed(() => accountQuoteRequests[0] ?? null);

    return {
        requests: accountQuoteRequests,
        activeRequest,
    };
}
