<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiLogo</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Brand logo component with variant, color, and size options.
		</UiText>

		<UiHeading variant="6" weight="bold">Default</UiHeading>
		<div class="guide-demo">
			<div class="guide-demo-row">
				<UiLogo name="musticker" variant="full" color="colored" size="lg" />
				<UiLogo name="musticker" variant="mark" color="colored" size="lg" />
			</div>
		</div>

		<UiHeading variant="6" weight="bold">White Variant</UiHeading>
		<div class="guide-demo guide-logo-dark">
			<div class="guide-demo-row">
				<UiLogo name="musticker" variant="full" color="white" size="lg" />
				<UiLogo name="musticker" variant="mark" color="white" size="lg" />
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.guide-logo-dark {
	background: #1f2937;
}
</style>