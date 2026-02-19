import { accountAddressBookItems } from '~/data/account/addressBook';

export function useAccountAddressBook() {
    return {
        items: accountAddressBookItems,
    };
}
