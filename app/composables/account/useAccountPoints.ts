import {
	accountPointBalance,
	accountPointLastTierUpgradeDate,
	accountPointLogs,
} from '~/data/account/points';
import { useAccountCollection } from '~/composables/account/useAccountCollection';

export function useAccountPoints() {
	return {
		logs: useAccountCollection(accountPointLogs).items,
		balance: accountPointBalance,
		lastTierUpgradeDate: accountPointLastTierUpgradeDate,
	};
}