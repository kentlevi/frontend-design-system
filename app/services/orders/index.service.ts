import type { OrderCompleteDataResponse } from "~/types/order"

export const fetchOrderCompletionDetails = async (order_id : number) : Promise<OrderCompleteDataResponse> => {
	const { $api } = useNuxtApp()
	return await $api.get(`orders/completion/details/${order_id}`)
}