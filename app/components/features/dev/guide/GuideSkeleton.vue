<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiSkeleton</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Placeholder loader used while content is fetching.
		</MuText>

		<MuHeading variant="6" weight="bold">Examples</MuHeading>
		<div class="guide-demo">
			<UiSkeleton height="16px" width="40%" />
			<UiSkeleton height="12px" width="85%" />
			<UiSkeleton height="12px" width="72%" />
			<UiSkeleton :width="48" :height="48" circle />
		</div>
	</div>
</template>

<script setup lang="ts">
</script>