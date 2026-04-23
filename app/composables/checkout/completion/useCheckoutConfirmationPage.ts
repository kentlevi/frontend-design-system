import { fetchOrderCompletionDetails } from "~/services/orders/index.service"
import type { OrderCompleteData } from "~/types/order"


export const useCheckoutConfirmationPage = () => {
	const order_confirm_details = ref<OrderCompleteData | null>(null)

	const getOrderCompletionDetails = async (order_id : number) => {
		try {
			const res = await fetchOrderCompletionDetails(order_id)
			order_confirm_details.value = res.data ?? null
		}catch(error){
			console.warn(error)
		}
	}

	return {
		order_confirm_details,
		getOrderCompletionDetails,
	}
}