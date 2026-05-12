import type { ApiResponse } from "../config/api"

export type CouponStatus = 'draft' | 'scheduled' | 'active' | 'expired' | 'disabled'

export interface Coupon {
	id: number
	code: string
	name: string
	description: string
	valid_until: string
	status: CouponStatus
}

export interface CouponDiscount {
	type: 'percentage' | 'fixed'
	scope: 'order' | 'product'
	value: number
	max_cap: number
	product_ids?: number[]
}

export interface ApplyCoupon {
	coupon: Coupon
	coupon_discount: CouponDiscount
}

export interface ApplicableCoupon extends Coupon {
	usage_limit: number
	can_use: boolean
}

export interface ApplicableCouponData {
	coupons: ApplicableCoupon[]
}

export interface ApplyCouponPayload {
	code: string
	cart_item_ids: number[]
}

export interface ApplicableCouponPayload {
	cart_item_ids: number[]
}
export type ApplyCouponErrorData = Record<string, string[]>

export type ApplyCouponData = ApplyCoupon | ApplyCouponErrorData

export type ApplyCouponApiResponse = ApiResponse<ApplyCouponData>

export type ApplicableCouponApiResponse = ApiResponse<ApplicableCouponData>