import { useCartService } from "~/services/cart/cart.service"
import { useArtworkStore } from "~/stores/cart"
import { useSelectionStore } from "~/stores/product"

export const useArtworkSectionHandler = () => {

	const selection_store = useSelectionStore()

	const artwork_store = useArtworkStore()

	const cart_service = useCartService()

	const artwork = computed(() =>  artwork_store.artwork)

	const instruction = ref<string>('')

	const dispatchItem = () => {

		cart_service.store({
			product_config_mapping_id: selection_store.product_config_mapping_id,
			url_slug: selection_store.url_slug,
			size: selection_store.size,
			quantity: selection_store.quantity,
			lettering_text: selection_store.lettering_text,
			color_id: selection_store.color,
			font_id: selection_store.font,
			arwork: null,
		})
	}

	return {
		artwork,
		instruction,
		dispatchItem,
	}
}