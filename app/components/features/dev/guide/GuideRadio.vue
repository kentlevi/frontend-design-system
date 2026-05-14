<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiRadio</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Radio input for single choice selections.
		</MuText>

		<MuHeading variant="6" weight="bold">Example Group</MuHeading>
		<div class="guide-demo">
			<div class="guide-radio-group">
				<UiRadio v-model="selected" name="plan" value="starter" label="Starter" />
				<UiRadio v-model="selected" name="plan" value="pro" label="Pro" />
				<UiRadio v-model="selected" name="plan" value="enterprise" label="Enterprise" />
			</div>
			<MuText size="small">Selected: <code>{{ selected }}</code></MuText>
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