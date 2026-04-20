import { useAttributesStore, useSelectionStore } from '~/stores/product'
import type { PriceCalculationResult, PricePoint, PricingResponse, QuantitySpec } from '~/types/products/attributes'

export const usePricingService = (caller : string) => {

	const attributes_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const minimum_qty = ref<QuantitySpec>()

	const maximum_qty = ref<QuantitySpec>()

	const total = ref<number>(0)

	const sub_total = ref<number>(0)

	const unit_price = ref<number>(0)

	const discount_rate = ref<number>(0)

	/**
	 * Define the price details or breakdown
	 */
	const define = (data : QuantitySpec) => {
		if( !data
			|| !data.nr
			|| !data.price
			|| !minimum_qty
			|| !minimum_qty.value
			|| !minimum_qty.value.nr
			|| !minimum_qty.value.price
		) {
			if( !data || !data.nr || !data.price )
				console.log('Invalid data', data)

			if( !minimum_qty || !minimum_qty.value || !minimum_qty.value.nr || !minimum_qty.value.price )
				console.log('Invalidd minimum quantity.', minimum_qty)

			return
		}

		const min_price = minimum_qty.value.price

		const min_qty = minimum_qty.value.nr

		const min_unit_price = min_price / min_qty

		const curr_qty = data.nr

		const expected_price = min_unit_price * curr_qty

		const disc_rate = 1- (data.price/expected_price)

		sub_total.value = expected_price

		discount_rate.value = Math.round(disc_rate*100)/100

		unit_price.value = data.price / curr_qty

		total.value = data.price
	}

	/** Set the prices fetched from our API */
	const bindPrices = async (data : PricingResponse) => {
		attributes_store.updateQuantites(data.prices)

		selection_store.updateVariantID(data.product_variant_id)

		defineLimits(data.prices)
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

	/** Handles the custom price for custom quantity */
	const getCustomPrice = (quantity : number, quantities : QuantitySpec []) => {
		const minimum = minimum_qty.value?.nr ?? 0

		if( quantity < minimum ) {
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
			quantity
		)
	}

	/** Calculate the define lower and upper pricing point */
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

	const isPricingReady = (value : boolean) => {
		selection_store.updatePricingFlag(value)
	}

	/** Define custom quantity limits. */
	const defineLimits = (quantities : QuantitySpec []) => {
		if( !quantities.length )
			return

		minimum_qty.value = quantities[0]
		maximum_qty.value = quantities[quantities.length -1]
	}

	return {
		// 🔥 States
		caller,
		minimum_qty,
		maximum_qty,
		total,
		sub_total,
		unit_price,
		discount_rate,

		// 🔥 Methods
		getPricePoint,
		getCustomPrice,
		calculatePrice,
		bindPrices,
		isPricingReady,
		define,
		defineLimits,
	}
}