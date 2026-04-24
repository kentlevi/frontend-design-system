import { useCartService } from "~/services/core/cart/cart.service"
import { useUploadService } from "~/services/product/upload.service"
import type { CartItem } from "~/types/cart/cart"

export const useCartPage = () => {

	const cart_service = useCartService('cart-page')

	const upload_service = useUploadService()

	const has_items = computed(() => cart_service.items.value )

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

		console.log(file.name)
		upload_service.setArtwork(file, preview_url)
		open_artwork_modal.value = true
	}

	const clearPendingArtworkPreviewUrl = () => {
		if (pending_artwork_draft_preview_url.value.startsWith('blob:')) {
			URL.revokeObjectURL(pending_artwork_draft_preview_url.value)
		}
	}

	return {
		// 🔥 States
		has_items,
		artwork_action_file_input_ref,
		open_artwork_modal,
		item_picking_artwork,

		// 🔥 Methods
		openArtworkPicker,
		onArtworkActionSelected,
	}
}