import { useTossPayment } from "~/composables/payments/toss-pay/useTossPayment"
import type {
	PaymentCode,
	PaymentAction,
	PaymentHandlerMap,
	PaymentPayloadByAction
} from "~/types/payments/payment"
import type { CheckoutResponseData } from "~/types/checkout"

export const usePaymentStrategy = () => {
	const toss = useTossPayment()

	const handlers: Record<PaymentCode, PaymentHandlerMap> = {
		/**Toss Pay */
		TP: {
			process: (payload?: CheckoutResponseData) => {
				const url = payload?.payment_information?.redirect_url || null
				toss.openPaymentPopup(url)
			},
			error: () => {
				toss.closePaymentPopup()
			}
		},
		/**Bank Transfer */
		BT: {
			process: (payload?: CheckoutResponseData) => {
				console.log("BANK_TRANSFER success not implemented", payload)
			},
			error: (error?: Error) => {
				console.warn("BANK_TRANSFER error not implemented", error)
			}
		},
		/**Credit Card */
		CC: {
			process: (payload?: CheckoutResponseData) => {
				console.log("CREDIT_CARD success not implemented", payload)
			},
			error: (error?: Error) => {
				console.warn("CREDIT_CARD error not implemented", error)
			}
		}
	}

	const execute = <K extends PaymentAction>(
		code: PaymentCode,
		action: K,
		payload?: PaymentPayloadByAction[K]
	) => {
		const handler = handlers[code]?.[action]

		if (!handler) {
			throw new Error(`No handler for ${code} - ${action}`)
		}

		return handler(payload)
	}


	return {
		execute,
	}
}