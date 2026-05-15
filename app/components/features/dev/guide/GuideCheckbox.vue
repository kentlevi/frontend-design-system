<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiCheckbox</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Checkbox control with optional label, two sizes, and three visual states. Built around a native <code>&lt;input type="checkbox"&gt;</code> wrapped in a <code>&lt;label&gt;</code> for accessible clicking.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic</MuHeading>
		<div class="guide-demo guide-stack">
			<UiCheckbox v-model="checked">Accept terms</UiCheckbox>
			<MuText size="small">Checked value: <code>{{ checked }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Sizes &amp; states</MuHeading>
		<div class="guide-demo guide-stack">
			<UiCheckbox v-model="size_md" size="md">Medium (default)</UiCheckbox>
			<UiCheckbox v-model="size_sm" size="sm">Small</UiCheckbox>
			<UiCheckbox :model-value="true" state="success">Success state</UiCheckbox>
			<UiCheckbox :model-value="false" state="error">Error state</UiCheckbox>
			<UiCheckbox :model-value="true" disabled>Disabled (checked)</UiCheckbox>
			<UiCheckbox :model-value="false" disabled>Disabled (unchecked)</UiCheckbox>
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>modelValue</td><td><code>boolean</code></td><td><code>false</code></td><td>Checked state. Use with <code>v-model</code>.</td></tr>
				<tr><td>label</td><td><code>string</code></td><td><code>''</code></td><td>Label text. Ignored when the default slot is used.</td></tr>
				<tr><td>disabled</td><td><code>boolean</code></td><td><code>false</code></td><td>Disables interaction. Sets native <code>disabled</code> and <code>data-disabled="true"</code>.</td></tr>
				<tr><td>size</td><td><code>'md' | 'sm'</code></td><td><code>'md'</code></td><td>Size variant emitted as <code>data-size</code>.</td></tr>
				<tr><td>state</td><td><code>'default' | 'error' | 'success'</code></td><td><code>'default'</code></td><td>Visual state. Emitted as <code>data-state</code> (dropped when default).</td></tr>
				<tr><td>boxClass</td><td><code>string</code></td><td><code>''</code></td><td>Extra class on the <code>.ui-checkbox-box</code> visual square.</td></tr>
				<tr><td>iconClass</td><td><code>string</code></td><td><code>''</code></td><td>Extra class on the check icon.</td></tr>
				<tr><td>labelClass</td><td><code>string</code></td><td><code>''</code></td><td>Extra class on the <code>.ui-checkbox-label</code> span.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Slot</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>default</td><td>Label content. Overrides the <code>label</code> prop. Useful for rich labels (links, badges).</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Events</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Event</th><th>Payload</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>update:modelValue</td><td><code>boolean</code></td><td>Emitted on every native <code>change</code>. Drives <code>v-model</code>.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li><strong>Attrs split between root and input.</strong> <code>inheritAttrs: false</code> is on, but the helper <code>useRootAttrs</code> / <code>useControlAttrs</code> splits passed attrs: presentational ones (e.g. <code>data-testid</code>) go to the <code>&lt;label&gt;</code> root, while form-related ones (e.g. <code>name</code>, <code>aria-*</code>) go to the inner <code>&lt;input&gt;</code>.</li>
			<li><strong>Use boxClass / iconClass / labelClass for styling.</strong> A bare <code>class="foo"</code> on the call site routes through the helper — these explicit props target specific subtrees with no ambiguity.</li>
			<li><strong>The label is the click target.</strong> Whole <code>&lt;label&gt;</code> is clickable — the box and the text are both hot. Disable click-through via <code>disabled</code>, not <code>pointer-events: none</code> on the box.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

const checked = ref(false);
const size_md = ref(true);
const size_sm = ref(false);
</script>

<style scoped lang="scss">
.guide-stack { display: flex; flex-direction: column; gap: 10px; }

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
