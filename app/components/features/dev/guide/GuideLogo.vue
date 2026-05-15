<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiLogo</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Brand logo image resolved from <code>/logos/{variant}/{color}/{name}.svg</code>. Supports two variants (full wordmark vs mark only), two color schemes (colored vs white), and three size tokens plus a custom numeric size.
		</MuText>

		<MuHeading variant="6" weight="bold">Variants</MuHeading>
		<div class="guide-demo">
			<div class="guide-row">
				<UiLogo name="musticker" variant="full" color="colored" size="lg" />
				<UiLogo name="musticker" variant="mark" color="colored" size="lg" />
			</div>
		</div>

		<MuHeading variant="6" weight="bold">White (for dark backgrounds)</MuHeading>
		<div class="guide-demo guide-dark">
			<div class="guide-row">
				<UiLogo name="musticker" variant="full" color="white" size="lg" />
				<UiLogo name="musticker" variant="mark" color="white" size="lg" />
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Sizes</MuHeading>
		<div class="guide-demo">
			<div class="guide-row">
				<UiLogo name="musticker" size="sm" />
				<UiLogo name="musticker" size="md" />
				<UiLogo name="musticker" size="lg" />
				<UiLogo name="musticker" :size="80" />
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>name</td><td><code>LogoName</code></td><td>Required</td><td>Logo identifier. Resolved into the path <code>/logos/{variant}/{color}/{name}.svg</code>. Type-checked against the union in <code>~/data/ui/logos</code>.</td></tr>
				<tr><td>variant</td><td><code>'full' | 'mark'</code></td><td><code>'full'</code></td><td><code>'full'</code> = wordmark + icon, <code>'mark'</code> = icon only.</td></tr>
				<tr><td>color</td><td><code>'colored' | 'white'</code></td><td><code>'colored'</code></td><td>Color scheme. <code>'white'</code> for use on dark backgrounds.</td></tr>
				<tr><td>size</td><td><code>'sm' | 'md' | 'lg' | number</code></td><td><code>'lg'</code></td><td>Height in pixels. Token map: <code>sm=24, md=32, lg=48</code>. Pass any number for a custom height.</td></tr>
				<tr><td>width</td><td><code>number | undefined</code></td><td><code>undefined</code></td><td>Force a specific width (px). Default <code>undefined</code> = auto-width preserving SVG aspect ratio.</td></tr>
				<tr><td>loading</td><td><code>'eager' | 'lazy'</code></td><td><code>'lazy'</code></td><td>Native <code>loading</code> attribute. Use <code>'eager'</code> for above-the-fold headers.</td></tr>
				<tr><td>fetchpriority</td><td><code>'high' | 'low' | 'auto'</code></td><td><code>'auto'</code></td><td>Native <code>fetchpriority</code> hint. <code>'high'</code> for the main header logo improves LCP.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots &amp; events</MuHeading>
		<MuText size="small" color="var(--text-secondary)">None — pure image element.</MuText>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li><strong>Above-the-fold logos: <code>loading="eager" fetchpriority="high"</code>.</strong> The default lazy + auto is fine for footer logos but hurts LCP on the header.</li>
			<li><strong>Alt text is auto-generated.</strong> Becomes <code>"{name} logo"</code>. If you need a different alt (e.g. partner branding), wrap in your own <code>&lt;img&gt;</code> instead.</li>
			<li><strong>Adding a new logo.</strong> Drop the SVG into all four buckets — <code>/logos/full/colored/</code>, <code>/logos/full/white/</code>, <code>/logos/mark/colored/</code>, <code>/logos/mark/white/</code> — and add the name to the <code>LogoName</code> union in <code>~/data/ui/logos</code>.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
</script>

<style scoped lang="scss">
.guide-row {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 24px;
}

.guide-dark {
	background: #1f2937;
	padding: 24px;
	border-radius: 8px;
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
