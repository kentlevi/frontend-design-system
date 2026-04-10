import { inject, provide, type InjectionKey } from 'vue'
import type { useAddressFormState } from '~/composables/account/addressBook/useAddressFormState'

export type AddressCheckoutContext = ReturnType<typeof useAddressFormState>

const address_checkout_context_key: InjectionKey<AddressCheckoutContext> = Symbol('address-checkout-context')

export function provideAddressCheckoutContext(context: AddressCheckoutContext) {
	provide(address_checkout_context_key, context)
}

export function useAddressCheckoutContext() {
	const context = inject(address_checkout_context_key)

	if (!context) {
		throw new Error('Address checkout context is not available.')
	}

	return context
}