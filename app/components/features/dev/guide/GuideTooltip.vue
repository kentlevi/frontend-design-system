<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiTooltip</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Floating helper content anchored to a trigger element.
		</MuText>

		<MuHeading variant="6" weight="bold">Example</MuHeading>
		<div class="guide-demo">
			<UiTooltip :open="open" side="top" align="center" tone="neutral">
				<template #trigger>
					<UiButton size="sm" @click="open = !open">
						{{ open ? 'Hide' : 'Show' }} tooltip
					</UiButton>
				</template>
				<MuText size="small" color="var(--text-inverse)">
					Tooltip content can explain a control.
				</MuText>
			</UiTooltip>
		</div>
	</div>
</template>

<script setup lang="ts">
const open = ref(true);
</script>