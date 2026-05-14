import { useCartStore } from "~/stores/core/cart/cart.store"
import { useProductionShippingStore } from "~/stores/production-shipping/production-shipping.store"
import { useCouponDiscount } from "~/composables/coupon/useCouponDiscount"
import { usePointsStore } from "~/stores/user-point/points.store"

export const useCheckoutSummaryFlow = () => {
	const cart_store = useCartStore()
	const shipping_store = useProductionShippingStore()

	const { selected_items, selected_total_cost } = storeToRefs(cart_store)
	const { selected_shipping } = storeToRefs(shipping_store)

	const points_store = usePointsStore()
	const { points_to_use } = storeToRefs(points_store)

	const { discount: coupon_discount } = useCouponDiscount()

	const shipping_cost = computed(() => {
		return selected_shipping.value?.shipping_price ?? 0
	})

	const total_discount = computed(() => {
		return coupon_discount.value + Number(points_to_use.value ?? 0)
	})

	const total_cost = computed(() => {
		return Math.max(0, (shipping_cost.value + selected_total_cost.value) - total_discount.value)
	})

	return {
		selected_items,
		selected_shipping,
		total_cost,
		total_discount,
		sub_total_cost: selected_total_cost,
		shipping_cost
	}
}