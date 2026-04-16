import { useUserAddressStore } from "~/stores/user-address";
import type { AddressType } from "~/types/user-address";

export function useAddressBookList() {

	/**
     * Store
     */
	const address_store = useUserAddressStore()

	/**
     * Variables
     */

	/** Addresses */
	const shipping_address = computed(() => address_store.shipping_address)
	const billing_address = computed(() => address_store.billing_address)
	const drop_address = computed(() => address_store.drop_address)

	const is_shipping_fetching = computed(() => address_store.isLoading('fetch', 'shipping'))
	const is_billing_fetching = computed(() => address_store.isLoading('fetch', 'billing'))
	const is_drop_fetching = computed(() => address_store.isLoading('fetch', 'drop'))
	const is_loading = computed(() =>
		is_shipping_fetching.value || is_billing_fetching.value || is_drop_fetching.value
	)

	const has_shipping_addresses = computed(() => shipping_address.value.length > 0)
	const has_billing_addresses = computed(() => billing_address.value.length > 0)
	const has_drop_addresses = computed(() => drop_address.value.length > 0)

	const has_addresses = computed(() => {
		return shipping_address.value.length > 0
            || billing_address.value.length > 0
            || drop_address.value.length > 0
	})

	const baseSections = {
		shipping: {
			items: shipping_address,
			loading: is_shipping_fetching,
		},
		billing: {
			items: billing_address,
			loading: is_billing_fetching,
		},
		drop: {
			items: drop_address,
			loading: is_drop_fetching,
		},
	} as const

	const sections = computed(() =>
		(Object.entries(baseSections) as [AddressType, typeof baseSections[AddressType]][])
			.map(([section, data]) => ({
				section,
				items: data.items.value,
				loading: data.loading.value,
			}))
			.filter(section => section.loading || section.items.length > 0)
	)

	return {
		shipping_address,
		billing_address,
		drop_address,
		has_shipping_addresses,
		has_billing_addresses,
		has_drop_addresses,
		has_addresses,

		sections,

		is_shipping_fetching,
		is_billing_fetching,
		is_drop_fetching,
		is_loading
	}
}