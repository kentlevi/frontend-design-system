import type { InitialCheckoutPayload } from "~/types/checkout"

export const checkoutRequest = async (params : InitialCheckoutPayload) => {
	const { $api } = useNuxtApp()
	return await $api.post(`orders/checkout`, params)
}