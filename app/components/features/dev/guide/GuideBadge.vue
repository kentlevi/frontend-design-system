<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiBadge</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Inline status indicator. Supports variants, tones, and sizes.
		</UiText>

		<UiHeading variant="6" weight="bold">Variants × Tones</UiHeading>
		<div class="guide-demo">
			<div class="guide-demo-grid">
				<div v-for="variant in variants" :key="variant" class="guide-demo-col">
					<UiText size="xsmall" weight="semi-bold">{{ variant }}</UiText>
					<UiBadge :variant="variant" tone="default">Default</UiBadge>
					<UiBadge :variant="variant" tone="success">Success</UiBadge>
					<UiBadge :variant="variant" tone="danger">Danger</UiBadge>
					<UiBadge :variant="variant" tone="warning">Warning</UiBadge>
				</div>
			</div>
		</div>

		<UiHeading variant="6" weight="bold">Sizes</UiHeading>
		<div class="guide-demo">
			<div class="guide-demo-row">
				<UiBadge size="sm" tone="success">Small</UiBadge>
				<UiBadge size="md" tone="success">Medium</UiBadge>
			</div>
		</div>

		<UiHeading variant="6" weight="bold">Properties</UiHeading>
		<table class="guide-table">
			<thead>
				<tr>
					<th>Prop</th>
					<th>Type</th>
					<th>Default</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>variant</td>
					<td><code>filled | tonal | outline | subtle | ghost</code></td>
					<td><code>tonal</code></td>
					<td>Visual style.</td>
				</tr>
				<tr>
					<td>tone</td>
					<td><code>default | success | danger | warning</code></td>
					<td><code>default</code></td>
					<td>Color tone.</td>
				</tr>
				<tr>
					<td>size</td>
					<td><code>sm | md</code></td>
					<td><code>md</code></td>
					<td>Badge size.</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
const variants = ['filled', 'tonal', 'outline'] as const;
</script>

<style lang="scss" scoped>
.guide-demo-grid {
	display: flex;
	gap: 32px;
	flex-wrap: wrap;
}

.guide-demo-col {
	display: flex;
	flex-direction: column;
	gap: 8px;
	align-items: flex-start;
}
</style>