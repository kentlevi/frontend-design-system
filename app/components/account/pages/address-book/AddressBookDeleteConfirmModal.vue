<script setup lang="ts">
import DeleteConfirmModal from '~/components/ui/DeleteConfirmModal.vue';
import { useAddressBookDeleteContext } from '~/composables/account/addressBook/context/useAddressBookDeleteContext';

const address_book_delete_context = useAddressBookDeleteContext()

const is_delete_modal_open = address_book_delete_context.is_delete_modal_open
const cancelDeleteFlow = address_book_delete_context.cancelDeleteFlow
const confirmDeleteAddress = address_book_delete_context.confirmDeleteAddress
</script>

<template>
	<DeleteConfirmModal
		:model-value="is_delete_modal_open"
		title="Are you sure you want to delete this address?"
		description="This address will be permanently removed from your address book."
		modal-class="account-address-book-delete-modal-shell"
		test-id="account-address-book-delete-modal"
		@update:model-value="!$event ? cancelDeleteFlow() : undefined"
		@cancel="cancelDeleteFlow"
		@confirm="confirmDeleteAddress"
	/>
</template>