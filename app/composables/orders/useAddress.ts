import type { OrderAddressItem, OrderAddressType } from '~/types/order/order-address'
import { useOrderDetailContext } from '~/composables/orders/context/useOrderDetailContext'

type Props = {
	type: OrderAddressType
}

export function useAddress(props: Props) {

	/**
	 * Context
	 */
	const { order_addresses } = useOrderDetailContext()


	/**
	 * Computed
	 */
	const address = computed(() =>
		order_addresses.value.find(a => a.type === props.type) ?? null
	)


	/**
	 * Functions
	 */
	function getDynamicFieldValues(addr: OrderAddressItem | null) {
		const lines: string[] = []

		if (addr?.type === 'shipping' || addr?.type === 'billing') {
			addr.dynamic_fields.forEach(field => {
				if (field?.value) lines.push(field.value)
			})
		}

		return lines.join(', ')
	}

	function getAddressLines(addr: OrderAddressItem | null) {
		if (addr?.type !== 'shipping' && addr?.type !== 'billing') return ''

		return addr.address_line_2
			? `${addr.address_line_1}, ${addr.address_line_2}`
			: addr.address_line_1
	}

	function getPostCode(addr: OrderAddressItem | null) {
		if (addr?.type === 'shipping' || addr?.type === 'billing') return addr.postcode
	}

	function getPhoneNumber(addr: OrderAddressItem | null) {
		if (addr?.type === 'shipping') return addr.phone_number
	}


	const formatted_address = computed(() => {
		const addr = address.value
		return [
			getDynamicFieldValues(addr),
			getAddressLines(addr),
			getPostCode(addr),
		].filter(Boolean).join(', ')
	})


	return {
		address,
		formatted_address,

		getPhoneNumber,
	}
}