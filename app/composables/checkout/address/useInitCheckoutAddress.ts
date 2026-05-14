import { loadAddresses } from "~/services/user-address/user-address.service"
import { provideUserAddressDataCheckout } from "./context/addressBookListCheckoutContext"
import { provideUserAddressFormStateCheckout } from "./context/addressFormCheckoutContext"
import { provideAddressGeneralUI } from "./context/addressGeneralUICheckoutContext"
import { ensureDynamicFields } from "~/services/address-dynamic-fields/dynamic-fields.service"

export function useInitCheckoutAddress() {
	ensureDynamicFields()

	loadAddresses('shipping')
	loadAddresses('drop')
	loadAddresses('billing')

	provideUserAddressFormStateCheckout()
	provideUserAddressDataCheckout()
	provideAddressGeneralUI()
}