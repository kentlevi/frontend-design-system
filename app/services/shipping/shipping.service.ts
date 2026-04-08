import type { ShippingMethodResponse } from "~/types/shipping/shipping"

export const getShippingMethodByCartItems = async (params: { cart_item_ids: number[] }): Promise<ShippingMethodResponse> => {
	const { $api } = useNuxtApp()
	const query = new URLSearchParams()

	params.cart_item_ids.forEach((cart_item_id) => {
		query.append('cart_item_ids[]', String(cart_item_id))
	})

	return $api.get(`/shipping/shipping-methods?${query.toString()}`)
}