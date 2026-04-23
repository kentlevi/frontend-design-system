<script setup lang="ts">
import DeleteConfirmModal from '~/components/ui/DeleteConfirmModal.vue';
import { useCartPreviewHandler } from '~/composables/cart/preview/useCartPreviewHandler';
import { useCartDeletion } from '~/composables/cart/useCartDeletion';

const {
	deletionTitle,
	deletionDescription,
	deletionConfirmLabel,
} = useCartPreviewHandler('cart-delete-modal-component');


const {
	open_deletion_modal,
	cancelDeletion,
	confirmDeletion,
} = useCartDeletion('delete-item-modal')
</script>

<template>
	<DeleteConfirmModal
		:model-value="open_deletion_modal"
		:title="deletionTitle"
		:description="deletionDescription"
		:confirm-label="deletionConfirmLabel"
		test-id="cart-item-delete-modal"
		@cancel="cancelDeletion"
		@confirm="confirmDeletion"
	/>
</template>