<script setup lang="ts">
import DeleteConfirmModal from '~/components/ui/DeleteConfirmModal.vue';
import { useAddressBookDeleteConfirmModal } from '~/composables/account/addressBook/useAddressBookDeleteConfirmModal';
const {
	translate,

	is_delete_modal_open,

	cancelDeleteFlow,
	confirmDeleteAddress,
} = useAddressBookDeleteConfirmModal()
</script>

<template>
	<DeleteConfirmModal
		:model-value="is_delete_modal_open"
		:title="translate('account.addressBook.deleteConfirmTitle')"
		:description="translate('account.addressBook.deleteConfirmDescription')"
		:cancel-label="translate('account.addressBook.cancel')"
		:confirm-label="translate('account.addressBook.delete')"
		modal-class="account-address-book-delete-modal-shell"
		width="504px"
		test-id="account-address-book-delete-modal"
		@update:model-value="!$event ? cancelDeleteFlow() : undefined"
		@cancel="cancelDeleteFlow"
		@confirm="confirmDeleteAddress"
	/>
</template>