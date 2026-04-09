import { useProductService } from "~/services/attributes/product.service";
import { useCartService } from "~/services/cart/cart.service"
import type { CartItem } from "~/types/cart/cart";

export const useCartPreviewItem = () => {

	const cart_service = useCartService();

	const product_service = useProductService()

	const deleteCartItem = (cart_item_id: number | null) => {
		if ( !cart_item_id )
			return;

		cart_service.setForDeleteItem(cart_item_id)
	}

	const editCartItem = async (item : CartItem) => {
		cart_service.selectItem(item)
		cart_service.setEditModalLoading(true)

		const cached_product_data = cart_service.getCachedFeaturedData(item.url_slug)
		if (cached_product_data) {
			cart_service.setFeaturedData(cached_product_data)
			cart_service.setEditModalLoading(false)
			return
		}

		cart_service.setFeaturedData(null)

		const product_data = await product_service.getFeaturedData(item.url_slug)

		if (!product_data) {
			cart_service.setEditModalLoading(false)
			return
		}

		cart_service.cacheFeaturedData(item.url_slug, product_data)

		if (cart_service.selected_item.value?.url_slug === item.url_slug)
			cart_service.setFeaturedData(product_data)

		cart_service.setEditModalLoading(false)
	}

	return {
		...cart_service,
		deleteCartItem,
		editCartItem,
	}
}