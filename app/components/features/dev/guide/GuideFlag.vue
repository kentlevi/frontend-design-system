<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiFlag</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Country flag image rendered from <code>/flags/{CODE}.svg</code>. ISO-style code in, SVG out. Lazy-loaded and async-decoded for performance on long country lists.
		</MuText>

		<MuHeading variant="6" weight="bold">Common codes</MuHeading>
		<div class="guide-demo">
			<div class="guide-row">
				<div v-for="code in codes" :key="code" class="guide-flag-item">
					<UiFlag :code="code" :size="24" />
					<MuText size="xsmall">{{ code.toUpperCase() }}</MuText>
				</div>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Sizes</MuHeading>
		<div class="guide-demo">
			<div class="guide-row">
				<UiFlag code="us" :size="16" />
				<UiFlag code="us" :size="24" />
				<UiFlag code="us" :size="40" />
				<UiFlag code="us" :size="64" />
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>code</td><td><code>FlagCode</code></td><td>Required</td><td>Two-letter country code (lowercase). Resolved to <code>/flags/{CODE.toUpperCase()}.svg</code>. Type-checked against the union in <code>~/data/ui/flags</code>.</td></tr>
				<tr><td>alt</td><td><code>string | undefined</code></td><td><code>'Flag of {CODE}'</code></td><td>Image alt text. Defaults to a localized-friendly fallback if omitted.</td></tr>
				<tr><td>size</td><td><code>number | undefined</code></td><td><code>24</code></td><td>Sets both <code>width</code> and <code>height</code> attributes (px). Flag is always square.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots &amp; events</MuHeading>
		<MuText size="small" color="var(--text-secondary)">None — pure image element.</MuText>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li><strong>Codes are type-restricted.</strong> <code>FlagCode</code> is a string-literal union — passing a country with no SVG in <code>/public/flags/</code> won't typecheck. Add the asset + union entry together.</li>
			<li><strong>Always square.</strong> <code>size</code> sets one number for both dimensions. If you need a true-aspect flag (e.g. 3:2), wrap in a sized container and let the SVG <code>viewBox</code> handle it via CSS.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

const codes = ['us', 'jp', 'ph', 'ca', 'kr', 'gb', 'fr', 'de'] as const;
</script>

<style scoped lang="scss">
.guide-row {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 16px;
}

.guide-flag-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
}

.guide-notes {
	margin: 0;
	padding-left: 20px;
	display: flex;
	flex-direction: column;
	gap: 8px;
	color: var(--text-secondary);
	font-size: var(--body-sm);
	line-height: 1.5;
	strong { color: var(--text-primary); }
}

code {
	background: var(--gray-20);
	padding: 2px 6px;
	border-radius: 4px;
	font-family: monospace;
	font-size: 0.85em;
	color: var(--error);
}
</style>
