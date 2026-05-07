<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiRadio</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Radio input for single choice selections.
		</UiText>

		<UiHeading variant="6" weight="bold">Example Group</UiHeading>
		<div class="guide-demo">
			<div class="guide-radio-group">
				<UiRadio v-model="selected" name="plan" value="starter" label="Starter" />
				<UiRadio v-model="selected" name="plan" value="pro" label="Pro" />
				<UiRadio v-model="selected" name="plan" value="enterprise" label="Enterprise" />
			</div>
			<UiText size="small">Selected: <code>{{ selected }}</code></UiText>
		</div>
	</div>
</template>

<script setup lang="ts">
const selected = ref('starter');
</script>

<style scoped lang="scss">
.guide-radio-group {
	display: flex;
	flex-direction: column;
	gap: 10px;
}
</style>