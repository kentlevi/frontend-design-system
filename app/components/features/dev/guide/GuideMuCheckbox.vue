<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuCheckbox</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Frontend port of the admin checkbox. Same API as <code>UiCheckbox</code> with an extra <code>variant</code> prop (<code>check</code> / <code>minus</code>) for indeterminate-style display. Supports both controlled and uncontrolled usage via an internal fallback.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic &amp; variant</MuHeading>
		<div class="guide-demo guide-stack">
			<MuCheckbox v-model="checked">Default check icon</MuCheckbox>
			<MuCheckbox v-model="checked_minus" variant="minus">Minus icon (indeterminate-style)</MuCheckbox>
		</div>

		<MuHeading variant="6" weight="bold">Sizes &amp; states</MuHeading>
		<div class="guide-demo guide-stack">
			<MuCheckbox v-model="size_md" size="md">Medium (default)</MuCheckbox>
			<MuCheckbox v-model="size_sm" size="sm">Small</MuCheckbox>
			<MuCheckbox :model-value="true" state="success">Success</MuCheckbox>
			<MuCheckbox :model-value="false" state="error">Error</MuCheckbox>
			<MuCheckbox :model-value="true" disabled>Disabled (checked)</MuCheckbox>
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>modelValue</td><td><code>boolean | undefined</code></td><td><code>undefined</code></td><td>Checked state. When <code>undefined</code>, the component manages state internally (uncontrolled).</td></tr>
				<tr><td>disabled</td><td><code>boolean</code></td><td><code>false</code></td><td>Disables the input. Emitted as <code>data-disabled="true"</code>.</td></tr>
				<tr><td>size</td><td><code>'md' | 'sm'</code></td><td><code>'md'</code></td><td>Size variant. Emitted as <code>data-size</code>. <code>sm</code> shrinks the box to 18px and uses body-small typography for the label.</td></tr>
				<tr><td>state</td><td><code>'default' | 'error' | 'success'</code></td><td><code>'default'</code></td><td>Visual state. Emitted as <code>data-state</code> (dropped when default).</td></tr>
				<tr><td>variant</td><td><code>'check' | 'minus'</code></td><td><code>'check'</code></td><td>Icon style. <code>check</code> = checkmark, <code>minus</code> = horizontal bar (indeterminate-style).</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Slot</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>default</td><td>Label content. Rendered inside the <code>&lt;label&gt;</code> next to the box.</td></tr>
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
			<li><strong>Controlled or uncontrolled.</strong> Pass <code>v-model</code> for controlled. Omit it (or pass <code>:model-value="undefined"</code>) and the component tracks state internally via a watched <code>internal_model</code> ref.</li>
			<li><strong>Visually hidden input.</strong> The native <code>&lt;input&gt;</code> is absolute-positioned at 1×1 px with <code>opacity: 0</code> — accessible but invisible. Styling lives on the sibling <code>.m-checkbox-box</code>.</li>
			<li><strong>MuCheckbox vs UiCheckbox.</strong> MuCheckbox adds the <code>variant</code> prop (minus icon) and runs without the helper-driven attrs splitting. UiCheckbox has <code>boxClass</code> / <code>iconClass</code> / <code>labelClass</code> escape hatches MuCheckbox doesn't expose.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import MuCheckbox from '~/components/base/MuCheckbox.vue';

const checked = ref(false);
const checked_minus = ref(true);
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
