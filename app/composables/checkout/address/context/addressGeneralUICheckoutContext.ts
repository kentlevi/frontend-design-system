import type { InjectionKey } from "vue";
import type { useAddressGeneralUI } from "../useAddressGeneralUI";

export type AddressGeneralUICheckoutContext = ReturnType<typeof useAddressGeneralUI>

const address_checkout_context_key: InjectionKey<AddressGeneralUICheckoutContext> = Symbol('address-general-ui-checkout-context')

export function provideAddressGeneralUICheckoutContext(context: AddressGeneralUICheckoutContext) {
	provide(address_checkout_context_key, context)
}

export function useAddressGeneralUICheckoutContext() {
	const context = inject(address_checkout_context_key)

	if (!context) {
		throw new Error('Address general ui checkout context is not available')
	}

	return context
}