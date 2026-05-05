import type { InjectionKey } from "vue";
import type { useUserAddressData } from "~/composables/account/addressBook/context/useUserAddressData";

export type AddressBookListCheckoutContext = ReturnType<typeof useUserAddressData>

const address_checkout_context_key: InjectionKey<AddressBookListCheckoutContext> = Symbol('book-list-address-checkout-context')

export function provideAddressBookListCheckoutContext(context: AddressBookListCheckoutContext) {
	provide(address_checkout_context_key, context)
}

export function useAddressBookListCheckoutContext() {
	const context = inject(address_checkout_context_key)

	if (!context) {
		throw new Error('Address book list checkout context is not available')
	}

	return context
}