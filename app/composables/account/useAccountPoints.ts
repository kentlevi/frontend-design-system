import {
    accountPointBalance,
    accountPointLastTierUpgradeDate,
    accountPointLogs,
} from '~/data/account/points';

export function useAccountPoints() {
    return {
        logs: accountPointLogs,
        balance: accountPointBalance,
        lastTierUpgradeDate: accountPointLastTierUpgradeDate,
    };
}
