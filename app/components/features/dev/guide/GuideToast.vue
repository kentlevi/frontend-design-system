<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiToast</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Transient notification component for status feedback.
		</MuText>

		<MuHeading variant="6" weight="bold">Example</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-row">
				<UiButton size="sm" @click="show('success')">Success</UiButton>
				<UiButton size="sm" tone="danger" @click="show('error')">Error</UiButton>
				<UiButton size="sm" tone="neutral" @click="show('info')">Info</UiButton>
			</div>
			<UiToast
				:visible="visible"
				:tone="tone"
				title="Guide Toast"
				message="This is a sample toast message."
				@close="visible = false"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
const visible = ref(false);
const tone = ref<'success' | 'error' | 'info'>('success');

function show(nextTone: 'success' | 'error' | 'info') {
	tone.value = nextTone;
	visible.value = true;
}
</script>
