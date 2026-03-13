export type AddressType = 'Home' | 'Office' | 'Client';
export type AddressSection = 'shipping' | 'billing' | 'dropShipping';

export interface AccountAddressBookItem {
	name: string;
	phone?: string;
	address: string;
	company: string;
	tag: AddressType;
	section: AddressSection;
	isDefault?: boolean;
}