import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

/** Allowed overlay position values */
export type LoadingOverlayPosition = 'fixed' | 'absolute'

/** Single overlay payload that mirrors UiLoadingOverlay props */
export interface LoadingOverlayPayload {
	visible?: boolean
	label?: string
	description?: string
	showCopy?: boolean
	testId?: string
	transitionName?: string
	position?: LoadingOverlayPosition
	background?: string
	zIndex?: number
	loaderWidth?: string
	loaderHeight?: string
	animationPath?: string
}

/** Internal tracked loader entry */
export interface LoadingOverlayEntry {
	key: string
	visible: boolean
	label: string
	description: string
	showCopy: boolean
	testId: string
	transitionName: string
	position: LoadingOverlayPosition
	background: string
	zIndex: number
	loaderWidth: string
	loaderHeight: string
	animationPath: string
	created_at: number
}

/**
 * Returns default overlay values
 */
function createDefaultOverlay(
	key: string
): LoadingOverlayEntry {
	return {
		key,
		visible: false,
		label: '',
		description: '',
		showCopy: false,
		testId: '',
		transitionName: 'ui-loading-overlay-fade',
		position: 'fixed',
		background: 'rgba(255, 255, 255, 0.64)',
		zIndex: 320,
		loaderWidth: '104px',
		loaderHeight: '102px',
		animationPath: '/animations/musticker-loader.json',
		created_at: Date.now(),
	}
}

/**
 * Global loading overlay store
 *
 * Strategy:
 * - track loaders by key
 * - allow multiple concurrent loaders safely
 * - render only the most recently shown visible loader
 */
export const useLoadingOverlayStore = defineStore('loading_overlay', () => {
	/** Active overlay entries indexed by feature key */
	const overlay_entries = ref<Record<string, LoadingOverlayEntry>>({})

	/**
	 * Returns all visible overlays
	 */
	const visible_overlays = computed<LoadingOverlayEntry[]>(() => {
		return Object.values(overlay_entries.value)
			.filter((entry) => entry.visible)
			.sort((entry_a, entry_b) => entry_b.created_at - entry_a.created_at)
	})

	/**
	 * Whether at least one overlay is active
	 */
	const is_visible = computed<boolean>(() => {
		return visible_overlays.value.length > 0
	})

	/**
	 * Latest active overlay
	 *
	 * Rule:
	 * - when multiple overlays are active, the newest one wins
	 */
	const current_overlay = computed<LoadingOverlayEntry>(() => {
		return visible_overlays.value[0] ?? createDefaultOverlay('global')
	})

	/**
	 * Shows or updates an overlay under a specific key
	 */
	function showOverlay(
		key: string,
		overlay_payload: LoadingOverlayPayload = {}
	): void {
		const existing_entry = overlay_entries.value[key] ?? createDefaultOverlay(key)

		overlay_entries.value[key] = {
			...existing_entry,
			...overlay_payload,
			key,
			visible: overlay_payload.visible ?? true,
			created_at: Date.now(),
		}
	}

	/**
	 * Hides an overlay by key
	 */
	function hideOverlay(key: string): void {
		const existing_entry = overlay_entries.value[key]
		if (!existing_entry) return

		overlay_entries.value[key] = {
			...existing_entry,
			visible: false,
		}
	}

	/**
     * Removes an overlay entry completely
     */
	function removeOverlay(key: string): void {
		if (!(key in overlay_entries.value)) return

		/** Remove target entry by rebuilding the object */
		const { [key]: _omitted, ...remaining_entries } = overlay_entries.value

		overlay_entries.value = remaining_entries
	}

	/**
	 * Hides all active overlays
	 */
	function hideAllOverlays(): void {
		const next_entries: Record<string, LoadingOverlayEntry> = {}

		Object.entries(overlay_entries.value).forEach(([key, entry]) => {
			next_entries[key] = {
				...entry,
				visible: false,
			}
		})

		overlay_entries.value = next_entries
	}

	/**
	 * Clears all overlay entries
	 */
	function resetOverlays(): void {
		overlay_entries.value = {}
	}

	/**
	 * Convenience helper for simple start loading flows
	 */
	function startLoading(
		key: string,
		overlay_payload: LoadingOverlayPayload = {}
	): void {
		showOverlay(key, {
			...overlay_payload,
			visible: true,
		})
	}

	/**
	 * Convenience helper for simple stop loading flows
	 */
	function stopLoading(key: string): void {
		hideOverlay(key)
	}

	return {
		overlay_entries,
		visible_overlays,
		is_visible,
		current_overlay,
		showOverlay,
		hideOverlay,
		removeOverlay,
		hideAllOverlays,
		resetOverlays,
		startLoading,
		stopLoading,
	}
})