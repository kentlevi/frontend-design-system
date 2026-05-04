import { inject, provide, type InjectionKey } from 'vue'
import type { useUserAddressFormState } from '~/composables/account/addressBook/context/useUserAddressFormState'

export type AddressFormCheckoutContext = ReturnType<typeof useUserAddressFormState>

const address_checkout_context_key: InjectionKey<AddressFormCheckoutContext> = Symbol('address-checkout-context')

export function provideAddressFormCheckoutContext(context: AddressFormCheckoutContext) {
	provide(address_checkout_context_key, context)
}

export function useAddressFormCheckoutContext() {
	const context = inject(address_checkout_context_key)

	if (!context) {
		throw new Error('Address checkout context is not available.')
	}

	return context
}