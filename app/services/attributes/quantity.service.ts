import { useAttributesStore, useSelectionStore } from '~/stores/product'
import type { QuantitySpec } from '~/types/products/attributes'

export const useQuantityService = () => {

	const attributesStore = useAttributesStore()

	const selectionStore = useSelectionStore()

	const featured_quantities = computed(() => attributesStore.quantities)

	const quantity = ref<QuantitySpec | null>(selectionStore.quantity ?? null)

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

		selectionStore.updateQuantity(selected_qty, true)
	}

	/**
	 * 📌Handles the changes of quantity
	 * @param selected_qty number — selected/inputed quantity
	 * @param custom boolean — [OPTIONAL] True if the source of selected_qty is from custom field
	 */
	function changeQuantity(selected_qty: QuantitySpec) {
		quantity.value = selected_qty

		// Updating state
		selectionStore.updateQuantity(quantity.value)
	}


	const changeCustomQuantity = (e: Event) => {
		const input = e.target as HTMLInputElement

		// remove commas
		const raw = input.value.replace(/,/g, '')

		const number = Number(raw)

		if (!isNaN(number)) {
			custom_quantity.value.nr = number

			selectionStore.updateQuantity(custom_quantity.value)
		}
	}

	return {
		featured_quantities,
		quantity,
		custom_quantity,
		defaultQuantity,
		changeQuantity,
		changeCustomQuantity,
	}
}