import { useCartService } from "~/services/cart/cart.service"
import { useCartStore } from "~/stores/cart"
import { useAttributesStore, useSelectionStore } from "~/stores/product"
import { useUsersStore } from "~/stores/users/users.store"
import { convertFileBase64, formatProductFileSize } from "~/utils/file/file"

export const useArtworkSectionHandler = () => {

	const attribute_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const cart_store = useCartStore()

	const cart_service = useCartService()

	const instruction = ref<string>('')

	const artwork = ref<File | null>(null)

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

	const artwork_preview = ref<string>('')

	const has_uploaded_file = computed(() => !!(artwork?.value && artwork_preview?.value) )

	const uploading = ref<boolean>(false)

	const is_dragging = ref<boolean>(false)

	const setFile = (file: File) => {
		artwork.value = file
	}



	const unsetFile = () => {
		artwork_preview.value = '';
		artwork.value = null;
	}




	/**
	 * Dispatch and save added cart.
	 * @param skip_artwork boolean
	 */
	const dispatchItem = (skip_artwork : boolean = false) => {
		// ⚠️ VALIDATION
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

		// ⚠️ END OF VALIDATION

		const user = useUsersStore()

		const user_id = ref<number | null>(null)

		if( user && user.state && user.state.id )
			user_id.value = user.state.id


		// 🔥 Creating temporary ID — this will be use when the api already responded
		const item_id = crypto.randomUUID();

		// 🔥 Savable object to be sent to API
		const src = {
			id							: item_id,
			product_config_mapping_id	: selection_store.product_config_mapping_id,
			width						: selection_store.size.width,
			height						: selection_store.size.height,
			quantity					: selection_store.quantity.nr,
			lettering_text				: selection_store.lettering_text,
			color_id					: selection_store.color?.id,
			font_id						: selection_store.font?.id,
			artwork						: skip_artwork ? null : null,
			instruction					: skip_artwork ? null : null,
		}
		// 🔥 Used for local storage
		const visual = {
			product		: attribute_store.product.name,
			thumbnail	: attribute_store.product.image,
			size		: `${selection_store.size.width}x${selection_store.size.height}`,
			quantity	: selection_store.quantity.nr ?? 0,
			price		: selection_store.quantity.price ?? 0,
		}

		// const sent_file = ref<string | null>(null)
		

		// 🔥 Store new item in local storage before uploading it to our database.
		cart_store.saveItemLocally({
			id			: item_id,
			submitted	: false,
			user_id		: user_id.value,
			preview		: visual,
			src			: src,
		})

		// 🔥 Sending the new item to API
		cart_service.sendToServer(src)
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

	return {
		...cart_store,
		artwork,
		artwork_file_name,
		artwork_file_ext,
		artwork_file_size,
		artwork_preview,
		instruction,
		uploading,
		is_dragging,
		has_uploaded_file,
		dispatchItem,
		handleDrop,
		fileChange,
		unsetFile,
	}
}