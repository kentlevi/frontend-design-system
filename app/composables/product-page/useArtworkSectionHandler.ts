import { useCartService } from "~/services/cart/cart.service"
import { useUploadService } from "~/services/product/upload.service"
import { useAttributesStore, useSelectionStore } from "~/stores/product"
import { useUsersStore } from "~/stores/users/users.store"
import type { CartItem } from "~/types/cart/cart"
import { convertFileBase64, formatProductFileSize } from "~/utils/file/file"


export const useArtworkSectionHandler = () => {

	const attribute_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const cart_service = useCartService()

	const user_store = useUsersStore()

	const upload_service = useUploadService()

	const auth_user = user_store.state

	const current_product_slug = computed(() => attribute_store.product?.url_slug || '')
	const has_lettering_editor = computed(() =>
		attribute_store.active_lettering_editor.includes(current_product_slug.value)
	)

	const is_authenticated = computed(() => auth_user.id && auth_user.email )

	const instruction = computed({
		get: () => upload_service.instruction.value,
		set: (val) => upload_service.instruction.value = val
	})

	const artwork = computed({
		get: () => upload_service.artwork_file.value,
		set: (val) => upload_service.artwork_file.value = val
	})

	const artwork_file_name = computed(() => artwork.value ? artwork.value?.name : '')

	const artwork_file_ext = computed(() => {
		const file_name = artwork.value?.name || '';
		const parts = file_name.split('.');
		const extension = parts.at(-1);
		return parts.length > 1 && extension ? extension.toLowerCase() : 'file';
	});

	const artwork_file_size = computed(() =>
		artwork.value ? formatProductFileSize(artwork?.value.size) : ''
	)

	const artwork_preview = computed({
		get: () => upload_service.artwork_preview.value,
		set: (val) => upload_service.artwork_preview.value = val
	})

	onMounted(async () => {
		if( has_lettering_editor.value && !artwork.value && selection_store.lettering_file ) {
			artwork.value = selection_store.lettering_file
			artwork_preview.value = await convertFileBase64(selection_store.lettering_file)
		}
	})

	const has_uploaded_file = computed(() => !!(artwork?.value && artwork_preview?.value) )

	const uploading = computed({
		get: () => upload_service.is_uploading.value,
		set: (val) => upload_service.is_uploading.value = val
	})

	const is_dragging = computed({
		get: () => upload_service.is_dragging.value,
		set: (val) => upload_service.is_dragging.value = val
	})

	const setFile = (file: File) => {
		artwork.value = file
	}



	const unsetFile = () => {
		artwork_preview.value = '';
		artwork.value = null;
	}

	const resetForm = () => {
		instruction.value = ''
		unsetFile()
	}


	/**
	 * Handles the file drop feature in artwork form
	 * @param event DragEvent
	 */
	const handleDrop = async (event: DragEvent) => {
		if( uploading.value || has_uploaded_file.value )
			return

		console.warn('File dropped!!!')
		is_dragging.value = false

		// Extract the files from the DataTransfer object
		const files = event.dataTransfer?.files

		const has_file = !!(files && files.length > 0)
		if (has_file) {
			unsetFile()
			// Convert FileList to Array if needed
			const dropped_files = Array.from(files)

			// Emit the files back to your parent component or store
			if( dropped_files.length && dropped_files[0] ) {
				const f = dropped_files[0]
				setFile(f)

				artwork_preview.value = f.type.startsWith('image/')
					? await convertFileBase64(f)
					: '';
			}
		}
	}


	/**
	 * Handles the file change event when the user select a file
	 * @param event Event
	 */
	const fileChange = async (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		setFile(file)

		artwork_preview.value = file.type.startsWith('image/')
			? await convertFileBase64(file)
			: '';
	}

	const sendItemToServer = async (item : CartItem) => {
		// Send the new item to the API.
		const cart_payload = {
			product_config_mapping_id: item.product_config_mapping_id,
			color_id: item.color_id,
			font_id: item.font_id,
			width: item.width,
			height: item.height,
			quantity: item.quantity,
			lettering_text: item.lettering_text,
			artwork_file: item.artwork_file,
			artwork_file_name: item.artwork_file_name,
			instruction: item.instruction,
			local_identity: item.local_identity,
		}
		const result = await cart_service.sendToServer(cart_payload)

		if( result && result.item && result.item.id && item.local_identity )
			cart_service.updateUploadedItem(item.local_identity, result.item.id)
	}


	/**
	 * Dispatch and save added cart.
	 * @param has_artwork boolean
	 */
	const dispatchItem = async (skip_uploading : boolean = false) => {
		// Validation
		if( uploading.value ) {
			console.warn('Uploading is in the process!')
			return false
		}

		if(!attribute_store.product || !selection_store.product_config_mapping_id ) {
			console.warn('Product data is missing!')
			return false
		}

		else if( !selection_store.size || !selection_store.size.width || !selection_store.size.height ) {
			console.warn('Dimensions is missing!')
			return false;
		}

		else if( !selection_store.quantity || !selection_store.quantity.nr ) {
			console.warn('Quantity is missing!')
			return false;
		}

		// End of validation

		const user = useUsersStore()

		const user_id = ref<number | null>(null)

		if( user && user.state && user.state.id )
			user_id.value = user.state.id


		// 🔥 Creating temporary ID — this will be use when the api already responded
		const item_id = cart_service.generateLocalIdentity();

		const uploaded_file = ref<string>('')

		// Handle uploading the artwork file to S3 when needed.
		const submit_with_file = !skip_uploading && has_uploaded_file.value
		if( submit_with_file ) {

			if(!artwork.value) {
				console.warn("Artwork file is required!")
				return
			}

			// Upload the artwork file to S3 when artwork is provided.
			uploading.value = true
			const { ok, message, filename } = await cart_service.sendToS3(artwork.value)
			uploading.value = false

			if( !ok ) {
				console.warn(message)
				return false
			}

			uploaded_file.value = filename.value
		}

		// Build the cart item payload for local state and API sync.
		const item = {
			id: null,
			user_id: user_id.value,
			product_config_mapping_id: selection_store.product_config_mapping_id,
			url_slug: attribute_store.product.url_slug,
			product: attribute_store.product.name,
			product_thumbnail: attribute_store.product.image,
			color: selection_store.color?.name ?? null,
			color_id: selection_store.color?.id ?? null,
			font: selection_store.font?.label ?? null,
			font_id: selection_store.font?.id ?? null,
			width: selection_store.size.width,
			height: selection_store.size.height,
			quantity: selection_store.quantity.nr,
			cost: selection_store.quantity.price ?? 0,
			lettering_text: selection_store.lettering_text,
			artwork_file: submit_with_file ? uploaded_file.value : null,
			artwork_file_name: submit_with_file ? artwork_file_name.value : null,
			artwork_preview: submit_with_file ? artwork_preview.value : null,
			instruction: instruction.value,
			local_identity: item_id,
		}


		// 🔥 Store new item in local storage before uploading it to our database.
		cart_service.saveItemLocally(item)

		// 🔥 Sending the new item to API
		if( is_authenticated.value )
			sendItemToServer(item)

		return true
	}

	return {
		...cart_service,
		artwork,
		artwork_file_name,
		artwork_file_ext,
		artwork_file_size,
		artwork_preview,
		instruction,
		uploading,
		is_dragging,
		has_uploaded_file,
		is_modal_open: upload_service.is_modal_open,
		openModal: upload_service.openModal,
		closeModal: upload_service.closeModal,
		is_preview_open: upload_service.is_preview_open,
		openPreview: upload_service.openPreview,
		closePreview: upload_service.closePreview,
		dispatchItem,
		handleDrop,
		fileChange,
		unsetFile,
		resetForm,
	}
}