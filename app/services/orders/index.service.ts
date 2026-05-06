import type { OrderCompleteDataResponse } from "~/types/order"

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