import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUploadStore = defineStore('product-upload', () => {
	// Modal visibility
	const is_modal_open = ref(false)
	const is_preview_open = ref(false)

	// Artwork state
	const artwork_file = ref<File | null>(null)
	const artwork_preview = ref<string>('')
	const artwork_file_name = ref<string|null>(null)
	const instruction = ref<string>('')

	// Progress state
	const is_uploading = ref(false)
	const is_dragging = ref(false)

	const openModal = () => {
		is_modal_open.value = true
	}

	const closeModal = () => {
		is_modal_open.value = false
	}

	const openPreview = () => {
		is_preview_open.value = true
	}

	const closePreview = () => {
		is_preview_open.value = false
	}

	const setArtwork = (file: File | null, preview: string = '') => {
		artwork_file.value = file
		artwork_preview.value = preview
		artwork_file_name.value = file?.name ?? null
	}

	const clearArtwork = () => {
		artwork_file.value = null
		artwork_preview.value = ''
		instruction.value = ''
	}

	const reset = () => {
		is_modal_open.value = false
		is_preview_open.value = false
		clearArtwork()
		is_uploading.value = false
		is_dragging.value = false
	}

	return {
		// States
		is_modal_open,
		is_preview_open,
		artwork_file,
		artwork_preview,
		instruction,
		is_uploading,
		is_dragging,

		// Actions
		openModal,
		closeModal,
		openPreview,
		closePreview,
		setArtwork,
		clearArtwork,
		reset
	}
})