import { useTossPayment } from "~/composables/payments/toss-pay/useTossPayment"
import type {
	PaymentAction,
	PaymentCode
} from "~/types/payments/payment"

type PaymentPayload = {
	payment_information?: {
		redirect_url?: string
	}
}

type PaymentHandler = (payload?: unknown) => void

function getRedirectUrl(payload: unknown) {
	if (!payload || typeof payload !== "object") return undefined

	const payment_information = (payload as PaymentPayload).payment_information
	if (!payment_information || typeof payment_information !== "object") return undefined

	return typeof payment_information.redirect_url === "string"
		? payment_information.redirect_url
		: undefined
}

export const usePaymentStrategy = () => {
	const toss = useTossPayment()

	const handlers: Record<PaymentCode, Record<PaymentAction, PaymentHandler>> = {
		TOSS: {
			process: (payload?: unknown) => {
				const url = getRedirectUrl(payload)
				toss.openPaymentPopup(url)
			},
			error: () => {
				toss.closePaymentPopup()
			}
		},

		BANK_TRANSFER: {
			process: (payload?: unknown) => {
				console.warn("BANK_TRANSFER success not implemented", payload)
			},
			error: (payload?: unknown) => {
				console.warn("BANK_TRANSFER error not implemented", payload)
			}
		},

		CREDIT_CARD: {
			process: (payload?: unknown) => {
				console.warn("CREDIT_CARD success not implemented", payload)
			},
			error: (payload?: unknown) => {
				console.warn("CREDIT_CARD error not implemented", payload)
			}
		}
	}

	const execute = (code: PaymentCode, action: PaymentAction, payload?: unknown) => {
		const handler = handlers[code]?.[action]

		if (!handler) {
			throw new Error(`No handler for ${code} - ${action}`)
		}

		return handler(payload)
	}

	return {
		execute
	}
}