import { useTossPayment } from "~/composables/payments/toss-pay/useTossPayment"
import type {
	PaymentCode,
	PaymentAction
} from "~/types/payments/payment"
import type { CheckoutResponse } from "~/types/checkout"

type PaymentProcessPayload = CheckoutResponse | undefined
type PaymentErrorPayload = unknown
type PaymentPayloadByAction = {
	process?: PaymentProcessPayload;
	error?: PaymentErrorPayload;
}
type PaymentHandlerMap = {
	[K in PaymentAction]: (payload?: PaymentPayloadByAction[K]) => void;
}

export const usePaymentStrategy = () => {
	const toss = useTossPayment()

	const handlers: Record<PaymentCode, PaymentHandlerMap> = {
		TOSS: {
			process: (payload?: CheckoutResponse) => {
				const url = payload?.payment_information?.redirect_url
				toss.openPaymentPopup(url)
			},
			error: () => {
				toss.closePaymentPopup()
			}
		},

		BANK_TRANSFER: {
			process: (payload?: CheckoutResponse) => {
				console.warn("BANK_TRANSFER success not implemented", payload)
			},
			error: (payload?: unknown) => {
				console.warn("BANK_TRANSFER error not implemented", payload)
			}
		},

		CREDIT_CARD: {
			process: (payload?: CheckoutResponse) => {
				console.warn("CREDIT_CARD success not implemented", payload)
			},
			error: (payload?: unknown) => {
				console.warn("CREDIT_CARD error not implemented", payload)
			}
		}
	}

	function execute<TAction extends PaymentAction>(
		code: PaymentCode,
		action: TAction,
		payload?: PaymentPayloadByAction[TAction]
	) {
		const handler = handlers[code]?.[action] as
			| ((payload?: PaymentPayloadByAction[TAction]) => void)
			| undefined

		if (!handler) {
			throw new Error(`No handler for ${code} - ${action}`)
		}

		return handler(payload)
	}

	return {
		execute
	}
}