import { useAccountCollection } from '~/composables/account/useAccountCollection'
import { accountAddressBookItems } from '~/data/account/addressBook'

export function useAccountAddressBook() {
	return {
		...useAccountCollection(accountAddressBookItems),
	}
}