import { useAddressFieldStore, useUserAddressStore } from "~/stores/user-address";
import type { AddressType } from "~/types/user-address";


export function useUserAddressData() {

	/**
     * Stores
     */
	const address_store = useUserAddressStore()
	const address_field_store = useAddressFieldStore()


	/**
     * Computed
     */

	/** Addresses */
	const shipping_address = computed(() => address_store.shipping_address)
	const billing_address = computed(() => address_store.billing_address)
	const drop_address = computed(() => address_store.drop_address)

	/** Loading */
	const is_shipping_fetching = computed(() => address_store.isLoading('fetch', 'shipping'))
	const is_billing_fetching = computed(() => address_store.isLoading('fetch', 'billing'))
	const is_drop_fetching = computed(() => address_store.isLoading('fetch', 'drop'))
	const is_loading = computed(() => is_shipping_fetching.value || is_billing_fetching.value || is_drop_fetching.value)
	const is_submitting = computed(() => address_store.isLoading('create') || address_store.isLoading('update'))

	/** Dynamic Fields */
	const dynamic_fields = computed(() => address_field_store.dynamic_address_fields ?? [])

	/** Has Addresses */
	const has_shipping_addresses = computed(() => shipping_address.value.length > 0)
	const has_billing_addresses = computed(() => billing_address.value.length > 0)
	const has_drop_addresses = computed(() => drop_address.value.length > 0)
	const has_addresses = computed(() => has_shipping_addresses.value || has_billing_addresses.value || has_drop_addresses.value)


	/**
     * Variables
     */

	/** Sections */
	const base_sections = {
		shipping: { items: shipping_address, loading: is_shipping_fetching },
		billing: { items: billing_address, loading: is_billing_fetching },
		drop: { items: drop_address, loading: is_drop_fetching },
	}

	const sections = computed(() =>
		(Object.entries(base_sections) as [AddressType, typeof base_sections[AddressType]][])
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
		dynamic_fields,

		has_shipping_addresses,
		has_billing_addresses,
		has_drop_addresses,
		has_addresses,

		sections,

		is_shipping_fetching,
		is_billing_fetching,
		is_drop_fetching,
		is_loading,
		is_submitting,

		address_store,
		address_field_store,
	}
}