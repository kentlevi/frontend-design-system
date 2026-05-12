import { useCartStore } from "~/stores/core/cart/cart.store"
import { storeToRefs } from 'pinia'
import { useAppliedCouponStore } from "~/stores/coupon/applied_coupon.store"
import type { ApplyCoupon, ApplyCouponErrorData, ApplyCouponPayload } from "~/types/coupon/coupon"
import { applyCoupon } from "~/services/coupon/api.service"

export function useApplyCoupon() {
	const loading_overlay_store = useLoadingOverlayStore()

	const cart_store = useCartStore()
	const { selected_real_ids } = storeToRefs(cart_store)

	const applied_coupon_store = useAppliedCouponStore()
	const { coupon, coupon_discount, is_loading, error } = storeToRefs(applied_coupon_store)
	const { setCoupon, setCouponDiscount, setLoading, setError } = applied_coupon_store

	const validation_errors = ref<ApplyCouponErrorData | null>(null)

	const createApplyCouponForm = (): ApplyCouponPayload => ({
		code: '',
		cart_item_ids: selected_real_ids.value ?? []
	})

	const form = ref<ApplyCouponPayload>(createApplyCouponForm())

	async function apply() {
		if (!form.value.code) return

		setLoading(true)
		setError(null)
		startOverlay()

		try {
			const response = await applyCoupon(form.value)

			if (response.success) {
				const data = response.data as ApplyCoupon
				setCoupon(data?.coupon ?? null)
				setCouponDiscount(data?.coupon_discount ?? null)
			} else {
				validation_errors.value = response.data as ApplyCouponErrorData
			}
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
			loading_overlay_store.stopLoading('apply_coupon')
		}
	}

	function startOverlay() {
		loading_overlay_store.startLoading('apply_coupon', {
			showCopy: true,
			testId: 'apply-coupon-overlay',
			position: 'fixed'
		})
	}

	return {
		form,
		coupon,
		coupon_discount,
		is_loading,
		error,
		validation_errors,

		apply,
	}
}