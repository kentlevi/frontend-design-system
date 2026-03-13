import { computed } from 'vue'
import { useAccountCollection } from '~/composables/account/useAccountCollection'
import { accountAddressBookItems } from '~/data/account/addressBook'
import type { AddressSection } from '~/types/account/addressBook';

export function useAccountAddressBook() {
	const collection = useAccountCollection(accountAddressBookItems);
	const sectionOrder: AddressSection[] = ['shipping', 'billing', 'dropShipping'];
	const itemsBySection = computed(() => {
		return sectionOrder.map((section) => ({
			section,
			items: collection.items.filter((item) => item.section === section),
		})).filter((group) => group.items.length > 0);
	});

	return {
		...collection,
		itemsBySection,
	}
}