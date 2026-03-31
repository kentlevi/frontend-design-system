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
	line1: string;
	line2: string;
	isDefault?: boolean;
};

export type CheckoutResponse = {
  payment_information?: {
    redirect_url?: string
  }
}