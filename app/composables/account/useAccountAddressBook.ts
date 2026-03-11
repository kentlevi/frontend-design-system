import { accountAddressBookItems } from '~/data/account/addressBook';
import { useAccountCollection } from '~/composables/account/useAccountCollection';

export function useAccountAddressBook() {
	return {
		...useAccountCollection(accountAddressBookItems),
	};
}