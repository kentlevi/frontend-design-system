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

		<MuHeading variant="6" weight="bold">Tones (smart default)</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Setting a tonal <code>variant</code> alone gives you a matching tone border — no need to repeat the tone on <code>bordered</code>. You can still override <code>bordered</code> for cross-tone or no-border looks.
		</MuText>
		<div class="guide-demo">
			<div class="guide-card-grid">
				<MuCard
					v-for="tone in tone_combos"
					:key="tone"
					:variant="tone"
					padding="md"
					radius="md"
					class="guide-card-item"
				>
					<MuText size="xsmall" weight="semi-bold">{{ tone }}</MuText>
					<MuText size="small" color="var(--text-secondary)">
						<code>variant="{{ tone }}"</code>
					</MuText>
				</MuCard>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Overrides</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Explicit <code>bordered</code> beats the smart default. Useful for "no outline" or cross-tone looks.
		</MuText>
		<div class="guide-demo">
			<div class="guide-card-grid">
				<MuCard variant="success" bordered="none" padding="md" radius="md" class="guide-card-item">
					<MuText size="xsmall" weight="semi-bold">success + bordered="none"</MuText>
					<MuText size="small" color="var(--text-secondary)">Tinted surface, no outline.</MuText>
				</MuCard>
				<MuCard variant="success" bordered="strong" padding="md" radius="md" class="guide-card-item">
					<MuText size="xsmall" weight="semi-bold">success + bordered="strong"</MuText>
					<MuText size="small" color="var(--text-secondary)">Tinted surface, neutral strong outline.</MuText>
				</MuCard>
				<MuCard variant="default" bordered="error" padding="md" radius="md" class="guide-card-item">
					<MuText size="xsmall" weight="semi-bold">default + bordered="error"</MuText>
					<MuText size="small" color="var(--text-secondary)">Neutral surface, error outline.</MuText>
				</MuCard>
				<MuCard variant="primary" bordered="success" padding="md" radius="md" class="guide-card-item">
					<MuText size="xsmall" weight="semi-bold">primary + bordered="success"</MuText>
					<MuText size="small" color="var(--text-secondary)">Cross-tone outline.</MuText>
				</MuCard>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Usage</MuHeading>
		<pre class="guide-card__playground-snippet"><code>&lt;!-- selected / branded card — smart default gives the matching border --&gt;
&lt;MuCard variant="primary" radius="md"&gt;…&lt;/MuCard&gt;

&lt;!-- success state — one prop, no redundancy --&gt;
&lt;MuCard variant="success"&gt;…&lt;/MuCard&gt;

&lt;!-- override: neutral surface with an error-tone outline --&gt;
&lt;MuCard variant="default" bordered="error"&gt;…&lt;/MuCard&gt;

&lt;!-- override: warning tint, no outline --&gt;
&lt;MuCard variant="warning" bordered="none"&gt;…&lt;/MuCard&gt;

&lt;!-- reactive: tone follows state, border can switch independently --&gt;
&lt;MuCard variant="success" :bordered="hasError ? 'error' : 'default'"&gt;…&lt;/MuCard&gt;</code></pre>

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
					<td><code>default | subtle | transparent | primary | success | warning | error</code></td>
					<td><code>default</code></td>
					<td>Surface treatment. <code>default | subtle | transparent</code> are neutral; <code>primary | success | warning | error</code> apply a tonal background using semantic tokens (<code>--brand-primary-bg</code>, <code>--success-bg</code>, etc.).</td>
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
					<td><code>none | default | secondary | strong | primary | success | warning | error</code></td>
					<td><code>default</code></td>
					<td>Border treatment. <code>default | secondary | strong</code> are neutral intensity levels; <code>primary | success | warning | error</code> apply a tonal outline using semantic tokens (<code>--brand-primary</code>, <code>--success</code>, etc.).</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';

const variants = ['default', 'subtle', 'transparent', 'primary', 'success', 'warning', 'error'] as const;
const paddings = ['none', 'xsm', 'sm', 'md', 'lg'] as const;
const radii = ['none', 'sm', 'md', 'lg'] as const;
const bordered_options = ['none', 'default', 'secondary', 'strong', 'primary', 'success', 'warning', 'error'] as const;
const tone_combos = ['primary', 'success', 'warning', 'error'] as const;
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