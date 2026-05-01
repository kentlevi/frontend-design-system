import { useCartStore } from "~/stores/core/cart/cart.store"
import { useProductionShippingStore } from "~/stores/production-shipping/production-shipping.store"

export const useCheckoutSummaryFlow = () => {
	const cart_store = useCartStore()
	const shipping_store = useProductionShippingStore()

	const { selected_items, selected_total_cost } = storeToRefs(cart_store)
	const { selected_shipping } = storeToRefs(shipping_store)

	const total_cost = computed(() => {
		return (selected_shipping.value?.shipping_price ?? 0) + selected_total_cost.value
	})

	const shipping_cost = computed(() => {
		return selected_shipping.value?.shipping_price ?? 0
	})

	return {
		selected_items,
		selected_shipping,
		total_cost,
		sub_total_cost: selected_total_cost,
		shipping_cost
	}
}