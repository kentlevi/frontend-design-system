export interface AccountOrder {
    id: string;
    itemCount: number;
    date: string;
    statusKey: string;
}

export const accountOrders: AccountOrder[] = [
    {
        id: '# 62411120012',
        itemCount: 2,
        date: '10/11/2024',
        statusKey: 'beforeProduction',
    },
    {
        id: '# 62411120004',
        itemCount: 1,
        date: '11/13/2024',
        statusKey: 'processing',
    },
    {
        id: '# 62411120002',
        itemCount: 1,
        date: '10/23/2024',
        statusKey: 'actionRequired',
    },
];
