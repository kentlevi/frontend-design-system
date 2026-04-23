<script setup lang="ts">
import DeleteConfirmModal from '~/components/ui/DeleteConfirmModal.vue';
import { useAddressBookDeleteContext } from '~/composables/account/addressBook/context/useAddressBookDeleteContext';
const address_book_delete_context = useAddressBookDeleteContext()
const { t } = useI18n()

const is_delete_modal_open = address_book_delete_context.is_delete_modal_open
const cancelDeleteFlow = address_book_delete_context.cancelDeleteFlow
const confirmDeleteAddress = address_book_delete_context.confirmDeleteAddress
</script>

<template>
	<DeleteConfirmModal
		:model-value="is_delete_modal_open"
		:title="t('account.addressBook.deleteConfirmTitle')"
		:description="t('account.addressBook.deleteConfirmDescription')"
		:cancel-label="t('account.addressBook.cancel')"
		:confirm-label="t('account.addressBook.delete')"
		modal-class="account-address-book-delete-modal-shell"
		width="504px"
		test-id="account-address-book-delete-modal"
		@update:model-value="!$event ? cancelDeleteFlow() : undefined"
		@cancel="cancelDeleteFlow"
		@confirm="confirmDeleteAddress"
	/>
</template>