<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuTooltip</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Singleton tooltip teleported to <code>&lt;body&gt;</code>. Driven imperatively by the
			<code>useMuTooltip()</code> composable — mount it once at the app/layout root,
			then call <code>showTooltip</code> / <code>hideTooltip</code> from any component.
		</MuText>

		<MuHeading variant="6" weight="bold">Mount once (app root)</MuHeading>
		<pre class="guide-mu-tooltip__playground-snippet"><code>&lt;!-- layouts/default.vue --&gt;
&lt;template&gt;
  &lt;NuxtPage /&gt;
  &lt;MuTooltip /&gt;
&lt;/template&gt;</code></pre>

		<MuHeading variant="6" weight="bold">Basic (hover &amp; focus)</MuHeading>
		<div class="guide-demo">
			<button
				type="button"
				class="guide-mu-tooltip-trigger"
				@mouseenter="show($event, 'Saved to drafts', 'top')"
				@mouseleave="hide"
				@focus="show($event, 'Saved to drafts', 'top')"
				@blur="hide"
			>
				Hover or focus me (top)
			</button>
			<MuText size="small" color="var(--text-secondary)">
				Tooltip text comes from the <code>showTooltip(event, text, side)</code> call.
			</MuText>
		</div>

		<MuHeading variant="6" weight="bold">Placements</MuHeading>
		<div class="guide-demo guide-mu-tooltip-row">
			<button
				type="button"
				class="guide-mu-tooltip-trigger"
				@mouseenter="show($event, 'Top placement', 'top')"
				@mouseleave="hide"
			>
				top
			</button>
			<button
				type="button"
				class="guide-mu-tooltip-trigger"
				@mouseenter="show($event, 'Right placement', 'right')"
				@mouseleave="hide"
			>
				right
			</button>
			<button
				type="button"
				class="guide-mu-tooltip-trigger"
				@mouseenter="show($event, 'Bottom placement', 'bottom')"
				@mouseleave="hide"
			>
				bottom
			</button>
			<button
				type="button"
				class="guide-mu-tooltip-trigger"
				@mouseenter="show($event, 'Left placement', 'left')"
				@mouseleave="hide"
			>
				left
			</button>
		</div>

		<MuHeading variant="6" weight="bold">Imperative usage</MuHeading>
		<pre class="guide-mu-tooltip__playground-snippet"><code>const { showTooltip, hideTooltip } = useMuTooltip()

function onEnter(event: MouseEvent) {
  showTooltip(event, 'Helpful hint', 'top')
}

function onLeave() {
  hideTooltip()
}</code></pre>

		<MuHeading variant="6" weight="bold">Composable API</MuHeading>
		<table class="guide-table">
			<thead>
				<tr><th>Return</th><th>Type</th><th>Description</th></tr>
			</thead>
			<tbody>
				<tr>
					<td>showTooltip</td>
					<td><code>(event: MouseEvent, text: string, side?: Side) =&gt; void</code></td>
					<td>Anchors the tooltip to <code>event.currentTarget</code> using <code>getBoundingClientRect()</code>, sets the text, and shows it. <code>side</code> defaults to <code>'top'</code>.</td>
				</tr>
				<tr>
					<td>hideTooltip</td>
					<td><code>() =&gt; void</code></td>
					<td>Hides the tooltip (flips <code>visible</code> to <code>false</code>).</td>
				</tr>
				<tr>
					<td>visible</td>
					<td><code>Ref&lt;boolean&gt;</code></td>
					<td>Reactive open state (shared via <code>useState</code>).</td>
				</tr>
				<tr>
					<td>text</td>
					<td><code>Ref&lt;string&gt;</code></td>
					<td>Current tooltip content. Overridden if a default slot is passed to <code>&lt;MuTooltip&gt;</code>.</td>
				</tr>
				<tr>
					<td>placement</td>
					<td><code>Ref&lt;'top' | 'right' | 'bottom' | 'left'&gt;</code></td>
					<td>Current anchor side.</td>
				</tr>
				<tr>
					<td>x / y</td>
					<td><code>Ref&lt;number&gt;</code></td>
					<td>Pixel coordinates inside the viewport (fixed positioning).</td>
				</tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<table class="guide-table">
			<thead>
				<tr><th>Slot</th><th>Description</th></tr>
			</thead>
			<tbody>
				<tr>
					<td>default</td>
					<td>Replaces the rendered <code>text</code>. Useful for icons or rich content. Leave empty to use the <code>text</code> argument passed to <code>showTooltip</code>.</td>
				</tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li><strong>Singleton.</strong> Only one tooltip is visible across the app — calling <code>showTooltip</code> anywhere replaces the previous content/position.</li>
			<li><strong>Mount once.</strong> Place <code>&lt;MuTooltip /&gt;</code> in the root layout. It teleports to <code>body</code> with <code>z-index: 99999</code>.</li>
			<li><strong>Fixed positioning.</strong> Coordinates come from <code>getBoundingClientRect()</code>, so the bubble does not follow scroll. Always hide on <code>mouseleave</code> / <code>blur</code> to avoid stale anchors.</li>
			<li><strong>Non-interactive.</strong> The bubble uses <code>pointer-events: none</code> — never put clickable content inside.</li>
			<li><strong>Keyboard parity.</strong> Pair <code>@mouseenter</code>/<code>@mouseleave</code> with <code>@focus</code>/<code>@blur</code> so keyboard users also see the hint.</li>
		</ul>

		<MuTooltip />
	</div>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import MuTooltip from '~/components/base/MuTooltip.vue';

const { showTooltip: show, hideTooltip: hide } = useMuTooltip();
</script>

<style scoped lang="scss">
.guide-mu-tooltip-row {
	display: flex;
	flex-wrap: wrap;
	gap: 16px;
	padding: 28px 16px;
}

.guide-mu-tooltip-trigger {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	padding: 8px 14px;
	border: 1px solid var(--border-default, #e4e7ec);
	border-radius: 8px;
	background: var(--contrast-light, #fff);
	color: var(--text-primary);
	font-family: var(--font-base);
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
	transition: background 120ms ease, border-color 120ms ease;

	&:hover,
	&:focus-visible {
		background: var(--bg-muted, #f2f4f7);
		border-color: var(--text-primary, #111);
		outline: none;
	}
}

.guide-mu-tooltip__playground-snippet {
	margin: 0;
	padding: 14px;
	border-radius: 10px;
	border: 1px solid #1f2937;
	background: #0f172a;
	color: #e5e7eb;
	font-size: 12px;
	line-height: 1.45;
	overflow-x: auto;
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

	strong {
		color: var(--text-primary);
	}
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
