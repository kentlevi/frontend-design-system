import type { ProductItem } from '~/types/products/catalog';
import type { LocalizedCatalogProduct } from '~/helpers/cart/cartState.helper';
import type { ApiResponse } from '~/types/config/api'
import type { PaymentCode } from '../payments/payment';
import type { AddressFormMap, AddressType } from "~/types/user-address";

export type CheckoutItem = {
	id: string;
	product: ProductItem | LocalizedCatalogProduct;
	sizeLabel: string;
	qty: number;
	total: number;
	artworkPreviewUrl: string;
};

export type CheckoutResponseData = {
	order?: {
		id:number
	}
	payment_information?: {
		redirect_url?: string
	}
}

export type InitialCheckoutPayload = {
	shipping_method_id: number | null
	payment_method_code: PaymentCode
	email?: string
	contact_name?:string
	phone_number?:string
	selected_cart_ids?:number[] | null
}

export type completeCheckoutPayload = {
	order_id : number
	shipping_address:AddressFormMap[AddressType]
	billing_address: AddressFormMap[AddressType]
	drop_address: AddressFormMap[AddressType] | null
	selected_cart_ids: number[] | null
}

export type CheckoutApiResponse = ApiResponse<CheckoutResponseData>