import { useCartService } from "~/services/core/cart/cart.service"
import { useCartItemEditService } from "~/services/core/cart/edit.service"
import type { SizeSpec } from "~/types/products/attributes"
import { useUploadService } from '~/services/product/upload.service';

export const useEditItemHandler = (caller : string) => {

	const cart_service = useCartService('cart-edit-item-handler')

	const cart_edit_service = useCartItemEditService('cart-edit-item-handler')

	const upload_service = useUploadService()

	// use for artwork
	const selected_file = computed(() => upload_service.artwork_file.value)

	// use for artwork file preview
	const selected_file_preview = computed(() => upload_service.artwork_preview.value)

	const uploading = ref<boolean>(false)

	// use for closing the edit details modal
	const closeModal = () => {
		cart_service.unsetEditableItem()
	}


	// Submission of artwork changes
	const submitArtworkChanges = async (
		file_name: string,
		file: File,
		instruction: string |'',
	) => {
		if( !cart_service.item_picking_artwork.value ) {
			console.warn('Item for artwork was not set.')
			return
		}

		const process = await cart_service.updateArtwork(
			file_name,
			file,
			instruction,
			cart_service.item_picking_artwork.value?.local_identity
		)

		if( process && process.success )
			upload_service.clearArtwork()

		return process && process.success;
	}


	// ⚠️ Static & temporary
	const updateItemSize = () => {
		console.log(1)
	}
	const updateItemQty = () => {
		console.log(1)
	}

	const show_quantity = ref<boolean>(true)

	const sizes = ref<SizeSpec []>([])
	// ⚠️ Static & temporary







	return {
		// 🔥 States
		caller,
		show_quantity,
		sizes,
		is_open : cart_edit_service.is_open,
		active_item : cart_edit_service.active_item,
		selected_file,
		selected_file_preview,
		uploading,

		// 🔥 Service Methods
		formatImage : cart_service.formatImage,


		// 🔥 Methods
		updateItemSize,
		updateItemQty,
		closeModal,
		setArtwork: upload_service.setArtwork,
		clearArtworkChanges : upload_service.clearArtwork,
		submitArtworkChanges,
	}
}