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
	'update:modelValue': [value: boolean];
	cancel: [];
	confirm: [];
}>();

function closeModal() {
	emit('update:modelValue', false);
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
		@update:model-value="emit('update:modelValue', $event)"
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
					@click="closeModal"
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

<style scoped lang="scss">
.delete-confirm-modal {
	background: var(--contrast-light);
	border-radius: 16px;
	overflow: hidden;
	display: flex;
	flex-direction: column;
	width: 100%;

	.delete-confirm-modal-copy {
		width: 100%;
		box-sizing: border-box;
		padding: 24px;
		display: grid;
		grid-template-columns: 52px minmax(0, 1fr);
		align-items: center;
		column-gap: 24px;
	}

	.delete-confirm-modal-icon-wrap {
		width: 52px;
		height: 52px;
		flex-shrink: 0;
		display: grid;
		place-items: center;
	}

	.delete-confirm-modal-icon {
		display: block;
		width: 48px;
		height: 48px;
	}

	.delete-confirm-modal-text-wrap {
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.delete-confirm-modal-title {
		font-size: var(--type-size-300);
		line-height: var(--type-line-300);
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
	}

	.delete-confirm-modal-text {
		color: var(--text-secondary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
	}

	.delete-confirm-modal-actions {
		width: 100%;
		box-sizing: border-box;
		border-top: 1px solid var(--border-default);
		padding: 16px 24px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		gap: 18px;
	}
}

:global(.delete-confirm-modal-shell) {
	border-radius: 16px;
	overflow: hidden;
	max-width: 520px;
}
</style>