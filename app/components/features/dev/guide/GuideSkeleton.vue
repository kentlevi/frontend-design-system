<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiSkeleton</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Animated shimmering placeholder block. Mirrors the dimensions of content that's still loading. Renders an <code>aria-hidden</code> div — invisible to screen readers.
		</MuText>

		<MuHeading variant="6" weight="bold">Text lines</MuHeading>
		<div class="guide-demo guide-stack">
			<UiSkeleton height="16px" width="40%" />
			<UiSkeleton height="12px" width="85%" />
			<UiSkeleton height="12px" width="72%" />
		</div>

		<MuHeading variant="6" weight="bold">Avatar &amp; card</MuHeading>
		<div class="guide-demo guide-row">
			<UiSkeleton :width="48" :height="48" circle />
			<UiSkeleton width="240px" height="120px" border-radius="12px" />
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>width</td><td><code>string | number</code></td><td><code>'100%'</code></td><td>CSS length. Numbers become <code>px</code>.</td></tr>
				<tr><td>height</td><td><code>string | number</code></td><td><code>'20px'</code></td><td>CSS length. Numbers become <code>px</code>.</td></tr>
				<tr><td>borderRadius</td><td><code>string | number</code></td><td><code>'8px'</code></td><td>CSS radius. Ignored when <code>circle</code> is true.</td></tr>
				<tr><td>circle</td><td><code>boolean</code></td><td><code>false</code></td><td>Forces <code>border-radius: 50%</code>. Use with equal width &amp; height for avatars.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots &amp; events</MuHeading>
		<MuText size="small" color="var(--text-secondary)">None — pure presentational element.</MuText>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li><strong>Aria-hidden by default.</strong> The skeleton is hidden from assistive tech. The actual loading state should be conveyed elsewhere (e.g. <code>aria-busy</code> on the container).</li>
			<li><strong>Match real dimensions.</strong> Set <code>height</code> to roughly the same line-height as the text it replaces — otherwise the page jumps when content lands.</li>
			<li><strong>The shimmer is CSS-only.</strong> Single 1.4s infinite background-position animation. Zero JS cost, but every skeleton on the page paints every frame.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
</script>

<style scoped lang="scss">
.guide-stack { display: flex; flex-direction: column; gap: 8px; max-width: 400px; }
.guide-row { display: flex; align-items: center; gap: 16px; flex-wrap: wrap; }

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
