import { loadAddresses } from "~/services/user-address/user-address.service"
import { provideUserAddressDataCheckout } from "./context/addressBookListCheckoutContext"
import { provideUserAddressFormStateCheckout } from "./context/addressFormCheckoutContext"
import { provideAddressGeneralUI } from "./context/addressGeneralUICheckoutContext"

export function useInitCheckoutAddress() {
	loadAddresses('shipping')
	loadAddresses('drop')
	loadAddresses('billing')

	provideUserAddressFormStateCheckout()
	provideUserAddressDataCheckout()
	provideAddressGeneralUI()
}