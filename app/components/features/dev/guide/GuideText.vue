<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuText</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Typography primitive. Renders as <code>&lt;p&gt;</code> or <code>&lt;span&gt;</code> with semantic size, weight, alignment, and color tokens.
		</MuText>

		<MuHeading variant="6" weight="bold">Sizes</MuHeading>
		<div class="guide-demo guide-stack">
			<MuText size="xlarge">xlarge text</MuText>
			<MuText size="large">large text</MuText>
			<MuText size="medium">medium text (default)</MuText>
			<MuText size="small">small text</MuText>
			<MuText size="xsmall">xsmall text</MuText>
		</div>

		<MuHeading variant="6" weight="bold">Weights</MuHeading>
		<div class="guide-demo guide-stack">
			<MuText weight="thin">Thin</MuText>
			<MuText weight="extra-light">Extra light</MuText>
			<MuText weight="light">Light</MuText>
			<MuText weight="regular">Regular (default)</MuText>
			<MuText weight="medium">Medium</MuText>
			<MuText weight="semi-bold">Semi-bold</MuText>
			<MuText weight="bold">Bold</MuText>
		</div>

		<MuHeading variant="6" weight="bold">Color formats</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			<code>color</code> accepts bare token names (auto-wrapped in <code>var(--…)</code>), full CSS variables, hex, rgb, hsl, or any CSS color string.
		</MuText>
		<div class="guide-demo guide-stack">
			<MuText color="error-base">color="error-base" → var(--error-base)</MuText>
			<MuText color="--text-secondary">color="--text-secondary" → var(--text-secondary)</MuText>
			<MuText color="var(--success)">color="var(--success)" passed through</MuText>
			<MuText color="#D42941">color="#D42941" — hex passes through</MuText>
		</div>

		<MuHeading variant="6" weight="bold">Variants &amp; alignment</MuHeading>
		<div class="guide-demo guide-stack">
			<MuText variant="p" align="center">variant="p" align="center" — renders as &lt;p&gt;</MuText>
			<div>Inline use: <MuText variant="span" weight="bold">variant="span"</MuText> in flow.</div>
			<MuText align="right">align="right"</MuText>
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>variant</td><td><code>'p' | 'span'</code></td><td><code>'p'</code></td><td>Underlying HTML element. Use <code>'span'</code> for inline usage inside another text block.</td></tr>
				<tr><td>size</td><td><code>'xlarge' | 'large' | 'medium' | 'small' | 'xsmall'</code></td><td><code>'medium'</code></td><td>Semantic size class. Each maps to a CSS rule (<code>.text-xlarge</code> etc.).</td></tr>
				<tr><td>weight</td><td><code>'thin' | 'extra-light' | 'light' | 'regular' | 'medium' | 'semi-bold' | 'bold'</code></td><td><code>'regular'</code></td><td>Font weight class.</td></tr>
				<tr><td>color</td><td><code>string</code></td><td><code>''</code></td><td>Bare token → wrapped in <code>var(--…)</code>. Strings starting with <code>var(</code>, <code>#</code>, <code>rgb(</code>, <code>rgba(</code>, <code>hsl(</code>, <code>hsla(</code>, or <code>--</code> are forwarded as-is or with a single <code>var()</code> wrap.</td></tr>
				<tr><td>align</td><td><code>'left' | 'right' | 'center' | 'inherit'</code></td><td><code>'inherit'</code></td><td>Text alignment. <code>'inherit'</code> emits no class so the parent's alignment wins.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Slot</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>default</td><td>Text content. Can nest other MuText (use <code>variant="span"</code> for inline children).</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li><strong>Inline vs block.</strong> Default <code>variant="p"</code> renders a block <code>&lt;p&gt;</code> — it can't sit inside another <code>&lt;p&gt;</code> (HTML rule). For mid-paragraph emphasis, set <code>variant="span"</code>.</li>
			<li><strong>Color token sugar.</strong> <code>color="abyss-40"</code> becomes <code>color: var(--abyss-40)</code>. If the variable doesn't exist, the value silently becomes <code>currentColor</code>. Spell-check your token names.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
</script>

<style scoped lang="scss">
.guide-stack { display: flex; flex-direction: column; gap: 6px; }

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
