import { fetchUserAddresses } from "~/services/profile/address.service";
import { useAddressStore } from "~/stores/address/address.store";
import type { AddressType } from "~/types/address";

export function useAccountAddressBook() {
	/**
     * Store
     */
	const address_store = useAddressStore()

	/**
     * Addresses
     */
	const shipping_address = computed(() => address_store.shipping_address)
	const billing_address = computed(() => address_store.billing_address)
	const drop_address = computed(() => address_store.drop_address)

	const is_add_modal_open = ref(false)

	/**
     * Fetch user addresses
     */
	async function getAddresses(type: AddressType) {
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
		}
	}

	async function addAddress() {

	}


	function openAddModal() {
		is_add_modal_open.value = true
	}

	return {
		shipping_address,
		billing_address,
		drop_address,

		is_add_modal_open,

		getAddresses,
		addAddress,
		openAddModal
	}
}