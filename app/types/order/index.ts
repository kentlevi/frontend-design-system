import type { ApiResponse } from '~/types/config/api'

export interface OrderCompleteData {
	id: number;
	order_number: string;
	user_id: number;
	shipping_method_id: number;
	courier_id: number;
	country_id: number;
	items_count: number;
	payment_status: 'paid' | 'pending' | 'failed' | string;

	date_ordered: string;
	last_modified_date: string;
	last_modified_time: string;

	payment_summary?: PaymentSummary;
	order_status?: OrderStatus;
	item_status?: ItemStatus;

	order_items?: OrderItem[];
}

export interface PaymentSummary {
	subtotal_cost: number;
	shipping_cost: number;
	total_cost: number;
	payment_method_name: string;
}

export interface OrderStatus {
	id: number;
	name: string;
}

export interface ItemStatus {
	id: number;
	name: string;
}

export interface OrderItem {
	order_item_id: number;
	cart_item_id: number;
	cart_reference_id: number | null;

	attribute_id: number | null;
	width: string | null;
	height: string | null;
	lettering_text: string | null;
	quantity: number;
	cost: number;

	artwork_id: number | null;
	file_path_id: number | null;
	file_name: string | null;
	evaluation_status: string | null;
	evaluation_notes: string | null;
	instruction: string | null;

	product_name: string;
	product_url_slug: string;
	product_featured_image_url: string;
}

export type OrderCompleteDataResponse = ApiResponse<OrderCompleteData>