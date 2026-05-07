<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiButton</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Primary action button component. Supports variants, tones, sizes, icons, loading, and disabled states.
		</UiText>

		<UiHeading variant="6" weight="bold">Variants</UiHeading>
		<div class="guide-demo">
			<div class="guide-demo-row">
				<UiButton variant="filled">Filled</UiButton>
				<UiButton variant="tonal">Tonal</UiButton>
				<UiButton variant="outline">Outline</UiButton>
				<UiButton variant="subtle">Subtle</UiButton>
				<UiButton variant="ghost">Ghost</UiButton>
			</div>
		</div>

		<UiHeading variant="6" weight="bold">Tones</UiHeading>
		<div class="guide-demo">
			<div class="guide-demo-row">
				<UiButton variant="filled" tone="default">Default</UiButton>
				<UiButton variant="filled" tone="neutral">Neutral</UiButton>
				<UiButton variant="filled" tone="accent">Accent</UiButton>
				<UiButton variant="filled" tone="success">Success</UiButton>
				<UiButton variant="filled" tone="danger">Danger</UiButton>
			</div>
		</div>

		<UiHeading variant="6" weight="bold">Sizes</UiHeading>
		<div class="guide-demo">
			<div class="guide-demo-row">
				<UiButton size="sm">Small</UiButton>
				<UiButton size="md">Medium</UiButton>
				<UiButton size="lg">Large</UiButton>
			</div>
		</div>

		<UiHeading variant="6" weight="bold">With Icon</UiHeading>
		<div class="guide-demo">
			<div class="guide-demo-row">
				<UiButton icon="regular-plus" icon-position="left">Add Item</UiButton>
				<UiButton icon="regular-search" icon-position="right">Search</UiButton>
			</div>
		</div>

		<UiHeading variant="6" weight="bold">States</UiHeading>
		<div class="guide-demo">
			<div class="guide-demo-row">
				<UiButton disabled>Disabled</UiButton>
				<UiButton loading>Loading</UiButton>
				<UiButton selected>Selected</UiButton>
			</div>
		</div>

		<UiHeading variant="6" weight="bold">Outline Tones</UiHeading>
		<div class="guide-demo">
			<div class="guide-demo-row">
				<UiButton variant="outline" tone="default">Default</UiButton>
				<UiButton variant="outline" tone="neutral">Neutral</UiButton>
				<UiButton variant="outline" tone="success">Success</UiButton>
				<UiButton variant="outline" tone="danger">Danger</UiButton>
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
					<td><code>filled</code></td>
					<td>Visual style variant.</td>
				</tr>
				<tr>
					<td>tone</td>
					<td><code>default | neutral | accent | success | danger</code></td>
					<td><code>default</code></td>
					<td>Color tone.</td>
				</tr>
				<tr>
					<td>size</td>
					<td><code>sm | md | lg</code></td>
					<td><code>md</code></td>
					<td>Button size.</td>
				</tr>
				<tr>
					<td>icon</td>
					<td><code>string | null</code></td>
					<td><code>null</code></td>
					<td>Icon name.</td>
				</tr>
				<tr>
					<td>iconPosition</td>
					<td><code>left | right</code></td>
					<td><code>left</code></td>
					<td>Icon placement.</td>
				</tr>
				<tr>
					<td>disabled</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Disables interaction.</td>
				</tr>
				<tr>
					<td>loading</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Shows loading spinner.</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
</script>