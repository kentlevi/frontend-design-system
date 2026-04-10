import { useProductService } from "~/services/attributes/product.service";
import { useCartService } from "~/services/cart/cart.service"
import type { CartItem } from "~/types/cart/cart";

export const useCartPreviewItem = () => {

	const cart_service = useCartService();

	const product_service = useProductService()

	const deleteCartItem = (cart_item_id: string | number | null) => {
		if ( !cart_item_id )
			return;

		cart_service.setForDeleteItem(cart_item_id)
	}

	const editCartItem = async (item : CartItem) => {
		cart_service.selectItem(item)

		const product_data = await product_service.getFeaturedData(item.url_slug)

		if( !product_data ) return

		cart_service.setFeaturedData(product_data)

		const item_id = item.id ? String(item.id) : item.local_identity
		if (!item_id) return

		cart_service.openEditFullModal(item_id)
	}

	return {
		...cart_service,
		deleteCartItem,
		editCartItem,
	}
}