import { computed } from 'vue'
import { useAccountCollection } from '~/composables/account/useAccountCollection'
import { accountAddressBookItems } from '~/data/account/addressBook'
import type { AddressSection } from '~/types/account/addressBook';

export function useAccountAddressBook() {
	const collection = useAccountCollection(accountAddressBookItems);
	const section_order: AddressSection[] = ['shipping', 'billing', 'dropShipping'];
	const items_by_section = computed(() => {
		return section_order.map((section) => ({
			section,
			items: collection.items.filter((item) => item.section === section),
		})).filter((group) => group.items.length > 0);
	});

	return {
		...collection,
		items_by_section,
	}
}