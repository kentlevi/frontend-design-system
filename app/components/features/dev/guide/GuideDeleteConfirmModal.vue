<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiDeleteConfirmModal</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Prebuilt confirmation modal for destructive actions.
		</MuText>

		<MuHeading variant="6" weight="bold">Example</MuHeading>
		<div class="guide-demo">
			<UiButton tone="danger" @click="is_open = true">Open Delete Modal</UiButton>
			<UiDeleteConfirmModal
				:model-value="is_open"
				title="Delete Item"
				description="This action cannot be undone."
				cancel-label="Cancel"
				confirm-label="Delete"
				@cancel="is_open = false"
				@confirm="handleConfirm"
			/>
			<MuText size="small">Last action: <code>{{ last_action }}</code></MuText>
		</div>
	</div>
</template>

<script setup lang="ts">
const is_open = ref(false);
const last_action = ref('none');

function handleConfirm() {
	last_action.value = 'confirmed';
	is_open.value = false;
}
</script>
