<script setup lang="ts">
import DeleteConfirmModal from '~/components/ui/DeleteConfirmModal.vue';
import { useCartPreviewHandler } from '~/composables/cart/preview/useCartPreviewHandler';

const {
	open_deletion_modal,
	deletionTitle,
	deletionDescription,
	deletionConfirmLabel,
	confirmDeleteItem,
	closeDeleteModal,
} = useCartPreviewHandler('cart-delete-modal-component');
</script>

<template>
	<DeleteConfirmModal
		:model-value="open_deletion_modal"
		:title="deletionTitle"
		:description="deletionDescription"
		:confirm-label="deletionConfirmLabel"
		test-id="cart-item-delete-modal"
		@cancel="closeDeleteModal"
		@confirm="confirmDeleteItem"
	/>
</template>
