import type { InitialCheckoutPayload, CheckoutApiResponse } from "~/types/checkout"

export const checkoutRequest = async (params : InitialCheckoutPayload) :Promise<CheckoutApiResponse>=> {
	const { $api } = useNuxtApp()
	return await $api.post(`orders/checkout`, params)
}