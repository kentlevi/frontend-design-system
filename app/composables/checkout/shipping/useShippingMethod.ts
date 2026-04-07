import { getShippingMethodByCartItems } from '~/services/shipping/shipping.service'
import type { ShippingMethodData, ShippingMethodItem } from '~/types/shipping/shipping'
import { formatShippingDateRange } from '~/utils/shipping/dateRange'
import { computed, ref } from 'vue'

const selected_shipping_method = ref('')
const shipping_method_id = ref<number | null>(null)
const production_shipping_id = ref<number | null>(null)
const is_loading = ref(false)
const shipping_method_data = ref<ShippingMethodData[]>([])
let latest_request_id = 0

export function useShippingMethod() {
	const active_shipping_methods = computed<ShippingMethodItem[]>(() =>
		mapShippingMethodDataToUi(shipping_method_data.value)
	)

	/* @desc fetch shipping methods, prevent stale response overwrite, and sync selection
    @param object params - request payload containing cart_ids and quantity
    @return Promise<void> - no return value
    */
	const fetchShippingMethods = async (params: { cart_item_ids: number[] }): Promise<void> => {
		const request_id = ++latest_request_id
		is_loading.value = true

		try {
			const shipping_method_response = await getShippingMethodByCartItems(params)

			if (request_id !== latest_request_id) return

			shipping_method_data.value = Array.isArray(shipping_method_response.data)
				? shipping_method_response.data
				: []

			syncSelectionWithActiveMethods()
		} catch (error) {
			if (request_id !== latest_request_id) return

			shipping_method_data.value = []
			clearSelectedShippingMethod()
			console.error('Error loading shipping methods:', error)
		} finally {
			if (request_id === latest_request_id) {
				is_loading.value = false
			}
		}
	}

	/* @desc map API response into a UI-friendly shipping method structure
    @param ShippingMethodData[] shipping_method_data - raw shipping method response list
    @return ShippingMethodItem[] - mapped shipping methods
    */
	const mapShippingMethodDataToUi = (
		shipping_method_data: ShippingMethodData[]
	): ShippingMethodItem[] => {
		return shipping_method_data.map((item) => {
			const formatted_date_range = formatShippingDateRange(
				item.min_delivery_date,
				item.max_delivery_date,
			)

			return {
				key: item.shipping_method_code,
				name: item.shipping_method_name,
				date: formatted_date_range,
				longer_date_message: `Estimated Delivery Date: ${formatted_date_range}`,
				price: `$${item.shipping_price}`,
				icon: `/icons/custom/checkout/${item.shipping_method_code}-shipping.svg`,
				shipping_method_id: item.shipping_method_id,
				production_shipping_id: item.production_shipping_id,
				cart_item_ids: item.cart_item_ids,
				description: item.description,
			}
		})
	}

	/* @desc select a shipping method by its key and sync its production_shipping_id
    @param string key - shipping method code
    @return void
    */
	const selectShippingMethod = (key: string): void => {
		const selected_method = active_shipping_methods.value.find((method) => method.key === key)

		if (!selected_method) return

		setSelectedShippingMethod({
			key: selected_method.key,
			shipping_method_id: selected_method.shipping_method_id,
			production_shipping_id: selected_method.production_shipping_id,
		})
	}

	/* @desc keep selected method valid after refresh or default to first available method
    @return void
    */
	const syncSelectionWithActiveMethods = (): void => {
		const matched_selected_method = active_shipping_methods.value.find(
			(method) => method.key === selected_shipping_method.value
		)

		if (matched_selected_method) {
			setSelectedShippingMethod({
				key: matched_selected_method.key,
				shipping_method_id: matched_selected_method.shipping_method_id,
				production_shipping_id: matched_selected_method.production_shipping_id,
			})
			return
		}

		const default_method = active_shipping_methods.value[0]

		if (!default_method) {
			clearSelectedShippingMethod()
			return
		}

		setSelectedShippingMethod({
			key: default_method.key,
			shipping_method_id: default_method.shipping_method_id,
			production_shipping_id: default_method.production_shipping_id,
		})
	}

	/* @desc set the current selected shipping method and its shipping ids
    @param object|null selection - selected method payload or null to clear
    @return void
    */
	const setSelectedShippingMethod = (
		selection: {
			key: string;
			shipping_method_id: number;
			production_shipping_id: number;
		} | null
	): void => {
		if (!selection) {
			selected_shipping_method.value = ''
			shipping_method_id.value = null
			production_shipping_id.value = null
			return
		}

		selected_shipping_method.value = selection.key
		shipping_method_id.value = selection.shipping_method_id
		production_shipping_id.value = selection.production_shipping_id
	}

	/* @desc clear the selected shipping method state
    @return void
    */
	const clearSelectedShippingMethod = (): void => {
		selected_shipping_method.value = ''
		shipping_method_id.value = null
		production_shipping_id.value = null
	}

	return {
		is_loading,

		production_shipping_id,
        shipping_method_id,
		selected_shipping_method,
        
		active_shipping_methods,

		setSelectedShippingMethod,
		clearSelectedShippingMethod,
		fetchShippingMethods,
		selectShippingMethod,
	}
}
