import { checkoutRequest } from "~/services/checkout/checkout.service"
import { usePaymentStrategy } from "~/composables/payments/usePaymentStrategy"
import type {CheckoutResponse} from "~/types/checkout/index"

export const useCheckoutFlow = () => {

    const payment = usePaymentStrategy()

    const submitCheckout = async () => {
        try {
            const request  = await checkoutRequest() as { data: CheckoutResponse }

            payment.execute("TOSS", "process", request.data)

        } catch (error) {
            console.error(error)
            payment.execute("TOSS", "error", error)
        }
    }

    return {
        submitCheckout
    }
}