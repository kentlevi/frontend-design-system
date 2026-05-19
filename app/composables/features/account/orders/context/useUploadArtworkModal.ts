import type { OrderDetailItem } from '~/types/order/order-detail'
import { uploadArtwork } from '~/services/orders/artwork.service'
import { useOrderDetailItemDisplay } from '~/composables/orders/useOrderDetailItemDisplay'
import { useToastStore } from '~/stores/toast'

export type UploadArtworkModalConfig = {
	selected_id: Ref<number | null>
	fetchItems: (order_id: number) => Promise<void>
}

export function useUploadArtworkModal(config: UploadArtworkModalConfig) {

	/**
	 * Stores
	 */
	const toast_store = useToastStore()


	/**
	 * State
	 */
	const is_open = ref(false)
	const selected_item = ref<OrderDetailItem | null>(null)
	const selected_index = ref<number | null>(null)
	const selected_file = ref<File | null>(null)
	const special_instructions = ref('')
	const is_uploading = ref(false)
	const error = ref('')


	/**
	 * Display
	 */
	const {
		product,
		formatted_size,
		formatted_quantity,
		item_number_padded,
	} = useOrderDetailItemDisplay({
		item: selected_item,
		index: selected_index,
	})


	/**
	 * Computed
	 */
	const item_short_label = computed(() =>
		item_number_padded.value ? `Item ${item_number_padded.value}` : null,
	)

	const can_submit = computed(() =>
		selected_file.value !== null && !is_uploading.value,
	)


	/**
	 * Functions
	 */
	function resetSelection() {
		selected_file.value = null
		special_instructions.value = ''
		error.value = ''
	}

	function onFilePicked(files: File[]) {
		error.value = ''
		selected_file.value = files[0] ?? null
	}

	async function submitUpload() {
		if (!selected_item.value || !selected_file.value) return
		if (is_uploading.value) return

		is_uploading.value = true
		error.value = ''

		try {
			const success = await uploadArtwork(
				selected_item.value.cart_item_id,
				selected_file.value,
				special_instructions.value,
			)

			if (success) {
				toast_store.showToastWithTimer({
					message: `Artwork for ${item_short_label.value ?? 'item'} uploaded successfully.`,
					tone: 'primary',
					dismissible: true,
					variant: 'default',
				})

				if (config.selected_id.value !== null) {
					config.fetchItems(config.selected_id.value)
				}
				close_modal()
			} else {
				error.value = 'Upload failed. Please try again.'
				toast_store.showUpdateError()
			}
		} catch (err) {
			console.error('Artwork upload failed', err)
			error.value = 'Upload failed. Please try again.'
			toast_store.showUpdateError()
		} finally {
			is_uploading.value = false
		}
	}

	const open_modal = (item: OrderDetailItem, index: number) => {
		selected_item.value = item
		selected_index.value = index
		resetSelection()
		is_open.value = true
	}

	const close_modal = () => {
		is_open.value = false
		selected_item.value = null
		selected_index.value = null
		resetSelection()
	}


	return {
		is_open,
		selected_item,
		selected_file,
		special_instructions,
		is_uploading,
		error,
		product,
		formatted_size,
		formatted_quantity,
		item_number: item_short_label,
		can_submit,

		open_modal,
		close_modal,
		onFilePicked,
		submitUpload,
	}
}