import type {
    AuthenticatedShippingMethodRequest,
    LocalShippingMethodRequest,
    ShippingMethodResponse
} from "~/types/shipping/shipping"

export const getShippingMethodByCartItems = async (params: AuthenticatedShippingMethodRequest): Promise<ShippingMethodResponse> => {
    const { $api } = useNuxtApp()
    const query = new URLSearchParams()

    params.cart_item_ids.forEach((cart_item_id) => {
        query.append('cart_item_ids[]', String(cart_item_id))
    })

    if (params.zip_code) {
        query.append('zip_code', params.zip_code)
    }

    return $api.get(`/shipping/shipping-methods?${query.toString()}`)
}

export const getShippingMethodByLocalItems = async (params: LocalShippingMethodRequest): Promise<ShippingMethodResponse> => {
    const { $api } = useNuxtApp()

    return $api.post('/shipping/shipping-methods-local', { ...params })
}