import { useAttributesStore, useSelectionStore } from '~/stores/product'
import type { QuantitySpec } from '~/types/products/attributes'

export const useQuantityService = () => {

	const attributes_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const featured_quantities = computed(() => attributes_store.quantities)

	const quantity = ref<QuantitySpec | null>(selection_store.quantity ?? null)

	const custom_quantity = ref<QuantitySpec>({
		custom: true,
		nr: null,
		price: null,
	})

	function defaultQuantity(selected_qty: QuantitySpec) {
		if( selected_qty.custom ) {
			custom_quantity.value = selected_qty
		} else {
			quantity.value = selected_qty
		}

		selection_store.updateQuantity(selected_qty, true)
	}

	/**
	 * ðŸ“ŒHandles the changes of quantity
	 * @param selected_qty number â€” selected/inputed quantity
	 * @param custom boolean â€” [OPTIONAL] True if the source of selected_qty is from custom field
	 */
	function changeQuantity(selected_qty: QuantitySpec) {
		quantity.value = selected_qty

		// Updating state
		selection_store.updateQuantity(quantity.value)
	}


	const changeCustomQuantity = (nr: number) => {
		custom_quantity.value.nr = nr

		selection_store.updateQuantity(custom_quantity.value)
	}

	const resetCustomQuantity = () => {
		custom_quantity.value.nr = null
		custom_quantity.value.price = null
	}

	return {
		featured_quantities,
		quantity,
		custom_quantity,
		defaultQuantity,
		changeQuantity,
		changeCustomQuantity,
		resetCustomQuantity,
	}
}