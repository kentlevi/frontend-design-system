import type { ProductItem } from '~/types/products/catalog';
import type { LocalizedCatalogProduct } from '~/helpers/cart/cartState.helper';
import type { ApiResponse } from '~/types/config/api'
import type { PaymentCode } from '../payments/payment';
import type { AddressMap, AddressType } from "~/types/address";

export type CheckoutItem = {
	id: string;
	product: ProductItem | LocalizedCatalogProduct;
	sizeLabel: string;
	qty: number;
	total: number;
	artworkPreviewUrl: string;
};

export type MemberAddress = {
	id: string;
	recipient: string;
	phone?: string;
	line1: string;
	line2: string;
	company?: string;
	label?: string;
	isDefault?: boolean;
	badgeLabel?: string;
};

export type MemberDropShippingAddress = {
	id: string;
	recipient: string;
	company?: string;
	label?: string;
	isDefault?: boolean;
};

export type CheckoutResponseData = {
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
}

export type completeCheckoutPayload = {
	order_id : number
	shipping_address:AddressMap[AddressType] | null
	billing_address: AddressMap[AddressType] | null
}

export type CheckoutApiResponse = ApiResponse<CheckoutResponseData>