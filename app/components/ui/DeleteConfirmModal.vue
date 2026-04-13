<script setup lang="ts">
import type { ButtonTone } from '~/data/ui/buttons';

const props = withDefaults(defineProps<{
	modelValue: boolean;
	title: string;
	description: string;
	iconSrc?: string;
	iconAlt?: string;
	width?: string;
	modalClass?: string;
	cancelLabel?: string;
	confirmLabel?: string;
	confirmTone?: ButtonTone;
	testId?: string;
}>(), {
	iconSrc: '/icons/custom/account/delete-photo-trash.svg',
	iconAlt: '',
	width: '520px',
	modalClass: 'delete-confirm-modal-shell',
	cancelLabel: 'Cancel',
	confirmLabel: 'Delete',
	confirmTone: 'danger',
	testId: 'delete-confirm-modal',
});

const emit = defineEmits<{
	cancel: [];
	confirm: [];
}>();

function closeModal() {
	emit('cancel');
}

function confirmAction() {
	emit('confirm');
}
</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		align="center"
		:width="props.width"
		padding="0"
		gap="0"
		:modal-class="props.modalClass"
		@update:model-value="emit('cancel')"
		@close="emit('cancel')"
	>
		<section class="delete-confirm-modal" :data-testid="props.testId">
			<div class="delete-confirm-modal-copy">
				<div class="delete-confirm-modal-icon-wrap">
					<img
						:src="props.iconSrc"
						:alt="props.iconAlt"
						class="delete-confirm-modal-icon"
					>
				</div>
				<div class="delete-confirm-modal-text-wrap">
					<h3 class="delete-confirm-modal-title">
						{{ props.title }}
					</h3>
					<p class="delete-confirm-modal-text">
						{{ props.description }}
					</p>
				</div>
			</div>

			<footer class="delete-confirm-modal-actions">
				<UiButton
					type="button"
					variant="ghost"
					tone="neutral"
					size="sm"
					:no-hover="true"
					class="delete-confirm-modal-cancel"
					:data-testid="`${props.testId}-cancel`"
					@click="closeModal()"
				>
					{{ props.cancelLabel }}
				</UiButton>
				<UiButton
					type="button"
					variant="filled"
					:tone="props.confirmTone"
					size="md"
					class="delete-confirm-modal-confirm"
					:data-testid="`${props.testId}-confirm`"
					@click="confirmAction"
				>
					{{ props.confirmLabel }}
				</UiButton>
			</footer>
		</section>
	</UiModal>
</template>