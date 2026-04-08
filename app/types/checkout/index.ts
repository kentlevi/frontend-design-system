import type { ProductItem } from '~/types/products/catalog';
import type { LocalizedCatalogProduct } from '~/helpers/cart/cartState.helper';

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

export type CheckoutResponse = {
	payment_information?: {
		redirect_url?: string
	}
}

export type InitialCheckoutPayload = {
	shipping_method_id: number | null
	email?: string
	contact_name?:string
	phone_number?:string
}