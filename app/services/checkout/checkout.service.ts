import type {
	InitialCheckoutPayload,
	CheckoutApiResponse,
	completeCheckoutPayload
} from "~/types/checkout"

export const checkoutRequest = async (params : InitialCheckoutPayload) :Promise<CheckoutApiResponse>=> {
	const { $api } = useNuxtApp()
	return await $api.post(`orders/checkout`, params)
}

export const completeCheckoutRequest = async (params : completeCheckoutPayload) => {
	const { $api } = useNuxtApp()
	return await $api.post(`orders/checkout/complete`, params)
}