import type { Coupon, CouponDiscount } from "~/types/coupon/coupon"

export const useAppliedCouponStore = defineStore('applied_coupon', () => {
	const coupon = ref<Coupon | null>(null)
	const coupon_discount = ref<CouponDiscount | null>(null)
	const is_loading = ref(false)
	const error = ref<Error | null>(null)

	function setCoupon(value: Coupon | null) {
		coupon.value = value
	}

	function setCouponDiscount(value: CouponDiscount | null) {
		coupon_discount.value = value
	}

	function setLoading(value: boolean) {
		is_loading.value = value
	}

	function setError(value: Error | null) {
		error.value = value
	}

	function clearAppliedCouponState() {
		coupon.value = null
		coupon_discount.value = null
		is_loading.value = false
		error.value = null
	}

	return {
		coupon,
		coupon_discount,

		setCoupon,
		setCouponDiscount,
		setLoading,
		setError,
		clearAppliedCouponState,
	}
})