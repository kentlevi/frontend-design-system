export type AddressType = 'Home' | 'Office' | 'Client';

export interface AccountAddressBookItem {
    name: string;
    phone?: string;
    address: string;
    company: string;
    tag: AddressType;
    isDefault?: boolean;
}

export const accountAddressBookItems: AccountAddressBookItem[] = [
    {
        name: 'Primary Contact',
        phone: '+1 (551) 236-4533',
        address:
            '250 Hudson St, New York, NY 10013, United States',
        company: 'Summit Inc.',
        tag: 'Home',
        isDefault: true,
    },
    {
        name: 'Primary Contact',
        phone: '+1 (818) 922-5542',
        address: '600 Wilshire Blvd, Los Angeles, CA 90017, United States',
        company: 'Lock&Lock Inc.',
        tag: 'Office',
    },
    {
        name: 'Primary Contact',
        phone: '+1 (917) 524-8858',
        address:
            '401 Congress Ave, Austin, TX 78701, United States',
        company: 'Lock&Lock Inc.',
        tag: 'Client',
    },
];
