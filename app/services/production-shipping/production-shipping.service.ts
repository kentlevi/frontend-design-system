import { getShippingMethodByCartItems, getShippingMethodByLocalItems } from '~/services/production-shipping/api.service'
import { useProductionShippingStore } from '~/stores/production-shipping/production-shipping.store'
import type { CartItem } from '~/types/cart/cart'
import type { FetchShippingMethodsPayload } from '~/types/production-shipping/production-shipping'
import type { ShippingMethodResponse, LocalShippingMethodItemPayload } from '~/types/shipping/shipping'

export async function fetchShippingMethodsService(
	payload: FetchShippingMethodsPayload,
): Promise<void> {
	const production_shipping_store = useProductionShippingStore()

	production_shipping_store.setIsLoading(true)
	production_shipping_store.setErrorMessage('')

	try {
		if (payload.selected_cart_items.length === 0) {
			production_shipping_store.clearAvailableShippingMethods()
			production_shipping_store.setIsLoaded(false)
			return
		}

		let response: ShippingMethodResponse

		if (payload.is_authenticated) {
			response = await getShippingMethodByCartItems({
				cart_item_ids: payload.selected_cart_items
					.map(item => item.id)
					.filter((id): id is number => id !== null),
				zip_code: payload.postcode,
				fields: payload.fields
			})
		} else {
			response = await getShippingMethodByLocalItems({
				items: buildLocalShippingItems(payload.selected_cart_items),
				zip_code: payload.postcode,
				fields: payload.fields
			})
		}

		const methods = Array.isArray(response.data) ? response.data : []

		production_shipping_store.setAvailableShippingMethods(methods)
		production_shipping_store.setIsLoaded(true)
	} catch (error) {
		production_shipping_store.clearAvailableShippingMethods()
		production_shipping_store.setIsLoaded(false)
		production_shipping_store.setErrorMessage('Failed to load shipping methods.')

		console.error('fetchShippingMethodsService error:', error)
	} finally {
		production_shipping_store.setIsLoading(false)
	}
}

/* @desc build payload for guest/local shipping API
@param CartItem[] items
@return LocalShippingMethodItemPayload[]
*/
function buildLocalShippingItems(items: CartItem[]): LocalShippingMethodItemPayload[] {
	return items.map(item => ({
		product_config_mapping_id: item.product_config_mapping_id,
		quantity: item.quantity,
		color_id: item.color_id,
		font_id: item.font_id,
		cost: item.cost
	}))
}