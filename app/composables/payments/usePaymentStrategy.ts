import { useTossPayment } from "~/composables/payments/toss-pay/useTossPayment"
import type { 
    PaymentCode, 
    PaymentAction
} from "~/types/payments/payment"

type PaymentHandler = (payload?: any) => void

export const usePaymentStrategy = () => {
    const toss = useTossPayment()

    const handlers: Record<PaymentCode, Record<PaymentAction, PaymentHandler>> = {
        TOSS: {
            process: (payload?: any) => {
                const url = payload?.payment_information?.redirect_url
                toss.openPaymentPopup(url)
            },
            error: () => {
                toss.closePaymentPopup()
            }
        },

        BANK_TRANSFER: {
            process: (payload?: any) => {
                console.warn("BANK_TRANSFER success not implemented", payload)
            },
            error: (payload?: any) => {
                console.warn("BANK_TRANSFER error not implemented", payload)
            }
        },

        CREDIT_CARD: {
            process: (payload?: any) => {
                console.warn("CREDIT_CARD success not implemented", payload)
            },
            error: (payload?: any) => {
                console.warn("CREDIT_CARD error not implemented", payload)
            }
        }
    }

    const execute = (code: PaymentCode, action: PaymentAction, payload?: any) => {
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