<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuHeading</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Semantic heading component. Renders h1–h6 based on the variant prop.
		</MuText>

		<MuHeading variant="6" weight="bold">Variants (h1 – h6)</MuHeading>
		<div class="guide-demo">
			<MuHeading variant="1">Heading 1</MuHeading>
			<MuHeading variant="2">Heading 2</MuHeading>
			<MuHeading variant="3">Heading 3</MuHeading>
			<MuHeading variant="4">Heading 4</MuHeading>
			<MuHeading variant="5">Heading 5</MuHeading>
			<MuHeading variant="6">Heading 6</MuHeading>
		</div>

		<MuHeading variant="6" weight="bold">Weights</MuHeading>
		<div class="guide-demo">
			<MuHeading variant="4" weight="light">Light</MuHeading>
			<MuHeading variant="4" weight="regular">Regular</MuHeading>
			<MuHeading variant="4" weight="medium">Medium</MuHeading>
			<MuHeading variant="4" weight="semi-bold">Semi Bold</MuHeading>
			<MuHeading variant="4" weight="bold">Bold</MuHeading>
		</div>

		<MuHeading variant="6" weight="bold">Custom Color</MuHeading>
		<div class="guide-demo">
			<MuHeading variant="5" color="var(--brand-primary)">Brand Primary Heading</MuHeading>
			<MuHeading variant="5" color="var(--error)">Error Heading</MuHeading>
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
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
