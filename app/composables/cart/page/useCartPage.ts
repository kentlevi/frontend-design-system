import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useCartService } from '~/services/cart/cart.service'

export const useCartPage = () => {
	const cart_service = useCartService('cart-page')

	const detail_item_id = ref<string | null>(null)
	const artwork_action_file_input_ref = ref<HTMLInputElement | null>(null)
	const pending_artwork_draft_item_id = ref<string | null>(null)
	const pending_artwork_draft_name = ref('')
	const pending_artwork_draft_size_label = ref('')
	const pending_artwork_draft_preview_url = ref('')

	const detail_item = computed(() => {
		const row = cart_service.rows.value.find((item) => item.id === detail_item_id.value) || null
		if (!row || pending_artwork_draft_item_id.value !== row.id) return row

		return {
			...row,
			artworkName: pending_artwork_draft_name.value,
			artworkSizeLabel: pending_artwork_draft_size_label.value,
			artworkPreviewUrl: pending_artwork_draft_preview_url.value,
		}
	})

	const has_items = computed(() => cart_service.rows.value.length > 0)

	const clearPendingArtworkPreviewUrl = () => {
		if (pending_artwork_draft_preview_url.value.startsWith('blob:')) {
			URL.revokeObjectURL(pending_artwork_draft_preview_url.value)
		}
	}

	const clearPendingArtworkDraft = () => {
		clearPendingArtworkPreviewUrl()
		detail_item_id.value = null
		pending_artwork_draft_item_id.value = null
		pending_artwork_draft_name.value = ''
		pending_artwork_draft_preview_url.value = ''
		pending_artwork_draft_size_label.value = ''
	}

	const openItemDetails = (item_id: string) => {
		clearPendingArtworkDraft()
		detail_item_id.value = item_id
	}

	const openArtworkPicker = (item_id: string) => {
		pending_artwork_draft_item_id.value = item_id
		artwork_action_file_input_ref.value?.click()
	}

	const onArtworkActionSelected = async (event: Event) => {
		const target = event.target as HTMLInputElement
		const file = target.files?.[0]
		if (!file || !pending_artwork_draft_item_id.value) return

		clearPendingArtworkPreviewUrl()
		const preview_url = URL.createObjectURL(file)

		pending_artwork_draft_name.value = file.name
		pending_artwork_draft_preview_url.value = preview_url
		detail_item_id.value = pending_artwork_draft_item_id.value
		target.value = ''
	}

	const saveItemArtworkDetails = (payload: {
		artworkName: string
		artworkSizeLabel: string
		artworkPreviewUrl: string
		specialInstructions: string
	}) => {
		if (!detail_item_id.value) return

		cart_service.updateItemArtworkDetails(detail_item_id.value, payload)
		detail_item_id.value = null
	}

	onMounted(() => {
		cart_service.getCartItems(true)
	})

	onBeforeUnmount(() => {
		clearPendingArtworkPreviewUrl()
	})

	return {
		loading: cart_service.loading,
		has_items,
		detail_item_id,
		detail_item,
		artwork_action_file_input_ref,
		openItemDetails,
		openArtworkPicker,
		onArtworkActionSelected,
		saveItemArtworkDetails,
	}
}