import type { ApiResponse } from '~/types/config/api'

export type ShippingMethodResponse = ApiResponse<ShippingMethodData[]>

export interface ShippingMethodData {
    production_shipping_id: number;
    shipping_method_id: number;
    shipping_method_code: string;
    shipping_method_name: string;
    shipping_price: number;
    description: string;
    date: string;
    longer_date_message: string;
    cart_item_ids: number[];
}

export type ShippingMethodItem = {
    key: string;
    name: string;
    date: string;
    longer_date_message: string;
    price: string;
    icon: string;
    production_shipping_id: number;
    cart_item_ids: number[];
    description: string;
}
