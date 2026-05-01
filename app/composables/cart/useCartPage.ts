import { useCartApiService } from "~/services/core/cart/api.service"
import { useCartService } from "~/services/core/cart/cart.service"
import { useUploadService } from "~/services/product/upload.service"
import type { CartItem } from "~/types/cart/cart"

export const useCartPage = () => {

	const cart_service = useCartService('cart-page')

	const cart_api_service = useCartApiService('cart-page')

	const upload_service = useUploadService()

	const has_items = computed(() => Boolean(cart_service.items.value.length) )

	const artwork_action_file_input_ref = ref<HTMLInputElement | null>(null)

	const item_picking_artwork = computed(() => cart_service.item_picking_artwork.value )

	const pending_artwork_draft_preview_url = ref<string>('')

	const pending_artwork_draft_name = ref<string>('')

	const open_artwork_modal = ref<boolean>(false)

	const openArtworkPicker = (item: CartItem) => {
		cart_service.assignArtworkPicker(item)
		artwork_action_file_input_ref.value?.click()
	}

	const onArtworkActionSelected = async (event: Event) => {
		const target = event.target as HTMLInputElement
		const file = target.files?.[0]
		if (!file || !item_picking_artwork.value) return

		clearPendingArtworkPreviewUrl()
		const preview_url = URL.createObjectURL(file)

		pending_artwork_draft_name.value = file.name
		pending_artwork_draft_preview_url.value = preview_url
		target.value = ''

		upload_service.setArtwork(file, preview_url)
		open_artwork_modal.value = true
	}

	const clearPendingArtworkPreviewUrl = () => {
		if (pending_artwork_draft_preview_url.value.startsWith('blob:')) {
			URL.revokeObjectURL(pending_artwork_draft_preview_url.value)
		}
	}

	const refreshing_item = ref<boolean>(false)

	const refreshItems = async() => {

		if( refreshing_item.value )
			return

		refreshing_item.value = true

		try {
			const cart_items = await cart_api_service.requestCartItems()
			if( !cart_items )
				return

			if( cart_items.length )
				cart_service.populateItems(cart_items)
			else
				cart_service.emptyCart()
		} catch(error) {
			console.error(error)
		} finally {
			refreshing_item.value = false
		}
	}

	return {
		// 🔥 States
		refreshing_item,
		has_items,
		artwork_action_file_input_ref,
		open_artwork_modal,
		item_picking_artwork,

		// 🔥 Methods
		openArtworkPicker,
		onArtworkActionSelected,
		refreshItems,
	}
}