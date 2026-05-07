<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiLinearWrapper</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Flex layout helper for direction, spacing, and alignment.
		</UiText>

		<UiHeading variant="6" weight="bold">Row</UiHeading>
		<div class="guide-demo">
			<UiLinearWrapper :gap="12" align="center">
				<UiBadge tone="default">Item 1</UiBadge>
				<UiBadge tone="success">Item 2</UiBadge>
				<UiBadge tone="warning">Item 3</UiBadge>
			</UiLinearWrapper>
		</div>

		<UiHeading variant="6" weight="bold">Column</UiHeading>
		<div class="guide-demo">
			<UiLinearWrapper direction="column" :gap="8">
				<UiText>First row</UiText>
				<UiText>Second row</UiText>
				<UiText>Third row</UiText>
			</UiLinearWrapper>
		</div>
	</div>
</template>

<script setup lang="ts">
</script>