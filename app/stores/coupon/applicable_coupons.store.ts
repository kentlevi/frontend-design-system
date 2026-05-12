import type { ApplicableCoupon } from "~/types/coupon/coupon"

export const useApplicableCouponsStore = defineStore('applicble_coupons', () => {
	const applicable_coupons = ref<ApplicableCoupon[]>([])
	const is_loading = ref(false)
	const error = ref<Error | null>(null)

	function setApplicableCoupons(value: ApplicableCoupon[]) {
		applicable_coupons.value = value
	}

	function setLoading(value: boolean) {
		is_loading.value = value
	}

	function setError(value: Error | null) {
		error.value = value
	}

	function clearApplicableCouponsState() {
		applicable_coupons.value = []
		is_loading.value = false
		error.value = null
	}

	return {
		applicable_coupons,
		is_loading,
		error,

		setApplicableCoupons,
		setLoading,
		setError,
		clearApplicableCouponsState,
	}
})