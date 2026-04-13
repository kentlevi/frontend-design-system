import {
	getShippingMethodByLocalItems
} from '~/services/shipping/shipping.service'
import { useCartStore } from '~/stores/cart'
import { useProductionShippingStore } from '~/stores/production-shipping/production-shipping.store'
import type { CartItem } from '~/types/cart/cart'
import type { AvailableShippingMethod } from '~/types/production-shipping/production-shipping'
import type {
	LocalShippingMethodItemPayload,
	ShippingMethodItem
} from '~/types/shipping/shipping'
import { formatShippingDateRange } from '~/utils/shipping/dateRange'
import { useMainCheckOutStore } from "~/stores/checkout/index.store";

const selected_shipping_method = ref('')
const shipping_method_id = ref<number | null>(null)
const production_shipping_id = ref<number | null>(null)

export function useShippingMethod() {

	const checkout_store = useMainCheckOutStore()
	const cart_store = useCartStore()
	const production_shipping_store = useProductionShippingStore()

	const { selected_ids } = storeToRefs(cart_store)
	const { available_shipping_methods, is_loading } = storeToRefs(production_shipping_store)

	const selected_cart_items = computed(() =>
		cart_store.items.filter((item) => {
			const item_id = item.id !== null
				? String(item.id)
				: (item.local_identity || '')

			return selected_ids.value.includes(item_id)
		})
	)

	const active_shipping_methods = computed<ShippingMethodItem[]>(() =>
		mapShippingMethodDataToUi(available_shipping_methods.value)
	)

	const fetchShippingMethods = async (): Promise<void> => {
		production_shipping_store.setIsLoading(true)
		production_shipping_store.setErrorMessage('')

		try {
			if (selected_cart_items.value.length === 0) {
				production_shipping_store.clearAvailableShippingMethods()
				production_shipping_store.setIsLoaded(false)
				clearSelectedShippingMethod()
				return
			}

			const shipping_method_response = await getShippingMethodByLocalItems({
				items: buildLocalShippingItems(selected_cart_items.value),
			})

			const methods = Array.isArray(shipping_method_response.data)
				? shipping_method_response.data
				: []
			production_shipping_store.setAvailableShippingMethods(methods)
			production_shipping_store.setIsLoaded(true)

			syncSelectionWithActiveMethods()
		} catch (error) {
			production_shipping_store.clearAvailableShippingMethods()
			production_shipping_store.setIsLoaded(false)
			production_shipping_store.setErrorMessage('Failed to load shipping methods.')
			clearSelectedShippingMethod()
			console.error('Error loading shipping methods:', error)
		} finally {
			production_shipping_store.setIsLoading(false)
		}
	}

	const buildLocalShippingItems = (items: CartItem[]): LocalShippingMethodItemPayload[] => {
		return items.map((item) => ({
				product_config_mapping_id: item.product_config_mapping_id,
				quantity: item.quantity,
				color_id: item.color_id,
				font_id: item.font_id,
			}))
	}

	/* @desc map stored shipping methods into a UI-friendly shipping method structure
	@param AvailableShippingMethod[] shipping_methods - raw shipping method response list
	@return ShippingMethodItem[] - mapped shipping methods
	*/
	const mapShippingMethodDataToUi = (
		shipping_methods: AvailableShippingMethod[]
	): ShippingMethodItem[] => {
		return shipping_methods.map((item) => {
			const formatted_date_range = formatShippingDateRange(
				item.min_delivery_date,
				item.max_delivery_date,
			)

			return {
				key: item.shipping_method_code,
				name: item.shipping_method_name,
				date: formatted_date_range,
				longer_date_message: `Estimated Delivery Date: ${formatted_date_range}`,
				price: item.shipping_price === 0
					? 'Free'
					: `$${item.shipping_price}`,
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
			checkout_store.setShippingMethodId(null)
			return
		}

		selected_shipping_method.value = selection.key
		shipping_method_id.value = selection.shipping_method_id
		production_shipping_id.value = selection.production_shipping_id
		checkout_store.setShippingMethodId(selection.shipping_method_id)
	}

	/* @desc clear the selected shipping method state
	@return void
	*/
	const clearSelectedShippingMethod = (): void => {
		selected_shipping_method.value = ''
		shipping_method_id.value = null
		production_shipping_id.value = null
		checkout_store.setShippingMethodId(null)
	}

	watch(
		() => [...selected_ids.value],
		() => {
			void fetchShippingMethods()
		},
		{ immediate: true }
	)

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