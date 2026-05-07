<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiHeading</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Semantic heading component. Renders h1–h6 based on the variant prop.
		</UiText>

		<UiHeading variant="6" weight="bold">Variants (h1 – h6)</UiHeading>
		<div class="guide-demo">
			<UiHeading variant="1">Heading 1</UiHeading>
			<UiHeading variant="2">Heading 2</UiHeading>
			<UiHeading variant="3">Heading 3</UiHeading>
			<UiHeading variant="4">Heading 4</UiHeading>
			<UiHeading variant="5">Heading 5</UiHeading>
			<UiHeading variant="6">Heading 6</UiHeading>
		</div>

		<UiHeading variant="6" weight="bold">Weights</UiHeading>
		<div class="guide-demo">
			<UiHeading variant="4" weight="light">Light</UiHeading>
			<UiHeading variant="4" weight="regular">Regular</UiHeading>
			<UiHeading variant="4" weight="medium">Medium</UiHeading>
			<UiHeading variant="4" weight="semi-bold">Semi Bold</UiHeading>
			<UiHeading variant="4" weight="bold">Bold</UiHeading>
		</div>

		<UiHeading variant="6" weight="bold">Custom Color</UiHeading>
		<div class="guide-demo">
			<UiHeading variant="5" color="var(--brand-primary)">Brand Primary Heading</UiHeading>
			<UiHeading variant="5" color="var(--error)">Error Heading</UiHeading>
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
					<td><code>'1' | '2' | '3' | '4' | '5' | '6'</code></td>
					<td><code>'2'</code></td>
					<td>Heading level (h1–h6).</td>
				</tr>
				<tr>
					<td>weight</td>
					<td><code>thin | extra-light | light | regular | medium | semi-bold | bold</code></td>
					<td><code>regular</code></td>
					<td>Font weight.</td>
				</tr>
				<tr>
					<td>color</td>
					<td><code>string</code></td>
					<td><code>''</code></td>
					<td>Custom text color (CSS value or token).</td>
				</tr>
				<tr>
					<td>align</td>
					<td><code>left | right | center | inherit</code></td>
					<td><code>inherit</code></td>
					<td>Text alignment.</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
</script>