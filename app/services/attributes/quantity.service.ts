import { useAttributesStore, useSelectionStore } from '~/stores/product'
import type { QuantitySpec } from '~/types/products/attributes'

export const useQuantityService = () => {

	const attributesStore = useAttributesStore()

	const selectionStore = useSelectionStore()

	const featured_quantities = computed(() => attributesStore.quantities)

	const quantity = computed(() => selectionStore.quantity )

	const raw_custom_qty = ref<number | null>(null)

	function defaultQuantity(selected_qty: QuantitySpec) {
		selectionStore.updateQuantity({
			...selected_qty,
			custom: false
		}, true)
	}

	/**
	 * 📌Handles the changes of quantity
	 * @param selected_qty number — selected/inputed quantity
	 * @param custom boolean — [OPTIONAL] True if the source of selected_qty is from custom field
	 */
	function changeQuantity(selected_qty: QuantitySpec, custom?: boolean) {
		// If the inputed size exist in featured quantities, set the custom flag false
		if( custom ) {
			const featured_qty = attributesStore.quantities.find(e => e.nr === selected_qty.nr);
			console.log(featured_qty)
			if( featured_qty )
				custom = false
		}
		// obj.find(item => item.nr === 50)

		// Updating state
		selectionStore.updateQuantity({
			...selected_qty,
			custom: !!custom
		})
	}


	const changeCustomQuantity = (e: Event) => {
		const input = e.target as HTMLInputElement

		// remove commas
		const raw = input.value.replace(/,/g, '')

		const number = Number(raw)

		if (!isNaN(number)) {
			raw_custom_qty.value = number
			changeQuantity({ nr: number, price: 0 }, true)
		}
	}

	return {
		featured_quantities,
		quantity,
		raw_custom_qty,
		defaultQuantity,
		changeQuantity,
		changeCustomQuantity,
	}
}