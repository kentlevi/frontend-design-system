import type { ApiResponse } from '~/types/config/api'

export type UserOrderType = 'ongoing' | 'action_required' | 'completed'

export interface UserOrderStatus {
	id: number
	name: string
	code: string
}

export interface UserOrder {
	id: number
	order_number: string
	items_count: number
	created_at: string
	order_status: UserOrderStatus
}

export type UserOrdersResponse = ApiResponse<UserOrder[]>