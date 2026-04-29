import { useCheckoutCompletion } from "~/composables/checkout/completion/useCheckoutCompletion"
import { completeCheckoutRequest } from "~/services/checkout/checkout.service"
import { useMainCheckOutStore } from "~/stores/checkout/index.store"
import { useAddressGeneral } from "~/composables/checkout/address/useAddressGeneral"
import { useCartStore } from "~/stores/core/cart/cart.store"

export const useTossPayment = () => {

	const {
		completeCheckout
	} = useCheckoutCompletion({redirectPath: 'checkout/confirmation'})
	const checkout_store = useMainCheckOutStore()
	const {
		selected_real_ids
	} = storeToRefs(useCartStore())

	/** Contexts */
	const { buildCompleteCheckoutPayload } = useAddressGeneral()

	let popup: Window | null = null
	let popupChecker: number | null = null
	let is_manual_close = false

	// =========================
	// POPUP WATCHER
	// =========================
	const startPopupWatcher = () => {

		if (popupChecker) return

		popupChecker = window.setInterval(() => {

			if (!popup || popup.closed) {

				stopPopupWatcher()

				// ONLY if user manually closed
				if (!is_manual_close) {
					console.log('Popup manually closed')
					checkout_store.setCheckoutReady(false)
				}

				popup = null
				is_manual_close = false
			}

		}, 500)
	}

	const stopPopupWatcher = () => {
		if (popupChecker) {
			clearInterval(popupChecker)
			popupChecker = null
		}
	}

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

		popup = window.open(
			'',
			'_blank',
			`width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no`
		)

		if (!popup) {
			throw new Error('Popup blocked')
		}

		checkout_store.setCheckoutReady(true)

		popup.location.href = url

		// start watching popup
		startPopupWatcher()
	}

	const closePaymentPopup = () => {

		is_manual_close = true // prevent manual trigger

		stopPopupWatcher()

		checkout_store.setCheckoutReady(false)
		popup?.close()
		popup = null
	}

	// =========================
	// LISTENER HANDLING
	// =========================
	const listenPaymentResult = () => {

		const handler = async (event: MessageEvent) => {

			const data = event.data

			if (
				data?.type === 'TOSS_PAYMENT_SUCCESS' ||
  				data?.type === 'TOSS_PAYMENT_CONFIRMED'
			) {
				const order_id = data?.data?.id
				try {
					closePaymentPopup()
					const payload = {
						...buildCompleteCheckoutPayload(order_id),
						selected_cart_ids : selected_real_ids.value
					}
					await completeCheckoutRequest(payload)
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