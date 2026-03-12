export type AddressType = 'Home' | 'Office' | 'Client';

export interface AccountAddressBookItem {
	name: string;
	phone?: string;
	address: string;
	company: string;
	tag: AddressType;
	isDefault?: boolean;
}