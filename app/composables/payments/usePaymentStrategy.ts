import { useTossPayment } from "~/composables/payments/toss-pay/useTossPayment"
import type {
	PaymentCode,
	PaymentAction,
	PaymentHandlerMap,
	PaymentPayloadByAction
} from "~/types/payments/payment"
import type { CheckoutResponseData } from "~/types/checkout"
import { useBankTransfer } from "./bank-transfer/useBankTransfer"

export const usePaymentStrategy = () => {
	const toss = useTossPayment()
	const bank_transfer = useBankTransfer()

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
		/**Bank Transfer using Toss Integration */
		BT_TOSS: {
			process: (payload?: CheckoutResponseData) => {
				const url = payload?.payment_information?.redirect_url || null
				toss.openPaymentPopup(url)
			},
			error: () => {
				toss.closePaymentPopup()
			}
		},
		/**Bank Transfer using Toss Integration */
		CC_TOSS: {
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
				const order_id = payload?.order?.id ?? null
				if(!order_id) {
					throw new Error('No order_id found')
				}
				bank_transfer.processBankTransfer(order_id);
			},
			error: (error?: Error) => {
				bank_transfer.processBankTransferError(error);
			}
		},
		/**Credit Card */
		CC: {
			process: (payload?: CheckoutResponseData) => {
				console.log("CREDIT_CARD success not implemented", payload)
			},
			error: (error?: Error) => {
				alert("CREDIT CARD PAYMENT NOT IMPLEMENTED YET")
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