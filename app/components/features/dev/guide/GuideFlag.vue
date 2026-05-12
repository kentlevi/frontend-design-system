<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiFlag</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Country flag image by ISO code.
		</MuText>

		<MuHeading variant="6" weight="bold">Examples</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-row">
				<div v-for="code in codes" :key="code" class="guide-flag-item">
					<UiFlag :code="code" :size="24" />
					<MuText size="xsmall">{{ code.toUpperCase() }}</MuText>
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
