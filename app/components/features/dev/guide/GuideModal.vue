<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiModal</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Generic modal shell with header, body, and footer slots.
		</UiText>

		<UiHeading variant="6" weight="bold">Example</UiHeading>
		<div class="guide-demo">
			<UiButton @click="open = true">Open Modal</UiButton>

			<UiModal v-model="open" title="Example modal" align="center" width="520px">
				<UiText>
					Use this shell for forms, confirmation dialogs, and focused actions.
				</UiText>

				<template #footer>
					<div class="guide-modal-footer">
						<UiButton variant="ghost" tone="neutral" @click="open = false">Cancel</UiButton>
						<UiButton @click="open = false">Confirm</UiButton>
					</div>
				</template>
			</UiModal>
		</div>
	</div>
</template>

<script setup lang="ts">
const open = ref(false);
</script>

<style scoped lang="scss">
.guide-modal-footer {
	display: flex;
	justify-content: flex-end;
	gap: 8px;
}
</style>