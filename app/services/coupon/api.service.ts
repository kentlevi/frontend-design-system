import type { ApplicableCouponApiResponse, ApplicableCouponData, ApplicableCouponPayload, ApplyCouponApiResponse, ApplyCouponData, ApplyCouponPayload } from "~/types/coupon/coupon";

export async function applyCoupon (payload: ApplyCouponPayload): Promise<ApplyCouponApiResponse> {
	const { $api } = useNuxtApp()

	return await $api.post<ApplyCouponData>('coupon/apply', { ...payload })
}

export async function fetchApplicableCoupons (payload: ApplicableCouponPayload): Promise<ApplicableCouponApiResponse> {
	const { $api } = useNuxtApp()

	return await $api.post<ApplicableCouponData>('coupon/applicable', { ...payload })
}