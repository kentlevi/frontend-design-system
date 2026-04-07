import type { ApiResponse } from '~/types/config/api'

export type ShippingMethodResponse = ApiResponse<ShippingMethodData[]>

export interface ShippingMethodData {
	production_shipping_id: number;
	shipping_method_id: number;
	shipping_method_code: string;
	shipping_method_name: string;
	shipping_price: number;
	description: string;
	min_delivery_date: number;
	max_delivery_date: number;
	min_shipping_days: number;
	max_shipping_days: number;
    production_days: number;
	cart_item_ids: number[];
}

export type ShippingMethodItem = {
	key: string;
	name: string;
	date: string;
	longer_date_message: string;
	price: string;
	icon: string;
	shipping_method_id: number;
	production_shipping_id: number;
	cart_item_ids: number[];
	description: string;
}