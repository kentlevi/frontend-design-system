import { useApplicableCouponsStore } from "~/stores/coupon/applicable_coupons.store";
import { storeToRefs } from 'pinia'
import { useCartStore } from "~/stores/core/cart/cart.store";
import { fetchApplicableCoupons } from "./api.service";

export function useGetApplicableCoupons() {
	const cart_store = useCartStore()
	const { selected_real_ids } = storeToRefs(cart_store)

	const applicable_coupons_store = useApplicableCouponsStore()
	const { applicable_coupons, is_loading, error } = storeToRefs(applicable_coupons_store)
	const { setApplicableCoupons, setLoading, setError } = applicable_coupons_store

	async function getApplicableCoupons() {
		setLoading(true)
		setError(null)

		try {
			const response = await fetchApplicableCoupons(
				{
					cart_item_ids: selected_real_ids.value ?? []
				}
			)

			setApplicableCoupons(response?.data?.coupons ?? [])
		} catch (err) {
			setError(err as Error)
		} finally {
			setLoading(false)
		}
	}

	return {
		applicable_coupons,
		is_loading,
		error,
		getApplicableCoupons,
	}
}