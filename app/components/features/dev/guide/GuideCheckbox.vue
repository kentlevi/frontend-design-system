<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiCheckbox</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Checkbox input with label, size, and state support.
		</MuText>

		<MuHeading variant="6" weight="bold">Examples</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-column">
				<UiCheckbox v-model="checked">Accept terms</UiCheckbox>
				<UiCheckbox v-model="checked_sm" size="sm">Small checkbox</UiCheckbox>
				<UiCheckbox :model-value="true" state="success" disabled>
					Disabled success
				</UiCheckbox>
				<UiCheckbox :model-value="false" state="error">Error state</UiCheckbox>
			</div>
			<MuText size="small">Checked value: <code>{{ checked }}</code></MuText>
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