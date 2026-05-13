import { useCartStore } from "~/stores/core/cart/cart.store"
import { storeToRefs } from 'pinia'
import { useAppliedCouponStore } from "~/stores/coupon/applied_coupon.store"
import type { ApplyCoupon, ApplyCouponErrorData, ApplyCouponPayload } from "~/types/coupon/coupon"
import { applyCoupon } from "~/services/coupon/api.service"
import { useGetApplicableCoupons } from "~/services/coupon/coupon.service"

export function useApplyCoupon() {
	const { applicable_coupons, is_loading: is_loading_applicable_coupons, getApplicableCoupons } = useGetApplicableCoupons()

	const loading_overlay_store = useLoadingOverlayStore()

	const cart_store = useCartStore()
	const { selected_real_ids } = storeToRefs(cart_store)

	const applied_coupon_store = useAppliedCouponStore()
	const { coupon, coupon_discount, is_loading, error } = storeToRefs(applied_coupon_store)
	const { setCoupon, setCouponDiscount, clearAppliedCouponState, setLoading, setError } = applied_coupon_store

	const has_coupon_error = ref<boolean>(false)
	const message = ref<string | null>(null)
	const validation_errors = ref<ApplyCouponErrorData | null>(null)

	const createApplyCouponForm = (): ApplyCouponPayload => ({
		code: '',
		cart_item_ids: selected_real_ids.value ?? []
	})

	const form = ref<ApplyCouponPayload>(createApplyCouponForm())

	async function apply() {
		has_coupon_error.value = false
		message.value = null
		validation_errors.value = null
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
				has_coupon_error.value = true
				validation_errors.value = response.data as ApplyCouponErrorData
				message.value = response.message
			}
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
			loading_overlay_store.stopLoading('apply_coupon')
		}
	}

	function removeAppliedCoupon() {
		form.value.code = ''
		clearAppliedCouponState()
	}

	function startOverlay() {
		loading_overlay_store.startLoading('apply_coupon', {
			showCopy: true,
			testId: 'apply-coupon-overlay',
			position: 'fixed'
		})
	}

	onBeforeMount(() => {
		removeAppliedCoupon()
	})

	onMounted( () => {
		getApplicableCoupons()
	})

	return {
		form,
		applicable_coupons,
		coupon,
		coupon_discount,
		is_loading,
		is_loading_applicable_coupons,
		error,
		has_coupon_error,
		message,
		validation_errors,

		apply,
		removeAppliedCoupon,
	}
}