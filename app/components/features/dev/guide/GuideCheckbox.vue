<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiCheckbox</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Checkbox input with label, size, and state support.
		</UiText>

		<UiHeading variant="6" weight="bold">Examples</UiHeading>
		<div class="guide-demo">
			<div class="guide-demo-column">
				<UiCheckbox v-model="checked">Accept terms</UiCheckbox>
				<UiCheckbox v-model="checked_sm" size="sm">Small checkbox</UiCheckbox>
				<UiCheckbox :model-value="true" state="success" disabled>
					Disabled success
				</UiCheckbox>
				<UiCheckbox :model-value="false" state="error">Error state</UiCheckbox>
			</div>
			<UiText size="small">Checked value: <code>{{ checked }}</code></UiText>
		</div>
	</div>
</template>

<script setup lang="ts">
const checked = ref(false);
const checked_sm = ref(true);
</script>

<style scoped lang="scss">
.guide-demo-column {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>