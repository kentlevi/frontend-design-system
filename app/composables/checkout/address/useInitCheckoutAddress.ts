import { loadAddresses } from "~/services/user-address/user-address.service"
import { ensureDynamicFields } from "~/services/address-dynamic-fields/dynamic-fields.service"

export async function useInitCheckoutAddress() {
	await ensureDynamicFields()

	loadAddresses('shipping')
	loadAddresses('drop')
	loadAddresses('billing')
}