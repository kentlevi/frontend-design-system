import { useTossPayment } from "~/composables/payments/toss-pay/useTossPayment"
import type {
	PaymentCode,
	PaymentAction,
	AvailablePaymentMethods,
	AvailablePaymentMethodsResponse,
	PaymentHandlerMap,
	PaymentPayloadByAction
} from "~/types/payments/payment"
import { fetchAvailablePaymentMethods } from "~/services/payments/methods.service"
import type { CheckoutResponseData } from "~/types/checkout"

export const usePaymentStrategy = () => {
	const toss = useTossPayment()
	const available_payment_methods = useState<AvailablePaymentMethods[]>('available_payment_methods',()=>[])

	const handlers: Record<PaymentCode, PaymentHandlerMap> = {
		TOSS: {
			process: (payload?: CheckoutResponseData) => {
				const url = payload?.payment_information?.redirect_url || null
				toss.openPaymentPopup(url)
			},
			error: () => {
				toss.closePaymentPopup()
			}
		},

		BANK_TRANSFER: {
			process: (payload?: CheckoutResponseData) => {
				console.log("BANK_TRANSFER success not implemented", payload)
			},
			error: (error?: Error) => {
				console.warn("BANK_TRANSFER error not implemented", error)
			}
		},

		CREDIT_CARD: {
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

	const getAvailablePaymentMethods = async () => {
		try {
			const response: AvailablePaymentMethodsResponse = await fetchAvailablePaymentMethods();
			available_payment_methods.value = response?.data ?? [];
		} catch (error) {
			console.error(error)
		}
	}

	return {
		available_payment_methods,
		execute,
		getAvailablePaymentMethods
	}
}