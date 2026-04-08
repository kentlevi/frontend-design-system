import { useAddressStore } from "~/stores/address"
import type { AddressItem, AddressType } from "~/types/address"

export function useAddressHelper() {
	const address_store = useAddressStore()

	function getAddressListByType(type: AddressType) {
		if (type === 'shipping') return address_store.shipping_address
		if (type === 'billing') return address_store.billing_address
		return address_store.drop_address
	}

	function getAddressLineParts(address: AddressItem) {
		const lines: string[] = []

		if ('address_line_1' in address && address.address_line_1) lines.push(address.address_line_1)
		if ('address_line_2' in address && address.address_line_2) lines.push(address.address_line_2)

		if ('dynamic_fields' in address && Array.isArray(address.dynamic_fields)) {
			address.dynamic_fields.forEach((field) => {
				if (field?.value) lines.push(field.value)
			})
		}

		if ('postcode' in address && address.postcode) lines.push(address.postcode)

		lines.push(address.country.name)

		return lines
	}

	function buildAddressLines(address: AddressItem) {
		return getAddressLineParts(address).join(', ')
	}

	/** Check if current item is a shipping address */
	function isShipping(type: AddressType) {
		return type === 'shipping'
	}

	/** Safely expose shipping phone number only for shipping items */
	function shippingPhoneNumber(address: AddressItem) {
		if (!isShipping(address.type)) return

		if ('phone_number' in address && address.phone_number) return address.phone_number
	}

	/** Safely expose shipping phone number only for shipping items */
	function getAddressLine1(address: AddressItem) {
		if (!isShipping(address.type)) return

		if ('address_line_1' in address && address.address_line_1) return address.address_line_1
	}

	/** Safely expose shipping phone number only for shipping items */
	function getAddressLine2(address: AddressItem) {
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
		getAddressListByType,
		getAddressLineParts,
		buildAddressLines,
		shippingPhoneNumber,
		mapApiFieldErrors,
		getAddressLine1,
		getAddressLine2,
	}
}