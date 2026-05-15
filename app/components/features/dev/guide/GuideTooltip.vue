<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiTooltip</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Floating helper content anchored to a trigger element. Side + alignment positioning, three tones, viewport-edge auto-shift, and a separate mobile side override.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic</MuHeading>
		<div class="guide-demo">
			<UiTooltip :open="basic_open" side="top" align="center" tone="neutral">
				<template #trigger>
					<UiButton size="sm" @click="basic_open = !basic_open">
						{{ basic_open ? 'Hide' : 'Show' }} tooltip
					</UiButton>
				</template>
				<MuText size="small" color="var(--text-inverse)">Tooltip content goes here.</MuText>
			</UiTooltip>
		</div>

		<MuHeading variant="6" weight="bold">Sides &amp; tones</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			<code>side</code> picks the anchor side. <code>tone</code> picks the color (default = info, danger = red, neutral = dark gray).
		</MuText>
		<div class="guide-demo guide-row">
			<UiTooltip :open="true" side="top" tone="default">
				<template #trigger><span class="guide-chip">top default</span></template>
				<MuText size="small" color="var(--text-inverse)">Default tone</MuText>
			</UiTooltip>
			<UiTooltip :open="true" side="bottom" tone="danger">
				<template #trigger><span class="guide-chip">bottom danger</span></template>
				<MuText size="small" color="var(--text-inverse)">Danger tone</MuText>
			</UiTooltip>
			<UiTooltip :open="true" side="right" tone="neutral">
				<template #trigger><span class="guide-chip">right neutral</span></template>
				<MuText size="small" color="var(--text-inverse)">Neutral tone</MuText>
			</UiTooltip>
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>open</td><td><code>boolean</code></td><td><code>false</code></td><td>Controls visibility. Tooltip is fully controlled — no internal hover/focus handling.</td></tr>
				<tr><td>side</td><td><code>'top' | 'right' | 'bottom' | 'left'</code></td><td><code>'right'</code></td><td>Anchor side relative to trigger.</td></tr>
				<tr><td>align</td><td><code>'start' | 'center' | 'end'</code></td><td><code>'center'</code></td><td>Alignment along the chosen side.</td></tr>
				<tr><td>mobileSide</td><td><code>'top' | 'right' | 'bottom' | 'left' | null</code></td><td><code>null</code></td><td>When set, overrides <code>side</code> on mobile breakpoints (see <code>data-mobile-side</code>).</td></tr>
				<tr><td>tone</td><td><code>'default' | 'neutral' | 'danger'</code></td><td><code>'default'</code></td><td>Color variant.</td></tr>
				<tr><td>offset</td><td><code>number | string</code></td><td><code>10</code></td><td>Gap (px) between trigger and tooltip.</td></tr>
				<tr><td>slideDistance</td><td><code>number | string</code></td><td><code>24</code></td><td>Distance the tooltip slides in from when opening.</td></tr>
				<tr><td>role</td><td><code>string</code></td><td><code>'status'</code></td><td>ARIA role on the content. Use <code>'tooltip'</code> for true tooltips, <code>'status'</code> for popovers.</td></tr>
				<tr><td>contentTestid</td><td><code>string</code></td><td><code>''</code></td><td>Adds <code>data-testid</code> to the content for testing.</td></tr>
				<tr><td>contentClass</td><td><code>string</code></td><td><code>''</code></td><td>Extra class on <code>.ui-tooltip-content</code>.</td></tr>
				<tr><td>contentWidth</td><td><code>string</code></td><td><code>''</code></td><td>CSS length → <code>--ui-tooltip-content-width</code>.</td></tr>
				<tr><td>contentMinWidth</td><td><code>string</code></td><td><code>''</code></td><td>CSS length → <code>--ui-tooltip-content-min-width</code>.</td></tr>
				<tr><td>contentMaxWidth</td><td><code>string</code></td><td><code>''</code></td><td>CSS length → <code>--ui-tooltip-content-max-width</code>.</td></tr>
				<tr><td>mobileContentWidth</td><td><code>string</code></td><td><code>''</code></td><td>CSS length → <code>--ui-tooltip-mobile-content-width</code>.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Slot</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>trigger</td><td>The anchor element. The tooltip positions itself relative to this.</td></tr>
				<tr><td>default</td><td>Tooltip content. Rendered inside <code>.ui-tooltip-content</code>.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Events</MuHeading>
		<MuText size="small" color="var(--text-secondary)">None — open state is fully controlled by the parent via the <code>open</code> prop.</MuText>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li><strong>Fully controlled.</strong> No internal hover or focus listeners. The parent decides when <code>open</code> flips — see <code>useDismissibleTooltip</code> for a click-and-outside-close pattern.</li>
			<li><strong>Viewport edge correction.</strong> When open, the component measures its bounding rect and applies <code>--ui-tooltip-viewport-shift-x/y</code> to slide back inside the viewport with a 16px safe margin. Resize and scroll both retrigger this measurement.</li>
			<li><strong>Trigger must be focusable for keyboard users.</strong> Wrap the slot content in a real <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>, not a bare <code>&lt;div&gt;</code>, so keyboard users can reach it.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

const basic_open = ref(true);
</script>

<style scoped lang="scss">
.guide-row {
	display: flex;
	flex-wrap: wrap;
	gap: 40px;
	padding: 32px 16px;
}

.guide-chip {
	display: inline-flex;
	align-items: center;
	padding: 6px 12px;
	background: var(--gray-20);
	border-radius: 999px;
	font-size: var(--body-sm);
	color: var(--text-primary);
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
