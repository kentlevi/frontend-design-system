import { storeToRefs } from 'pinia'
import { useUploadStore } from '~/stores/product/useUploadStore'

export const useUploadService = () => {
	const upload_store = useUploadStore()
	const upload_refs = storeToRefs(upload_store)

	return {
		...upload_refs,
		openModal: upload_store.openModal,
		closeModal: upload_store.closeModal,
		openPreview: upload_store.openPreview,
		closePreview: upload_store.closePreview,
		setArtwork: upload_store.setArtwork,
		clearArtwork: upload_store.clearArtwork,
		reset: upload_store.reset,
	}
}