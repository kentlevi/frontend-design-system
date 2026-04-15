import { useAddressStore } from "~/stores/address/address.store";

export function useAddressBookList() {

	/**
     * Store
     */
	const address_store = useAddressStore()

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

	const has_shipping_addresses = computed(() => shipping_address.value.length > 0)
	const has_billing_addresses = computed(() => billing_address.value.length > 0)
	const has_drop_addresses = computed(() => drop_address.value.length > 0)

	const has_addresses = computed(() => {
		return shipping_address.value.length > 0
            || billing_address.value.length > 0
            || drop_address.value.length > 0
	})


	return {
		shipping_address,
		billing_address,
		drop_address,
		has_shipping_addresses,
		has_billing_addresses,
		has_drop_addresses,
		has_addresses,

		is_shipping_fetching,
		is_billing_fetching,
		is_drop_fetching
	}
}