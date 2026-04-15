import { useCheckoutCompletion } from "~/composables/checkout/completion/useCheckoutCompletion"
import { completeCheckoutRequest } from "~/services/checkout/checkout.service"
import { useMainCheckOutStore } from "~/stores/checkout/index.store"
import { useAddressFormCheckoutContext } from "~/composables/checkout/address/context/addressFormCheckoutContext"

export const useTossPayment = () => {

	const {
		completeCheckout
	} = useCheckoutCompletion({redirectPath: 'checkout/confirmation'})
	const checkout_store = useMainCheckOutStore()

	const { form_state } = useAddressFormCheckoutContext()
	const shipping_form = computed(() => form_state.shipping)
	const billing_form = computed(() => form_state.billing)

	let popup: Window | null = null

	// =========================
	// POPUP HANDLING
	// =========================
	const openPaymentPopup = (url: string | null) => {

		if (url === null) {
			throw new Error('No URL provided')
		}

		const width = 800
		const height = 1000

		const dual_screen_left = window.screenLeft ?? window.screenX
		const dual_screen_top = window.screenTop ?? window.screenY

		const screen_width = window.innerWidth ?? document.documentElement.clientWidth
		const screen_height = window.innerHeight ?? document.documentElement.clientHeight

		const left = dual_screen_left + (screen_width - width) / 2
		const top = dual_screen_top + (screen_height - height) / 2

		const popup = window.open(
			'',
			'_blank',
			`width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
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

		const handler = async (event: MessageEvent) => {

			const data = event.data

			if (data?.type === 'TOSS_PAYMENT_SUCCESS') {

				const order_id = data?.data?.id
				try {
					closePaymentPopup()

					await completeCheckoutRequest({
						order_id: order_id,
						shipping_address: shipping_form.value,
						billing_address: billing_form.value
					})
					checkout_store.cleanCheckoutStatesOnSuccess()
					completeCheckout(true, order_id)
				} catch (error) {
					console.error('Checkout completion failed:', error)
				}
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