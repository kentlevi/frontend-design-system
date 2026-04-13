import type { AddressItem, AddressType } from "~/types/address";
import { useAddressBookListCheckoutContext } from "./context/addressBookListCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";

export function useSavedShippingAddress() {

	const { shipping_address, billing_address, drop_address, getAddresses } = useAddressBookListCheckoutContext()
	const checkout_store = useMainCheckOutStore()

	const address_map: Record<AddressType, {
		ref: ComputedRef<AddressItem[]>,
		setter: (address: AddressItem | null) => void
	}> = {
		shipping: { ref: shipping_address, setter: checkout_store.setShippingAddress },
		billing: { ref: billing_address, setter: checkout_store.setBillingAddress },
		drop: { ref: drop_address, setter: checkout_store.setDropAddress },
	}

	for (const type in address_map) {
		const { ref, setter } = address_map[type as AddressType]

		getAddresses(type as AddressType)

		watch(ref, (addresses) => {
			if (addresses.length === 0) return
			const selected = addresses.find(a => a.is_default) ?? addresses[0] ?? null
			setter(selected)
		}, { immediate: true })
	}
}