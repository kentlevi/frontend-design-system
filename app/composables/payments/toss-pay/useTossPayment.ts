import { useCheckoutCompletion } from "~/composables/checkout/completion/useCheckoutCompletion"
import { useMainCheckOutStore } from "~/stores/checkout/index.store"
import {
	PAYMENT_LOCK_KEY,
	clearPaymentLock,
	readPaymentLock,
} from "~/utils/checkout/paymentLock"

const PAYMENT_TAB_NAME = 'mu_payment_tab'

export const useTossPayment = () => {

	const {
		completeCheckout
	} = useCheckoutCompletion({redirectPath: 'checkout/confirmation'})
	const checkout_store = useMainCheckOutStore()

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
					checkout_store.setProcessing(false)
					checkout_store.setPaymentWindowOpen(false)
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
	// NEW TAB HANDLING
	// =========================
	const openPaymentPopup = (url: string | null) => {

		checkout_store.setPaymentWindowOpen(true)

		if (url === null) {
			throw new Error('No URL provided')
		}

		popup = window.open(url, PAYMENT_TAB_NAME)

		if (!popup) {
			throw new Error('Popup blocked')
		}

		checkout_store.setProcessing(true)

		// start watching tab
		startPopupWatcher()
	}

	const closePaymentPopup = () => {

		is_manual_close = true // prevent manual trigger

		stopPopupWatcher()

		checkout_store.setProcessing(false)
		checkout_store.setPaymentWindowOpen(false)
		clearPaymentLock()
		popup?.close()
		popup = null
	}

	//check for payment tabs open
	const cancelInFlightPayment = () => {
		try {
			const orphan = window.open('', PAYMENT_TAB_NAME)
			orphan?.close()
		} catch {
			/* cross-origin or blocker — best-effort */
		}
		checkout_store.setProcessing(false)
		checkout_store.setPaymentWindowOpen(false)
		clearPaymentLock()
	}

	// =========================
	// LISTENER HANDLING
	// =========================
	const listenPaymentResult = () => {

		// Reload during payment = cancel. Close the orphan tab and clear
		// state so the user can edit / resubmit.
		if (readPaymentLock()) {
			cancelInFlightPayment()
		}

		const storage_handler = (event: StorageEvent) => {
			if (event.key !== PAYMENT_LOCK_KEY) return
			if (event.newValue === null) {
				checkout_store.setProcessing(false)
				checkout_store.setPaymentWindowOpen(false)
			}
		}

		const message_handler = async (event: MessageEvent) => {

			const data = event.data

			if (
				data?.type === 'TOSS_PAYMENT_SUCCESS' ||
  				data?.type === 'TOSS_PAYMENT_CONFIRMED'
			) {
				const order_id = data?.data?.id
				try {
					closePaymentPopup()
					checkout_store.cleanCheckoutStates()
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

		window.addEventListener('message', message_handler)
		window.addEventListener('storage', storage_handler)

		return () => {
			window.removeEventListener('message', message_handler)
			window.removeEventListener('storage', storage_handler)
		}
	}

	return {
		openPaymentPopup,
		closePaymentPopup,
		listenPaymentResult,
		popup: () => popup
	}
}