import type { ApiResponse } from '~/types/config/api'

export interface OrderQuotationDetails {
	id: number
	quote_number: string
	subtotal_cost: number
	shipping_cost: number
	discount: number
	total_cost: number

	order_qoutation_detail_items : OrderQuotationDetailItem[]
}

export interface OrderQuotationDetailItem {
	id: number
	order_quotation_detail_id: number
	cart_item_attr_update_id: number
}

export type CreateQuotationPayload = {
	subtotal_cost: number
	shipping_cost: number
	discount: number
	total_cost: number
	cart_item_ids: number[]
}

export type OrderQuotationDetailsResponse = ApiResponse<OrderQuotationDetails>