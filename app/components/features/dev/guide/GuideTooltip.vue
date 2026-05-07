<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiTooltip</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Floating helper content anchored to a trigger element.
		</UiText>

		<UiHeading variant="6" weight="bold">Example</UiHeading>
		<div class="guide-demo">
			<UiTooltip :open="open" side="top" align="center" tone="neutral">
				<template #trigger>
					<UiButton size="sm" @click="open = !open">
						{{ open ? 'Hide' : 'Show' }} tooltip
					</UiButton>
				</template>
				<UiText size="small" color="var(--text-inverse)">
					Tooltip content can explain a control.
				</UiText>
			</UiTooltip>
		</div>
	</div>
</template>

<script setup lang="ts">
const open = ref(true);
</script>