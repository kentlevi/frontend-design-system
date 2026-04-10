import type { ApiResponse } from '~/types/config/api'

export interface AvailableShippingMethod {
	production_shipping_id: number
	shipping_method_id: number
	shipping_method_code: string
	shipping_method_name: string
	shipping_price: number
	description: string
	min_delivery_date: number
	max_delivery_date: number
	timezone: string
	min_shipping_days: number
	max_shipping_days: number
	production_days: number
	cart_item_ids: number[]
}

export type AvailableShippingMethodsResponse = ApiResponse<AvailableShippingMethod[]>

export interface ProductionShippingStoreState {
	available_shipping_methods: AvailableShippingMethod[]
	is_loading: boolean
	is_loaded: boolean
	error_message: string
}
