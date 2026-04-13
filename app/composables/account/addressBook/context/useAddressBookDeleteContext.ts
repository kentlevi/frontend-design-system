import { inject, provide, type ComputedRef, type InjectionKey, type Ref } from 'vue'
import type { AddressItem, AddressType } from '~/types/address'

export type AddressBookDeleteContext = {
	is_delete_modal_open: Ref<boolean>
	is_default_shipping_modal_open: Ref<boolean>
	replacement_addresses: ComputedRef<AddressItem[]>
	cancelDeleteFlow: () => void
	confirmDeleteAddress: () => Promise<void>
	cancelDefaultShippingFlow: () => void
	skipDefaultShippingSelection: () => void
	saveDefaultShippingSelection: (type: AddressType, address_id: number) => Promise<void>
}

const address_book_delete_context_key: InjectionKey<AddressBookDeleteContext> = Symbol('address-book-delete-context')

export function provideAddressBookDeleteContext(context: AddressBookDeleteContext) {
	provide(address_book_delete_context_key, context)
}

export function useAddressBookDeleteContext() {
	const context = inject(address_book_delete_context_key)

	if (!context) {
		throw new Error('Address book delete context is not available.')
	}

	return context
}