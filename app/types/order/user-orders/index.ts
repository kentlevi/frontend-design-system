import type { ApiResponse } from '~/types/config/api'

export type UserOrderType = 'ongoing' | 'action-required' | 'completed'

export interface UserOrder {
	id: number
	order_number: string
	items_count: number
	created_at: string
}

export type UserOrdersResponse = ApiResponse<UserOrder[]>