import { useAttributesStore, useSelectionStore } from '~/stores/product'
import type { QuantitySpec } from '~/types/products/attributes'

export const useQuantityService = (caller: string ) => {

	const attributes_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const collection = computed(() => attributes_store.quantities)

	const src = computed(() => selection_store.quantity)

	function assignDefault(selected_qty: QuantitySpec) {
		selection_store.updateQuantity(selected_qty, true)
	}

	/**
	 * 🔥 Handles the changes of quantity
	 * @param selected_qty number — selected/inputed quantity
	 */
	function update(selected_qty: QuantitySpec) {
		selection_store.updateQuantity(selected_qty)
	}

	return {
		// 🔥 States
		caller,
		collection,
		src,

		// 🔥 Methods
		assignDefault,
		update,
	}
}