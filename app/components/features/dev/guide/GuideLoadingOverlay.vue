<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiLoadingOverlay</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Overlay loader for page or container loading states.
		</MuText>

		<MuHeading variant="6" weight="bold">Container Overlay</MuHeading>
		<div class="guide-demo">
			<div class="guide-overlay-demo">
				<div class="guide-overlay-content">
					<MuText>Simulated card content beneath loading state.</MuText>
				</div>
				<UiLoadingOverlay
					:visible="visible"
					position="absolute"
					variant="modal"
					label="Loading"
					show-copy
				>
					<div class="guide-loader-dot" />
				</UiLoadingOverlay>
			</div>
			<UiButton size="sm" @click="visible = !visible">
				{{ visible ? 'Hide' : 'Show' }} overlay
			</UiButton>
		</div>
	</div>
</template>

<script setup lang="ts">
const visible = ref(true);
</script>

<style scoped lang="scss">
.guide-overlay-demo {
	position: relative;
	height: 180px;
	border: 1px dashed var(--border-default, #e4e7ec);
	border-radius: 10px;
	overflow: hidden;
}

.guide-overlay-content {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
	background: var(--contrast-light);
}

.guide-loader-dot {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	background: var(--brand-primary);
	animation: guide-pulse 0.9s ease-in-out infinite alternate;
}

@keyframes guide-pulse {
	from { transform: scale(0.8); opacity: 0.5; }
	to { transform: scale(1); opacity: 1; }
}
</style>