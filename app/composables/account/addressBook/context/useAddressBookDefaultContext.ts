import { inject, provide, type InjectionKey, type Ref } from 'vue'
import type { AddressItem, AddressType } from '~/types/address'

export type AddressBookDefaultContext = {
	is_confirm_default_change_modal_open: Ref<boolean>
	current_default_address: Ref<AddressItem | null>
	pending_default_address: Ref<AddressItem | null>
	closeConfirmDefaultChangeModal: () => void
	confirmDefaultAddressChange: (type: AddressType, address_id: number) => void
}

const address_book_default_context_key: InjectionKey<AddressBookDefaultContext> = Symbol('address-book-default-context')

export function provideAddressBookDefaultContext(context: AddressBookDefaultContext) {
	provide(address_book_default_context_key, context)
}

export function useAddressBookDefaultContext() {
	const context = inject(address_book_default_context_key)

	if (!context) {
		throw new Error('Address book default context is not available.')
	}

	return context
}