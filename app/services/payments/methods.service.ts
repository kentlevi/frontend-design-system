import type { 
    AvailablePaymentMethodsResponse, 
} from "~/types/payments/payment";

export const fetchAvailablePaymentMethods = async () : Promise<AvailablePaymentMethodsResponse> => {
	const { $api } = useNuxtApp()
	return await $api.get(`payments/methods/available`)
}