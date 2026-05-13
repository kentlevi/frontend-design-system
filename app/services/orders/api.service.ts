import type { CreateQuotationPayload, OrderQuotationDetailsResponse } from "~/types/checkout/quotation"
import type { OrderCompleteDataResponse } from "~/types/order"
import type { UserOrderType, UserOrdersResponse } from "~/types/order/user-orders"

export const fetchOrderCompletionDetails = async (order_id : number) : Promise<OrderCompleteDataResponse> => {
	const { $api } = useNuxtApp()
	return await $api.get(`orders/completion/details/${order_id}`)
}

export const sendOrderConfirmationEmail = async (order_id : number) : Promise<void> => {
	const { $api } = useNuxtApp()
	await $api.post(`orders/checkout/complete/send/${order_id}`)
}

export const sendArtworkReminder = async (order_id : number) : Promise<void> => {
	const { $api } = useNuxtApp()
	await $api.post(`orders/checkout/complete/send/artwork/${order_id}`)
}

export const createOrderQuotation = async (params : CreateQuotationPayload) : Promise<OrderQuotationDetailsResponse> => {
	const { $api } = useNuxtApp()
	return await $api.post(`orders/quotation/create`, params)
}

export const fetchOrderQuotaionDetails = async (order_quotaiton_detail_id : number) : Promise<OrderQuotationDetailsResponse> => {
	const { $api } = useNuxtApp()
	return await $api.get(`orders/quotation/${order_quotaiton_detail_id}`)
}


/** Orders */

/**
 * Fetch orders of user
 */
export async function fetchUserOrders(type: UserOrderType): Promise<UserOrdersResponse> {
	const { $api } = useNuxtApp()

	return $api.get(`/orders/${type}`)
}