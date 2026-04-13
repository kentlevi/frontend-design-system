import { inject, provide, type InjectionKey } from 'vue'
import type { AddressMap, AddressType } from '~/types/address'

export type AddressBookMenuAction = 'edit' | 'delete' | 'default'

export type AddressBookMenuPayload = {
	action: AddressBookMenuAction
	item: AddressMap[AddressType]
}

export type AddressBookCardActionContext = {
	handleCardMenuAction: (payload: AddressBookMenuPayload) => void
}

const address_book_card_action_context_key: InjectionKey<AddressBookCardActionContext> = Symbol('address-book-card-action-context')

export function provideAddressBookCardActionContext(context: AddressBookCardActionContext) {
	provide(address_book_card_action_context_key, context)
}

export function useAddressBookCardActionContext() {
	const context = inject(address_book_card_action_context_key)

	if (!context) {
		throw new Error('Address book card action context is not available.')
	}

	return context
}