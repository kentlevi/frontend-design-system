import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
	AvailableShippingMethod,
	ProductionShippingStoreState,
} from '~/types/production-shipping/production-shipping'

/**
 * Initial production shipping state factory
 */
function createInitialProductionShippingState(): ProductionShippingStoreState {
	return {
		available_shipping_methods: [],
		is_loading: false,
		is_loaded: false,
		error_message: '',
	}
}

/**
 * Production shipping store
 */
export const useProductionShippingStore = defineStore('production_shipping', () => {
	/* --------------------------------------------------------------------------
     * State
     * -------------------------------------------------------------------------- */

	const initial_state = createInitialProductionShippingState()

	const available_shipping_methods = ref<AvailableShippingMethod[]>(
		initial_state.available_shipping_methods
	)
	const selected_shipping_method_code = ref<string | null>(null)
	const is_loading = ref<boolean>(initial_state.is_loading)
	const is_loaded = ref<boolean>(initial_state.is_loaded)
	const error_message = ref<string>(initial_state.error_message)

	/* --------------------------------------------------------------------------
     * Getters
     * -------------------------------------------------------------------------- */

	const selected_shipping = computed<AvailableShippingMethod | null>(
		() => {
			return available_shipping_methods.value.find(
				method => method.shipping_method_code === selected_shipping_method_code.value
			) || null
		}
	)

	/* --------------------------------------------------------------------------
     * Actions
     * -------------------------------------------------------------------------- */

	function setAvailableShippingMethods(methods: ProductionShippingStoreState['available_shipping_methods']): void {
		available_shipping_methods.value = methods
	}

	function setSelectedShippingMethodCode(code: string): void {
		selected_shipping_method_code.value = code
	}

	function clearAvailableShippingMethods(): void {
		available_shipping_methods.value = []
	}

	function setIsLoading(value: boolean): void {
		is_loading.value = value
	}

	function setIsLoaded(value: boolean): void {
		is_loaded.value = value
	}

	function setErrorMessage(message: string): void {
		error_message.value = message
	}

	function resetState(): void {
		const fresh_state = createInitialProductionShippingState()

		available_shipping_methods.value = fresh_state.available_shipping_methods
		is_loading.value = fresh_state.is_loading
		is_loaded.value = fresh_state.is_loaded
		error_message.value = fresh_state.error_message
	}

	return {
		available_shipping_methods,
		is_loading,
		is_loaded,
		error_message,
		selected_shipping_method_code,
		selected_shipping,

		setAvailableShippingMethods,
		setSelectedShippingMethodCode,
		clearAvailableShippingMethods,
		setIsLoading,
		setIsLoaded,
		setErrorMessage,
		resetState,
	}
})