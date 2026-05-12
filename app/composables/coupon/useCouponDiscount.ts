import { useAppliedCouponStore } from "~/stores/coupon/applied_coupon.store";
import { storeToRefs } from 'pinia'
import { useCartStore } from "~/stores/core/cart/cart.store";
import { calculateCouponDiscount } from "~/utils/coupon/discount";

export function useCouponDiscount() {
	const cart_store = useCartStore()
	const { selected_items, selected_total_cost } = storeToRefs(cart_store)

	const applied_coupon_store = useAppliedCouponStore()
	const { coupon_discount } = storeToRefs(applied_coupon_store)

	const discount = computed(() => {
		if (!coupon_discount.value) return 0
		return calculateCouponDiscount(coupon_discount.value, selected_items.value, selected_total_cost.value)
	})

	return {
		discount
	}
}