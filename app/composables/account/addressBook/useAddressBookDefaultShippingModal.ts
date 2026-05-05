import { useAddressHelper } from "~/utils/address";
import { useUserAddressUIContext } from "./context/useUserAddressUIContext";
import { useUserAddressContext } from "./context/useUserAddressContext";
import type { AddressItem, AddressType } from "~/types/user-address";
import { capitalizeAddressBookLabel, getTranslatedAddressBookLabel } from "./addressBookPresentation";

export function useAddressBookDefaultShippingModal() {

	/**
     * Contexts
     */
	const {
		is_default_shipping_modal_open,

		closeDefaultShippingModal,
	} = useUserAddressUIContext()
	const {
		pending_delete_address,

		getReplacementAddresses,
		cancelDeleteFlow,
		confirmDeleteAddress,
		setAddressDefault,
	} = useUserAddressContext()

	/**
     * Store
     */
	const loading_overlay_store = useLoadingOverlayStore()


	/**
     * Helpers
     */
	const { t: translate } = useI18n();
	const { buildAddressLines, shippingPhoneNumber } = useAddressHelper()


	/**
     * Variables
     */
	const selected_address_id = ref<number | null>(null)


	/**
     * Computed
     */
	const replacement_addresses = computed<AddressItem[]>(() => {
		const pending_type = pending_delete_address.value?.type
		return pending_type ? getReplacementAddresses(pending_type) : []
	})
	const default_selection_type = computed(() => replacement_addresses.value[0]?.type ?? 'shipping')
	const default_selection_title = computed(() => translate(`account.addressBook.selectNewDefaultTitle${capitalizeAddressBookLabel(default_selection_type.value)}`))
	const default_selection_description = computed(() => translate(`account.addressBook.selectNewDefaultDescription${capitalizeAddressBookLabel(default_selection_type.value)}`))


	/**
     * Watchers
     */
	watch(() => is_default_shipping_modal_open.value, (is_open) => {
		if (is_open) {
			selected_address_id.value = null
		}
	})

	/**
     * Functions
     */
	function cancelDefaultShippingFlow() {
		closeDefaultShippingModal()
		cancelDeleteFlow()
	}

	function skipDefaultShippingSelection() {
		confirmDeleteAddress({ continue_after_selection: true })
	}

	async function deleteAndSetDefault(type: AddressType, address_id: number) {

		loading_overlay_store.startLoading('set_default', {
			showCopy: true,
			testId: 'account-address-set-default-overlay',
			position: 'fixed'
		})

		await Promise.all([
			confirmDeleteAddress({ continue_after_selection: true, overlay: false }),
			setAddressDefault(type, address_id),
		])

		loading_overlay_store.stopLoading('set_default')
	}

	function closeModal() {
		cancelDefaultShippingFlow()
	}

	function skipSelection() {
		skipDefaultShippingSelection()
	}

	async function saveSelection() {
		if (selected_address_id.value === null) return

		const selected_address = replacement_addresses.value.find((address) => address.id === selected_address_id.value)

		if (!selected_address) return

		await deleteAndSetDefault(selected_address.type, selected_address_id.value)
	}

	function getAddressLabel(label: string) {
		return getTranslatedAddressBookLabel(label, translate)
	}


	return {
		translate,

		selected_address_id,
		is_default_shipping_modal_open,
		replacement_addresses,
		default_selection_title,
		default_selection_description,

		buildAddressLines,
		shippingPhoneNumber,
		closeModal,
		skipSelection,
		saveSelection,
		getAddressLabel,
	}
}