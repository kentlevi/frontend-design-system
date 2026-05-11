import { useUserAddressStore } from "~/stores/user-address"
import type { AddressFormMap, AddressItem, AddressLineForm, AddressType, AddressWithLines } from "~/types/user-address"

export function useAddressHelper() {
	/** Check whether the form supports address lines */
	function hasAddressLines(form: AddressFormMap[AddressType]): form is AddressLineForm {
		return form.type !== 'drop'
	}

	/** Check whether the form supports phone number */
	function hasPhoneNumber(form: AddressFormMap[AddressType]): form is AddressFormMap['shipping'] {
		return form.type === 'shipping'
	}

	/** Blocks non-digit keyboard input for phone fields */
	function onPhoneBeforeInput(event: InputEvent) {
	// allow delete/backspace/etc (event.data can be null)
		if (!event.data) return

		if (/\D/.test(event.data)) {
			event.preventDefault()
		}
	}

	/** Blocks non-digit paste input for phone fields */
	function onPhonePaste(event: ClipboardEvent) {
		const pasted = event.clipboardData?.getData('text') ?? ''

		if (/\D/.test(pasted)) {
			event.preventDefault()
		}
	}

	function getAddressListByType(type: AddressType) {
		const address_store = useUserAddressStore()

		if (type === 'shipping') return address_store.shipping_address
		if (type === 'billing') return address_store.billing_address
		return address_store.drop_address
	}

	function getAddressLineParts(address: Partial<AddressWithLines> & { type: AddressType }) {
		const lines: string[] = []

		if ('dynamic_fields' in address && Array.isArray(address.dynamic_fields)) {
			address.dynamic_fields.forEach((field) => {
				if (field?.value) lines.push(field.value)
			})
		}

		if ('address_line_1' in address && address.address_line_1) lines.push(address.address_line_1)
		if ('address_line_2' in address && address.address_line_2) lines.push(address.address_line_2)

		if ('postcode' in address && address.postcode) lines.push(address.postcode)

		return lines
	}

	function buildAddressLines(address: Partial<AddressWithLines> & { type: AddressType }) {
		return getAddressLineParts(address).join(', ')
	}

	/** Check if current item is a shipping address */
	function isShipping(type: AddressType) {
		return type === 'shipping'
	}

	/** Safely expose shipping phone number only for shipping items */
	function shippingPhoneNumber(address: AddressItem | AddressFormMap[AddressType]) {
		if (!isShipping(address.type)) return

		if ('phone_number' in address && address.phone_number) return address.phone_number
	}

	/** Safely expose shipping phone number only for shipping items */
	function getAddressLine1(address: AddressItem | AddressFormMap[AddressType]) {
		if (!isShipping(address.type)) return

		if ('address_line_1' in address && address.address_line_1) return address.address_line_1
	}

	/** Safely expose shipping phone number only for shipping items */
	function getAddressLine2(address: AddressItem | AddressFormMap[AddressType]) {
		if (!isShipping(address.type)) return

		if ('address_line_2' in address && address.address_line_2) return address.address_line_2
	}

	/** Map api response errors */
	function mapApiFieldErrors(data: unknown): Record<string, string> {
		const next_errors: Record<string, string> = {}
		if (!data || typeof data !== 'object') return next_errors

		Object.entries(data as Record<string, unknown>).forEach(([field_key, messages]) => {
			if (Array.isArray(messages) && messages.length > 0) {
				next_errors[field_key] = String(messages[0])
			}
		})

		return next_errors
	}

	return {
		hasAddressLines,
		hasPhoneNumber,
		onPhoneBeforeInput,
		onPhonePaste,
		getAddressListByType,
		getAddressLineParts,
		buildAddressLines,
		shippingPhoneNumber,
		mapApiFieldErrors,
		getAddressLine1,
		getAddressLine2,
	}
}