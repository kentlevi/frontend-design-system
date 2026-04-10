import { fetchAvailablePaymentMethods } from "~/services/payments/methods.service"
import { useMainCheckOutStore } from "~/stores/checkout/index.store"
import type { AvailablePaymentMethods } from "~/types/payments/payment"

export const usePaymentMethod = () => {
	const checkout_store = useMainCheckOutStore();
	const available_payment_methods = ref<AvailablePaymentMethods[]>([])

	const getAvailablePaymentMethod = async () => {
		try {
			const response = await fetchAvailablePaymentMethods()
			available_payment_methods.value = response?.data ?? []
			checkout_store.setPaymentMethod(available_payment_methods.value[0] ?? null)
			return response
		} catch (error) {
			console.error(error)
		}
	}
	return{
		available_payment_methods,
		getAvailablePaymentMethod
	}
}