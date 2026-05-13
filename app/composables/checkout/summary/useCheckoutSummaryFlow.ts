import { useCartStore } from "~/stores/core/cart/cart.store"
import { useProductionShippingStore } from "~/stores/production-shipping/production-shipping.store"
import { useCouponDiscount } from "~/composables/coupon/useCouponDiscount"

export const useCheckoutSummaryFlow = () => {
	const cart_store = useCartStore()
	const shipping_store = useProductionShippingStore()

	const { selected_items, selected_total_cost } = storeToRefs(cart_store)
	const { selected_shipping } = storeToRefs(shipping_store)

	const { discount: coupon_discount } = useCouponDiscount()

	const total_cost = computed(() => {
		return ((selected_shipping.value?.shipping_price ?? 0) + selected_total_cost.value) - coupon_discount.value
	})

	const shipping_cost = computed(() => {
		return selected_shipping.value?.shipping_price ?? 0
	})

	const total_discount = computed(() => {
		return coupon_discount.value
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