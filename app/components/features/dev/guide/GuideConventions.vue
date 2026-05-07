<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">Conventions</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Frontend UI conventions for consistent usage across pages and features.
		</UiText>

		<UiHeading variant="6" weight="bold">Do</UiHeading>
		<div class="guide-demo">
			<UiText>1. Prefer existing <code>Ui*</code> components before custom markup.</UiText>
			<UiText>2. Use component props and variants for styling, not ad hoc classes first.</UiText>
			<UiText>3. Keep pages thin and move orchestration into composables.</UiText>
			<UiText>4. Pair <code>UiFormField</code> with <code>UiInput</code>, <code>UiSelect</code>, <code>UiTextarea</code>.</UiText>
		</div>

		<UiHeading variant="6" weight="bold">Avoid</UiHeading>
		<div class="guide-demo">
			<UiText>1. Duplicating component behavior in feature-specific wrappers.</UiText>
			<UiText>2. Mixing page layout and domain logic inside one large component.</UiText>
			<UiText>3. Hardcoded colors when a UI token/prop already exists.</UiText>
		</div>
	</div>
</template>

<script setup lang="ts">
</script>