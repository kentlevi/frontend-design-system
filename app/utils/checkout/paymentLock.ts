import type { completeCheckoutPayload } from '~/types/checkout'

export const PAYMENT_LOCK_KEY = 'mu_payment_in_flight'
export const COMPLETION_SNAPSHOT_KEY = 'mu_payment_completion_snapshot'
const PAYMENT_LOCK_TTL_MS = 10 * 60 * 1000

export type PaymentLock = {
	order_id: number
	started_at: number
}

export type CompletionSnapshot = Omit<completeCheckoutPayload, 'order_id'>

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
	safeRemove(COMPLETION_SNAPSHOT_KEY)
}

export function saveCompletionSnapshot(snapshot: CompletionSnapshot) {
	safeSet(COMPLETION_SNAPSHOT_KEY, JSON.stringify(snapshot))
}

export function readCompletionSnapshot(): CompletionSnapshot | null {
	const raw = safeGet(COMPLETION_SNAPSHOT_KEY)
	if (!raw) return null
	try {
		return JSON.parse(raw) as CompletionSnapshot
	} catch {
		return null
	}
}