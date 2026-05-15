<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuLinearWrapper</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Flex-layout helper for direction, spacing, alignment, and padding — with per-breakpoint overrides via <code>:tablet</code> and <code>:mobile</code> props. Output is a single <code>&lt;div class="mu-linear-wrapper"&gt;</code> with all values emitted as CSS custom properties on inline style.
		</MuText>

		<MuHeading variant="6" weight="bold">Row (default)</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			<code>direction</code> defaults to <code>'row'</code>. Children sit side-by-side.
		</MuText>
		<div class="guide-demo">
			<MuLinearWrapper :gap="12" align="center">
				<div class="guide-box">A</div>
				<div class="guide-box">B</div>
				<div class="guide-box">C</div>
			</MuLinearWrapper>
		</div>

		<MuHeading variant="6" weight="bold">Column</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Set <code>direction="column"</code> to stack vertically.
		</MuText>
		<div class="guide-demo">
			<MuLinearWrapper direction="column" :gap="8">
				<div class="guide-box">First row</div>
				<div class="guide-box">Second row</div>
				<div class="guide-box">Third row</div>
			</MuLinearWrapper>
		</div>

		<MuHeading variant="6" weight="bold">Justify (main-axis distribution)</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			<code>justify</code> maps directly to <code>justify-content</code>. Set <code>width="100%"</code> if you want <code>space-between</code> / <code>space-around</code> to actually have room to distribute.
		</MuText>
		<div class="guide-demo guide-demo-stack">
			<div>
				<MuText size="small">flex-start (default)</MuText>
				<MuLinearWrapper :gap="8" width="100%" class="guide-bordered">
					<div class="guide-box">A</div>
					<div class="guide-box">B</div>
				</MuLinearWrapper>
			</div>
			<div>
				<MuText size="small">center</MuText>
				<MuLinearWrapper justify="center" :gap="8" width="100%" class="guide-bordered">
					<div class="guide-box">A</div>
					<div class="guide-box">B</div>
				</MuLinearWrapper>
			</div>
			<div>
				<MuText size="small">space-between</MuText>
				<MuLinearWrapper justify="space-between" width="100%" class="guide-bordered">
					<div class="guide-box">A</div>
					<div class="guide-box">B</div>
				</MuLinearWrapper>
			</div>
			<div>
				<MuText size="small">space-around</MuText>
				<MuLinearWrapper justify="space-around" width="100%" class="guide-bordered">
					<div class="guide-box">A</div>
					<div class="guide-box">B</div>
				</MuLinearWrapper>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Align (cross-axis)</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			<code>align</code> maps to <code>align-items</code>. Default is <code>'stretch'</code> — children fill the cross axis. The demo boxes below have different heights to make alignment visible.
		</MuText>
		<div class="guide-demo guide-demo-stack">
			<div>
				<MuText size="small">flex-start</MuText>
				<MuLinearWrapper align="flex-start" :gap="8" class="guide-bordered guide-tall">
					<div class="guide-box guide-box-sm">S</div>
					<div class="guide-box guide-box-md">M</div>
					<div class="guide-box guide-box-lg">L</div>
				</MuLinearWrapper>
			</div>
			<div>
				<MuText size="small">center</MuText>
				<MuLinearWrapper align="center" :gap="8" class="guide-bordered guide-tall">
					<div class="guide-box guide-box-sm">S</div>
					<div class="guide-box guide-box-md">M</div>
					<div class="guide-box guide-box-lg">L</div>
				</MuLinearWrapper>
			</div>
			<div>
				<MuText size="small">flex-end</MuText>
				<MuLinearWrapper align="flex-end" :gap="8" class="guide-bordered guide-tall">
					<div class="guide-box guide-box-sm">S</div>
					<div class="guide-box guide-box-md">M</div>
					<div class="guide-box guide-box-lg">L</div>
				</MuLinearWrapper>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Padding</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			<code>padding</code> sets all four sides. <code>paddingX</code> / <code>paddingY</code> override the axis. Accepts a number (becomes <code>px</code>) or a string with explicit units.
		</MuText>
		<div class="guide-demo guide-demo-stack">
			<MuLinearWrapper :padding="16" :gap="8" class="guide-bordered">
				<div class="guide-box">padding: 16</div>
			</MuLinearWrapper>
			<MuLinearWrapper :padding-x="24" :padding-y="8" :gap="8" class="guide-bordered">
				<div class="guide-box">paddingX: 24, paddingY: 8</div>
			</MuLinearWrapper>
			<MuLinearWrapper padding="1rem 2rem" :gap="8" class="guide-bordered">
				<div class="guide-box">padding: "1rem 2rem"</div>
			</MuLinearWrapper>
		</div>

		<MuHeading variant="6" weight="bold">Responsive — :mobile only</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Resize your browser narrower than 600px to see this one switch to column. At any width above 600px, only the base props apply.
		</MuText>
		<div class="guide-demo">
			<MuLinearWrapper
				:gap="50"
				width="100%"
				class="guide-bordered"
				:mobile="{ gap: 12, direction: 'column' }"
			>
				<div class="guide-box">Item A</div>
				<div class="guide-box">Item B</div>
				<div class="guide-box">Item C</div>
			</MuLinearWrapper>
		</div>

		<MuHeading variant="6" weight="bold">Responsive — :tablet + :mobile</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Each tier overrides independently. Below 1024px, tablet values apply; below 600px, mobile values take over. Either tier can omit any key — unspecified keys fall back to base.
		</MuText>
		<div class="guide-demo">
			<MuLinearWrapper
				:gap="50"
				width="100%"
				class="guide-bordered"
				:tablet="{ gap: 24, direction: 'row' }"
				:mobile="{ gap: 12, direction: 'column' }"
			>
				<div class="guide-box">Item A</div>
				<div class="guide-box">Item B</div>
				<div class="guide-box">Item C</div>
			</MuLinearWrapper>
		</div>

		<MuHeading variant="6" weight="bold">Width &amp; overflow</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			<code>width</code> defaults to <code>'auto'</code> (sizes to content). Pass <code>'100%'</code> or any CSS length when you want the wrapper to fill its parent. <code>overflowX</code> / <code>overflowY</code> default to <code>'unset'</code>.
		</MuText>
		<div class="guide-demo">
			<MuLinearWrapper width="100%" justify="space-between" class="guide-bordered">
				<div class="guide-box">Pinned left</div>
				<div class="guide-box">Pinned right</div>
			</MuLinearWrapper>
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
					<td>direction</td>
					<td><code>'row' | 'column'</code></td>
					<td><code>'row'</code></td>
					<td>Sets <code>flex-direction</code>.</td>
				</tr>
				<tr>
					<td>gap</td>
					<td><code>number | string</code></td>
					<td><code>—</code></td>
					<td>Gap between children. Numbers become <code>px</code>. Strings pass through (e.g. <code>'1rem'</code>).</td>
				</tr>
				<tr>
					<td>justify</td>
					<td><code>'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'</code></td>
					<td><code>'flex-start'</code></td>
					<td>Maps to <code>justify-content</code>.</td>
				</tr>
				<tr>
					<td>align</td>
					<td><code>'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline'</code></td>
					<td><code>'stretch'</code></td>
					<td>Maps to <code>align-items</code>.</td>
				</tr>
				<tr>
					<td>flexWrap</td>
					<td><code>string</code></td>
					<td><code>'nowrap'</code></td>
					<td>Maps to <code>flex-wrap</code>. Accepts any valid value (<code>'wrap'</code>, <code>'wrap-reverse'</code>).</td>
				</tr>
				<tr>
					<td>width</td>
					<td><code>string</code></td>
					<td><code>'auto'</code></td>
					<td>CSS length. Set to <code>'100%'</code> if <code>justify</code> needs room to distribute.</td>
				</tr>
				<tr>
					<td>overflowX</td>
					<td><code>string</code></td>
					<td><code>'unset'</code></td>
					<td>Maps to <code>overflow-x</code>.</td>
				</tr>
				<tr>
					<td>overflowY</td>
					<td><code>string</code></td>
					<td><code>'unset'</code></td>
					<td>Maps to <code>overflow-y</code>.</td>
				</tr>
				<tr>
					<td>padding</td>
					<td><code>number | string</code></td>
					<td><code>—</code></td>
					<td>Shorthand for all four sides. Numbers become <code>px</code>.</td>
				</tr>
				<tr>
					<td>paddingX</td>
					<td><code>number | string</code></td>
					<td><code>—</code></td>
					<td>Horizontal padding. Overrides <code>padding</code> on the X axis.</td>
				</tr>
				<tr>
					<td>paddingY</td>
					<td><code>number | string</code></td>
					<td><code>—</code></td>
					<td>Vertical padding. Overrides <code>padding</code> on the Y axis.</td>
				</tr>
				<tr>
					<td>tablet</td>
					<td><code>ResponsiveOverride</code></td>
					<td><code>—</code></td>
					<td>Per-key overrides applied at ≤1024px. Keys: <code>direction</code>, <code>gap</code>, <code>justify</code>, <code>align</code>, <code>flexWrap</code>, <code>padding</code>, <code>paddingX</code>, <code>paddingY</code>.</td>
				</tr>
				<tr>
					<td>mobile</td>
					<td><code>ResponsiveOverride</code></td>
					<td><code>—</code></td>
					<td>Per-key overrides applied at ≤600px. Same keys as <code>tablet</code>. Falls back through tablet → base when a key is omitted.</td>
				</tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<table class="guide-table">
			<thead>
				<tr>
					<th>Slot</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>default</td>
					<td>Flex children. Pass any elements/components; they become the flex items.</td>
				</tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Events</MuHeading>
		<MuText size="small" color="var(--text-secondary)">No emitted events — pure layout primitive.</MuText>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li>
				<strong>Breakpoints are desktop-first.</strong> <code>:tablet</code> fires at <code>max-width: 1024px</code> and <code>:mobile</code> at <code>max-width: 600px</code>. Both <em>also</em> apply at mobile widths — at 400px both media queries match, and mobile wins via source order.
			</li>
			<li>
				<strong>Per-tier cascade.</strong> The mobile @media reads <code>var(--mu-direction-mobile, var(--mu-direction-tablet, var(--mu-direction-base, row)))</code>. So if you set only <code>:tablet</code> and view on mobile, the tablet value carries through. If you want mobile to <em>not</em> inherit tablet, set the key on mobile too (even just to the base value).
			</li>
			<li>
				<strong>Nested wrappers don't inherit each other's values.</strong> All <code>--mu-*</code> custom properties are reset to <code>initial</code> on every <code>.mu-linear-wrapper</code>, so a child wrapper with no <code>direction</code> prop falls back to <code>row</code> — it does <em>not</em> inherit the parent wrapper's <code>direction="column"</code>. This was a real bug we fixed.
			</li>
			<li>
				<strong><code>justify: space-between</code> needs width.</strong> Default <code>width: auto</code> shrinks to content, leaving nothing to distribute. Pass <code>width="100%"</code> (or rely on a flex parent with <code>align: stretch</code>) when you need things pinned to opposite ends.
			</li>
			<li>
				<strong>Truncation needs <code>min-width: 0</code> on the wrapper.</strong> Flex items default to <code>min-width: auto</code>, which prevents shrinking below content size. If a child has <code>text-overflow: ellipsis</code> and isn't ellipsing, add <code>min-width: 0</code> (often via a scoped class) to every wrapper ancestor in the chain.
			</li>
			<li>
				<strong>Numbers vs strings for length props.</strong> <code>:gap="12"</code> emits <code>12px</code>. <code>gap="12"</code> (no <code>:</code>) emits the literal string <code>12</code> which is invalid CSS and silently dropped. Use the colon-bind for numbers or pass a string with a unit like <code>gap="12px"</code>.
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
</script>

<style scoped lang="scss">
.guide-demo-stack {
	display: flex;
	flex-direction: column;
	gap: 16px;
}

.guide-box {
	background: var(--gray-20);
	border-radius: 6px;
	padding: 8px 12px;
	font-size: var(--body-sm);
	color: var(--text-primary);
	white-space: nowrap;

	&-sm { padding: 4px 8px; }
	&-md { padding: 12px 16px; }
	&-lg { padding: 20px 24px; }
}

.guide-bordered {
	border: 1px dashed var(--gray-50);
	border-radius: 6px;
	padding: 8px;
}

.guide-tall {
	min-height: 100px;
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
