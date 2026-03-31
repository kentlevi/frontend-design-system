import { useCheckoutCompletion } from "~/composables/checkout/completion/useCheckoutCompletion"

export const useTossPayment = () => {
    
    const { 
        completeCheckout
    } = useCheckoutCompletion({redirectPath: 'checkout/confirmation'})

    let popup: Window | null = null

    // =========================
    // POPUP HANDLING
    // =========================
    const openPaymentPopup = (url: string) => {

        popup = window.open(
            '',
            '_blank',
            'width=800,height=1000,toolbar=no,menubar=no,location=no,status=no'
        )

        if (!popup) {
            throw new Error('Popup blocked')
        }

        popup.location.href = url
    }

    const closePaymentPopup = () => {
        popup?.close()
        popup = null
    }


    // =========================
    // LISTENER HANDLING
    // =========================
    const listenPaymentResult = () => {

        const handler = (event: MessageEvent) => {

            const data = event.data

            if (data?.type === 'TOSS_PAYMENT_SUCCESS') {
                console.log('Payment Success:', data.data)
                closePaymentPopup()
                completeCheckout(true,data.data);
            }

            if (data?.type === 'TOSS_PAYMENT_FAIL') {
                console.log('Payment Failed:', data.data)
                closePaymentPopup()
            }
        }

        window.addEventListener('message', handler)

        return () => window.removeEventListener('message', handler)
    }


    return {
        openPaymentPopup,
        closePaymentPopup,
        listenPaymentResult,
        popup: () => popup
    }
}