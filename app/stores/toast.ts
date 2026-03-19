import { defineStore } from 'pinia'
import { ref } from 'vue'

/** Allowed toast tone values based on UiToast props */
export type ToastTone =
	| 'primary'
	| 'success'
	| 'warning'
	| 'error'
	| 'info'

/** Allowed toast variant values based on UiToast props */
export type ToastVariant = 'default' | 'outlined'

/** Payload accepted by toast actions */
export interface ToastPayload {
	visible?: boolean
	title?: string | null
	message?: string | null
	tone?: ToastTone
	dismissible?: boolean
	variant?: ToastVariant
}

/** Minimal api response shape used by the toast mapper */
export interface ToastApiResponse {
	success?: boolean
	message?: string | null
}

/**
 * Global toast store
 *
 * Responsibility:
 * - hold the current toast UI state
 * - expose helpers to show/hide/reset toast
 * - map api responses into toast-ready values
 */
export const useToastStore = defineStore('toast', () => {
	/** Controls whether the toast is shown */
	const is_visible = ref<boolean>(false)

	/** Message rendered inside the toast */
	const toast_message = ref<string | null>('')

	/** Optional title rendered before the message */
	const toast_title = ref<string | null>('')

	/** Semantic tone passed to UiToast */
	const toast_tone = ref<ToastTone>('primary')

	/** Whether the close button should be shown */
	const is_dismissible = ref<boolean>(true)

	/** Visual style variant passed to UiToast */
	const toast_variant = ref<ToastVariant>('default')

	/** Active auto-close timer */
	const timeout_id = ref<ReturnType<typeof setTimeout> | null>(null)

	/**
	 * Clears the running timer to avoid stale auto-close behavior
	 */
	function clearTimer(): void {
		if (!timeout_id.value) return

		clearTimeout(timeout_id.value)
		timeout_id.value = null
	}

	/**
	 * Hides the current toast and clears any running timer
	 */
	function hideToast(): void {
		clearTimer()
		is_visible.value = false
	}

	/**
	 * Resets the toast back to its initial default state
	 */
	function resetToast(): void {
		clearTimer()

		is_visible.value = false
		toast_title.value = ''
		toast_message.value = ''
		toast_tone.value = 'primary'
		is_dismissible.value = true
		toast_variant.value = 'default'
	}

	/**
	 * Shows a toast using the provided payload
	 */
	function showToast(toast_payload: ToastPayload): void {
		/** Prevent an old timer from closing the new toast */
		clearTimer()

		is_visible.value = toast_payload.visible ?? true
		toast_title.value = toast_payload.title ?? ''
		toast_message.value = toast_payload.message ?? ''
		toast_tone.value = toast_payload.tone ?? 'primary'
		is_dismissible.value = toast_payload.dismissible ?? true
		toast_variant.value = toast_payload.variant ?? 'default'
	}

	/**
	 * Shows a toast and automatically hides it after the given duration
	 */
	function showToastWithTimer(
		toast_payload: ToastPayload,
		duration = 3000
	): void {
		showToast(toast_payload)

		timeout_id.value = setTimeout(() => {
			is_visible.value = false
			timeout_id.value = null
		}, duration)
	}

	/**
	 * Maps a backend response into a toast
	 *
	 * Mapping rule:
	 * - success true  => success tone
	 * - success false => error tone
	 *
	 * You can later expand this if your backend returns warning/info states.
	 */
	function handleApiResponse(
		api_response?: ToastApiResponse | null,
		duration?: number
	): void {
		if (!api_response?.message) return

		const toast_payload: ToastPayload = {
			message: api_response.message,
			tone: api_response.success ? 'primary' : 'error',
			dismissible: true,
			variant: 'default',
		}

		if (typeof duration === 'number') {
			showToastWithTimer(toast_payload, duration)
			return
		}

		showToast(toast_payload)
	}


	/**
     * Show general update catch error
     */
	function showUpdateError(): void {
		const toast_payload: ToastPayload = {
			title: 'Update Failed',
			message: 'We couldn\'t complete your update. Please try again.',
			tone: 'error',
			dismissible: true,
			variant: 'default'
		}

		showToast(toast_payload)
	}

	return {
		is_visible,
		toast_title,
		toast_message,
		toast_tone,
		is_dismissible,
		toast_variant,
		timeout_id,
		clearTimer,
		hideToast,
		resetToast,
		showToast,
		showToastWithTimer,
		handleApiResponse,
		showUpdateError,
	}
})