<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuCard</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Container component with variant, padding, radius, and border options.
		</MuText>

		<MuHeading variant="6" weight="bold">Variants</MuHeading>
		<div class="guide-demo">
			<div class="guide-card-grid">
				<MuCard
					v-for="variant in variants"
					:key="variant"
					:variant="variant"
					padding="md"
					radius="md"
					bordered="default"
					class="guide-card-item"
				>
					<MuText size="xsmall" weight="semi-bold">{{ variant }}</MuText>
					<MuText size="small" color="var(--text-secondary)">
						Card content preview.
					</MuText>
				</MuCard>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Padding</MuHeading>
		<div class="guide-demo">
			<div class="guide-card-grid">
				<MuCard
					v-for="padding in paddings"
					:key="padding"
					variant="default"
					:padding="padding"
					radius="md"
					bordered="default"
					class="guide-card-item"
				>
					<MuText size="xsmall" weight="semi-bold">padding: {{ padding }}</MuText>
					<MuText size="small" color="var(--text-secondary)">
						Spacing inside the card.
					</MuText>
				</MuCard>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Radius</MuHeading>
		<div class="guide-demo">
			<div class="guide-card-grid">
				<MuCard
					v-for="radius in radii"
					:key="radius"
					variant="default"
					padding="md"
					:radius="radius"
					bordered="default"
					class="guide-card-item"
				>
					<MuText size="xsmall" weight="semi-bold">radius: {{ radius }}</MuText>
				</MuCard>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Bordered</MuHeading>
		<div class="guide-demo">
			<div class="guide-card-grid">
				<MuCard
					v-for="bordered in bordered_options"
					:key="bordered"
					variant="default"
					padding="md"
					radius="md"
					:bordered="bordered"
					class="guide-card-item"
				>
					<MuText size="xsmall" weight="semi-bold">bordered: {{ bordered }}</MuText>
				</MuCard>
			</div>
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
					<td><code>default | subtle | transparent</code></td>
					<td><code>default</code></td>
					<td>Visual background style.</td>
				</tr>
				<tr>
					<td>padding</td>
					<td><code>none | xsm | sm | md | lg</code></td>
					<td><code>md</code></td>
					<td>Inner spacing.</td>
				</tr>
				<tr>
					<td>radius</td>
					<td><code>none | sm | md | lg</code></td>
					<td><code>md</code></td>
					<td>Corner roundness.</td>
				</tr>
				<tr>
					<td>bordered</td>
					<td><code>none | default | secondary | strong</code></td>
					<td><code>default</code></td>
					<td>Border style intensity.</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';

const variants = ['default', 'subtle', 'transparent'] as const;
const paddings = ['none', 'xsm', 'sm', 'md', 'lg'] as const;
const radii = ['none', 'sm', 'md', 'lg'] as const;
const bordered_options = ['none', 'default', 'secondary', 'strong'] as const;
</script>

<style scoped lang="scss">
.guide-card-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 12px;
}

.guide-card-item {
	display: flex;
	flex-direction: column;
	gap: 8px;
}
</style>