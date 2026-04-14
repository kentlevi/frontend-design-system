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

	const has_shipping_addresses = computed(() => shipping_address.value.length > 0)
	const has_billing_addresses = computed(() => billing_address.value.length > 0)
	const has_drop_addresses = computed(() => drop_address.value.length > 0)

	const has_addresses = computed(() => {
		return shipping_address.value.length > 0
            || billing_address.value.length > 0
            || drop_address.value.length > 0
	})





	/** Loading status */
	const is_loading = ref(true)

	/**
     * Functions
     */

	/** Fetch user addresses */
	async function getAddresses(type: AddressType, options: { silent?: boolean } = {}) {
		if (!options.silent) {
			is_loading.value = true
		}

		try {
			const params = { type }

			const response = await fetchUserAddresses(params)

			if (response.success) {
				if (response.data) {
					address_store.setAddresses(type, response.data)
				}
			}
		} catch {
			console.log('error');
		} finally {
			if (!options.silent) {
				is_loading.value = false
			}
		}
	}

	/** Fetch all address types */
	async function fetchAllAddresses() {
		is_loading.value = true

		try {
			await Promise.all([
				getAddresses('shipping', { silent: true }),
				getAddresses('billing', { silent: true }),
				getAddresses('drop', { silent: true }),
			])
		} finally {
			is_loading.value = false
		}
	}

	return {
		shipping_address,
		billing_address,
		drop_address,
		has_shipping_addresses,
		has_billing_addresses,
		has_drop_addresses,
		has_addresses,
		is_loading,

		getAddresses,
		fetchAllAddresses,
	}
}