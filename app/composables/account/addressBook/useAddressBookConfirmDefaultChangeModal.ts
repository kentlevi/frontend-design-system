import { useAddressHelper } from "~/utils/address"
import { useUserAddressUIContext } from "./context/useUserAddressUIContext"
import { useUserAddressContext } from "./context/useUserAddressContext"
import { getTranslatedAddressBookLabel } from "./addressBookPresentation"
import type { AddressItem, ShippingAddress } from "~/types/user-address"

export function useAddressBookConfirmDefaultChangeModal() {

	/**
     * Contexts
     */
	const { is_confirm_default_change_modal_open, closeConfirmDefaultChangeModal } = useUserAddressUIContext()
	const { current_default_address, pending_default_address, setAddressDefaultWithToast } = useUserAddressContext()


	/**
     * Helpers
     */
	const { t: translate } = useI18n()
	const { buildAddressLines } = useAddressHelper()


	/**
     * Functions
     */
	const address_type_copy = computed(() => {
		if (!pending_default_address.value) return translate('account.addressBook.confirmDefaultChangeTypeAddress', { type: '' }).trim()

		const type = pending_default_address.value.type
		if (type === 'drop') return translate('account.addressBook.confirmDefaultChangeTypeDrop')
		if (type === 'shipping') return translate('account.addressBook.confirmDefaultChangeTypeShipping')
		return translate('account.addressBook.confirmDefaultChangeTypeBilling')
	})

	const modal_title = computed(() => {
		if (!pending_default_address.value) return translate('account.addressBook.confirmDefaultChangeTitle')

		const type = pending_default_address.value.type
		const key = `confirmDefaultChangeTitle${type.charAt(0).toUpperCase()}${type.slice(1)}`

		return translate(`account.addressBook.${key}`)
	})

	const modal_description = computed(() => {
		if (!pending_default_address.value) {
			return translate('account.addressBook.confirmDefaultChangeDescription', {
				type: address_type_copy.value,
			})
		}

		const type = pending_default_address.value.type
		const key = `confirmDefaultChangeDescription${type.charAt(0).toUpperCase()}${type.slice(1)}`

		return translate(`account.addressBook.${key}`)
	})

	const current_default_address_lines = computed(() => {
		if (!current_default_address.value) return ''
		return buildAddressLines(current_default_address.value).trim()
	})

	const pending_default_address_lines = computed(() => {
		if (!pending_default_address.value) return ''
		return buildAddressLines(pending_default_address.value).trim()
	})

	function getLabelCopy(label: AddressItem['label']) {
		return getTranslatedAddressBookLabel(label, translate)
	}

	function isShippingAddress(address: AddressItem): address is ShippingAddress {
		return address.type === 'shipping'
	}

	function confirmModal() {
		const next_address = pending_default_address.value

		if (!next_address) return

		closeConfirmDefaultChangeModal()
		setAddressDefaultWithToast(next_address.type, next_address.id)
	}

	function closeModal() {
		closeConfirmDefaultChangeModal()
		current_default_address.value = null
		pending_default_address.value = null
	}

	return {
		translate,

		is_confirm_default_change_modal_open,
		current_default_address,
		pending_default_address,
		modal_title,
		modal_description,
		current_default_address_lines,
		pending_default_address_lines,

		getLabelCopy,
		isShippingAddress,
		confirmModal,
		closeModal,
	}
}