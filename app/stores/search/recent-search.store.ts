import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { RecentSearchStorageEntry } from '~/types/layout/appHeaderSearch'

type RecentSearchState = {
	recent_search_storage_entries: RecentSearchStorageEntry[]
	should_refetch_recent_products: boolean
}

const recent_search_storage_key = 'app_header_recent_searches'
const legacy_recent_search_storage_key = 'search_recent_terms'

/**
 * Initial recent-search state factory
 */
function createInitialRecentSearchState(): RecentSearchState {
	return {
		recent_search_storage_entries: [],
		should_refetch_recent_products: false
	}
}

function loadRecentSearchStateFromStorage(): Partial<RecentSearchState> {
	if (!import.meta.client) return {}

	try {
		const raw_value = window.localStorage.getItem(recent_search_storage_key)
		if (!raw_value) {
			const legacy_raw_value = window.localStorage.getItem(legacy_recent_search_storage_key)
			if (!legacy_raw_value) return {}

			const legacy_parsed_value = JSON.parse(legacy_raw_value)
			if (!Array.isArray(legacy_parsed_value)) return {}

			return {
				recent_search_storage_entries: legacy_parsed_value as RecentSearchStorageEntry[],
				should_refetch_recent_products: false
			}
		}

		const parsed_value = JSON.parse(raw_value) as Partial<RecentSearchState>

		return {
			recent_search_storage_entries: Array.isArray(parsed_value?.recent_search_storage_entries)
				? parsed_value.recent_search_storage_entries
				: [],
			should_refetch_recent_products: Boolean(parsed_value?.should_refetch_recent_products)
		}
	} catch {
		return {}
	}
}

function writeRecentSearchStateToStorage(state: RecentSearchState): void {
	if (!import.meta.client) return

	try {
		const serialized_state = JSON.stringify({
			recent_search_storage_entries: state.recent_search_storage_entries,
			should_refetch_recent_products: state.should_refetch_recent_products
		})

		window.localStorage.setItem(recent_search_storage_key, serialized_state)
	} catch {
		// Ignore persistence failures and keep in-memory state.
	}
}

/**
 * App Header Recent Search Store
 */
export const useRecentSearchStore = defineStore('recent_search', () => {

	/* --------------------------------------------------------------------------
     * State
     * -------------------------------------------------------------------------- */

	const state = ref<RecentSearchState>(createInitialRecentSearchState())
	const is_hydrated = ref(false)

	/* --------------------------------------------------------------------------
     * Actions
     * -------------------------------------------------------------------------- */

	/**
     * Hydrate persisted state once on client
     */
	function hydrateState(): void {
		if (!import.meta.client || is_hydrated.value) return

		const persisted_state = loadRecentSearchStateFromStorage()
		state.value = {
			...state.value,
			...persisted_state
		}

		is_hydrated.value = true
	}

	/**
     * Replace all recent entries (local-first update)
     */
	function setRecentSearchStorageEntries(entries: RecentSearchStorageEntry[]): void {
		state.value.recent_search_storage_entries = entries
		writeRecentSearchStateToStorage(state.value)
	}

	/**
     * Replace all recent entries from remote and mark as fresh
     */
	function setRecentSearchStorageEntriesFromRemote(entries: RecentSearchStorageEntry[]): void {
		state.value.recent_search_storage_entries = entries
		state.value.should_refetch_recent_products = false
		writeRecentSearchStateToStorage(state.value)
	}

	/**
     * Clear recent entries
     */
	function clearRecentSearchStorageEntries(): void {
		state.value.recent_search_storage_entries = []
		writeRecentSearchStateToStorage(state.value)
	}

	/**
     * Mark remote recent products as stale
     */
	function markRecentSearchesDirty(): void {
		state.value.should_refetch_recent_products = true
		writeRecentSearchStateToStorage(state.value)
	}

	/* --------------------------------------------------------------------------
     * Expose
     * -------------------------------------------------------------------------- */

	return {
		state,
		is_hydrated,
		hydrateState,
		setRecentSearchStorageEntries,
		setRecentSearchStorageEntriesFromRemote,
		clearRecentSearchStorageEntries,
		markRecentSearchesDirty
	}
})