import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { AccountOrderLineItem } from '~/types/account/orders';

export const useOrdersStore = defineStore('account-orders', () => {
	// Modal visibility
	const is_upload_modal_open = ref(false);
	const active_upload_item = ref<AccountOrderLineItem | null>(null);

	const openUploadModal = (item?: AccountOrderLineItem) => {
		active_upload_item.value = item || null;
		is_upload_modal_open.value = true;
	};

	const closeUploadModal = () => {
		is_upload_modal_open.value = false;
		active_upload_item.value = null;
	};

	return {
		// States
		is_upload_modal_open,
		active_upload_item,

		// Actions
		openUploadModal,
		closeUploadModal,
	};
});