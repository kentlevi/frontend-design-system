export const PAYMENT_LOCK_KEY = 'mu_payment_in_flight'
const PAYMENT_LOCK_TTL_MS = 10 * 60 * 1000

export type PaymentLock = {
	order_id: number
	started_at: number
}

function safeGet(key: string): string | null {
	if (typeof window === 'undefined') return null
	try {
		return localStorage.getItem(key)
	} catch {
		return null
	}
}

function safeSet(key: string, value: string) {
	if (typeof window === 'undefined') return
	try {
		localStorage.setItem(key, value)
	} catch {
		/* ignore */
	}
}

function safeRemove(key: string) {
	if (typeof window === 'undefined') return
	try {
		localStorage.removeItem(key)
	} catch {
		/* ignore */
	}
}

export function readPaymentLock(): PaymentLock | null {
	const raw = safeGet(PAYMENT_LOCK_KEY)
	if (!raw) return null
	try {
		const parsed = JSON.parse(raw) as PaymentLock
		if (typeof parsed?.order_id !== 'number' || typeof parsed?.started_at !== 'number') {
			return null
		}
		if (Date.now() - parsed.started_at > PAYMENT_LOCK_TTL_MS) {
			clearPaymentLock()
			return null
		}
		return parsed
	} catch {
		return null
	}
}

export function writePaymentLock(order_id: number) {
	safeSet(
		PAYMENT_LOCK_KEY,
		JSON.stringify({ order_id, started_at: Date.now() } satisfies PaymentLock),
	)
}

export function clearPaymentLock() {
	safeRemove(PAYMENT_LOCK_KEY)
}