<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiSkeleton</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Placeholder loader used while content is fetching.
		</UiText>

		<UiHeading variant="6" weight="bold">Examples</UiHeading>
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