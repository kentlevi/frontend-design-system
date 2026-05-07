<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiFlag</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Country flag image by ISO code.
		</UiText>

		<UiHeading variant="6" weight="bold">Examples</UiHeading>
		<div class="guide-demo">
			<div class="guide-demo-row">
				<div v-for="code in codes" :key="code" class="guide-flag-item">
					<UiFlag :code="code" :size="24" />
					<UiText size="xsmall">{{ code.toUpperCase() }}</UiText>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const codes = ['us', 'jp', 'ph', 'ca'] as const;
</script>

<style scoped lang="scss">
.guide-flag-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
}
</style>