import type { ApiResponse } from '~/types/config/api'
import type { ItemStatus, PaymentSummary } from '~/types/order'
import type { OrderAddressItem } from '~/types/order/order-address'

export interface OrderDetailItem {
	order_item_id: number
	cart_item_id: number
	attribute_id: number | null
	artwork_id: number | null
	file_path_id: number | null
	item_status_id: number | null

	item_status: ItemStatus | null

	cart_item: {
		product: string | null
		product_thumbnail: string | null
		color: string | null
		font: string | null
		width: number | null
		height: number | null
		quantity: number | null
		cost: number | null
		lettering_text: string | null
		artwork_file: string | null
		artwork_file_name: string | null
		instruction: string | null
		file_path: string | null
	}
}

export interface OrderItemsData {
	id: number
	items_count: number
	date_ordered: string

	item_status: ItemStatus | null

	order_items: OrderDetailItem[]
}

export interface OrderPaymentData {
	id: number
	order_number: string

	payment_status: {
		id: number
		code: string
		name: string
	} | null

	payment_summary: PaymentSummary | null
}

export type OrderItemsResponse = ApiResponse<OrderItemsData>
export type OrderPaymentResponse = ApiResponse<OrderPaymentData>
export type OrderAddressesResponse = ApiResponse<OrderAddressItem[]>

export type UpdateOrderItemArtworkPayload = {
	item_id: number
	file_name: string
	uploaded_file: string
	instruction: string
}

export interface ArtworkActivityEntryUser {
	id: number | null
	name: string | null
	avatar_file_name: string | null
	avatar_file_path: string | null
}

export interface ArtworkActivityEntryItemStatus {
	id: number
	code: string
	name: string
}

export interface ArtworkActivityEntry {
	id: number
	created_at: string | null
	instruction: string | null
	file_name: string | null
	uploaded_file: string | null
	file_path: string | null
	item_status: ArtworkActivityEntryItemStatus | null
	user: ArtworkActivityEntryUser
}

export interface ArtworkActivityData {
	cart_item_id: number | null
	product: string | null
	width: number | null
	height: number | null
	quantity: number | null
	entries: ArtworkActivityEntry[]
}

export type ArtworkActivityResponse = ApiResponse<ArtworkActivityData | null>