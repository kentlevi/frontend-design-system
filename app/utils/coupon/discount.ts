import type { CouponDiscount } from "~/types/coupon/coupon"

interface DiscountItem {
	product_id?: number
	cost: number
}

export function calculateCouponDiscount(
	coupon_discount: CouponDiscount,
	items: DiscountItem[],
	total_cost: number
): number {
	if (items.length === 0) return 0

	let applicable_cost = 0

	if (coupon_discount.scope === 'order') {
		applicable_cost = total_cost
	} else if (coupon_discount.scope === 'product') {
		const product_ids = coupon_discount.product_ids || []
		applicable_cost = items.reduce((acc, item) => {
			if (item.product_id && product_ids.includes(item.product_id)) {
				return acc + item.cost
			}
			return acc
		}, 0)
	}

	if (applicable_cost === 0) return 0

	let calculated_discount = 0

	if (coupon_discount.type === 'fixed') {
		calculated_discount = coupon_discount.value
	} else if (coupon_discount.type === 'percentage') {
		calculated_discount = applicable_cost * (coupon_discount.value / 100)
	}

	if (coupon_discount.max_cap > 0) {
		calculated_discount = Math.min(calculated_discount, coupon_discount.max_cap)
	}

	return Math.min(calculated_discount, applicable_cost)
}