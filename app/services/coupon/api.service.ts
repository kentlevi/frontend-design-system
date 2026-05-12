import type { ApplicableCoupon, ApplicableCouponApiResponse, ApplicableCouponPayload, ApplyCouponApiResponse, ApplyCouponData, ApplyCouponPayload } from "~/types/coupon/coupon";

export async function applyCoupon (payload: ApplyCouponPayload): Promise<ApplyCouponApiResponse> {
	const { $api } = useNuxtApp()

	return await $api.post<ApplyCouponData>('coupon/apply', { ...payload })
}

export async function fetchApplicableCoupon (payload: ApplicableCouponPayload): Promise<ApplicableCouponApiResponse> {
	const { $api } = useNuxtApp()

	return await $api.post<ApplicableCoupon[]>('coupon/applicable', { ...payload })
}