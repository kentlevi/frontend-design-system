import type { AddressFormMap, AddressItem, AddressType } from "~/types/address";
import { useAddressBookListCheckoutContext } from "./context/addressBookListCheckoutContext";
import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { mapAddressToForm } from "~/factories/address";
import { useAddressFieldStore } from "~/stores/address";

export function useSavedShippingAddress() {

	/** Stores */
	const address_field_store = useAddressFieldStore()
	const checkout_store = useMainCheckOutStore()

	const { shipping_address, billing_address, drop_address, getAddresses } = useAddressBookListCheckoutContext()

	const address_map: Record<AddressType, {
		ref: ComputedRef<AddressItem[]>,
		formSetter: (address: AddressFormMap[AddressType]) => void
		idSetter: (id: number) => void
	}> = {
		shipping: {
			ref: shipping_address,
			formSetter: checkout_store.setShippingAddress,
			idSetter: checkout_store.setShippingAddressId
		},
		billing: {
			ref: billing_address,
			formSetter: checkout_store.setBillingAddress,
			idSetter: checkout_store.setBillingAddressId
		},
		drop: {
			ref: drop_address,
			formSetter: checkout_store.setDropAddress,
			idSetter: checkout_store.setDropAddressId
		},
	}

	for (const type in address_map) {
		const { ref, formSetter, idSetter } = address_map[type as AddressType]

		getAddresses(type as AddressType)

		watch(ref, (addresses) => {
			if (addresses.length === 0) return
			const selected = addresses.find(a => a.is_default) ?? addresses[0] ?? null

			if (!selected) return;

			const mapped_form = mapAddressToForm(selected, address_field_store.dynamic_address_fields)

			formSetter(mapped_form)
			idSetter(selected.id)
		}, { immediate: true })
	}
}