import { useAttributesStore, useSelectionStore } from '~/stores/product'
import type { PriceCalculationResult, PricePoint, QuantitySpec } from '~/types/products/attributes'

export const useQuantityService = (caller: string ) => {

	const attributes_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const collection = computed(() => attributes_store.quantities)

	const src = computed(() => selection_store.quantity)

	const minimum = ref<number>(0)

	const maximum = ref<number>(0)

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

	/**
	 * Get the quantity point (lower or upper) that was use for calculation in-between values.
	 */
	const getPricePoint = (
		point : string,
		quantity: number,
		quantities: QuantitySpec[]
	): QuantitySpec | undefined => {
		return quantities.find(qty => {
			if( qty.nr ) {
				if( point == 'upper' ) {
					return qty.nr > quantity
				} else {
					return qty.nr <= quantity
				}
			}
		})
	}

	const getCustomPrice = (quantity : number, quantities : QuantitySpec []) => {
		if( quantity < minimum.value ) {
			console.warn(`Quantity is less than minimum of ${minimum}`)
			return
		}
		const lower = getPricePoint('lower', quantity, quantities)
		const upper = getPricePoint('upper', quantity, quantities)

		if(!lower )
			return

		return calculatePrice(
			{
				nr: lower.nr,
				price: lower.price
			} as PricePoint,
			{
				nr: upper?.nr,
				price: upper?.price
			} as PricePoint,
			quantity)
	}

	const calculatePrice = (
		lower: PricePoint,
		upper: PricePoint,
		quantity: number
	): PriceCalculationResult => {
		const bound_qty_diff = Math.abs(lower.nr - upper.nr);
		const qty_diff = Math.abs(lower.nr - quantity);

		const lb_price = lower.price;
		const ub_price = upper.price;

		const bound_price_diff = Math.abs(lb_price - ub_price);

		// Prevent Division by Zero if lower and upper boundaries are identical
		const bound_diff = bound_qty_diff !== 0 ? (bound_price_diff / bound_qty_diff) : 0;
		const diff = qty_diff * bound_diff;

		// PHP round($val, -2) rounds to the nearest hundred.
		// In JS, we divide by 100, round, then multiply back.
		const price = Math.round((lb_price + diff) / 100) * 100;

		return {
			bound_qty_diff,
			qty_diff,
			lower_price: lb_price,
			upper_price: ub_price,
			bound_price_diff,
			bound_diff,
			diff,
			price,
		};
	}


	return {
		// 🔥 States
		caller,
		collection,
		src,
		minimum,
		maximum,

		// 🔥 Methods
		assignDefault,
		update,
		getCustomPrice,
		getPricePoint,
		calculatePrice,
	}
}