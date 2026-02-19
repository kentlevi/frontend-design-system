export interface AccountPointLog {
    titleKey: string;
    date: string;
    value: string;
    positive: boolean;
}

export const accountPointLogs: AccountPointLog[] = [
    { titleKey: 'earned', date: '11/05/2024', value: '+0.36 P', positive: true },
    { titleKey: 'used', date: '11/05/2024', value: '-25.00 P', positive: false },
    { titleKey: 'quest', date: '10/22/2024', value: '+5.00 P', positive: true },
];

export const accountPointLastTierUpgradeDate = '01/11/2025';
export const accountPointBalance = '13.90';
