<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">Conventions</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Frontend UI conventions for consistent usage across pages and features.
		</MuText>

		<MuHeading variant="6" weight="bold">Do</MuHeading>
		<div class="guide-demo">
			<MuText>1. Prefer existing <code>Ui*</code> components before custom markup.</MuText>
			<MuText>2. Use component props and variants for styling, not ad hoc classes first.</MuText>
			<MuText>3. Keep pages thin and move orchestration into composables.</MuText>
			<MuText>4. Pair <code>UiFormField</code> with <code>UiInput</code>, <code>UiSelect</code>, <code>MuTextarea</code>.</MuText>
		</div>

		<MuHeading variant="6" weight="bold">Avoid</MuHeading>
		<div class="guide-demo">
			<MuText>1. Duplicating component behavior in feature-specific wrappers.</MuText>
			<MuText>2. Mixing page layout and domain logic inside one large component.</MuText>
			<MuText>3. Hardcoded colors when a UI token/prop already exists.</MuText>
		</div>
	</div>
</template>

<script setup lang="ts">
</script>
