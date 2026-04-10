import { storeToRefs } from 'pinia'
import { useOrdersStore } from '~/stores/account/useOrdersStore'

export const useOrdersService = () => {
	const orders_store = useOrdersStore()
	const orders_refs = storeToRefs(orders_store)

	return {
		...orders_refs,
		is_upload_modal_open: orders_refs.is_upload_modal_open,
		active_upload_item: orders_refs.active_upload_item,
		openUploadModal: orders_store.openUploadModal,
		closeUploadModal: orders_store.closeUploadModal,
	}
}