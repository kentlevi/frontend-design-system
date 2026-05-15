<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiRadio</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Radio control for single-choice selection. Use multiple <code>UiRadio</code> instances sharing the same <code>v-model</code> and <code>name</code> to form a group. Two sizes, three states, label slot or prop.
		</MuText>

		<MuHeading variant="6" weight="bold">Group</MuHeading>
		<div class="guide-demo guide-stack">
			<UiRadio v-model="plan" name="plan" value="starter" label="Starter" />
			<UiRadio v-model="plan" name="plan" value="pro" label="Pro" />
			<UiRadio v-model="plan" name="plan" value="enterprise" label="Enterprise" />
			<MuText size="small">Selected: <code>{{ plan }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Sizes &amp; states</MuHeading>
		<div class="guide-demo guide-stack">
			<UiRadio v-model="size_demo" name="size-demo" value="md" size="md" label="Medium (default)" />
			<UiRadio v-model="size_demo" name="size-demo" value="sm" size="sm" label="Small" />
			<UiRadio :model-value="'a'" name="state-success" value="a" state="success" label="Success" />
			<UiRadio :model-value="'a'" name="state-error" value="a" state="error" label="Error" />
			<UiRadio :model-value="'a'" name="state-disabled" value="a" disabled label="Disabled (checked)" />
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>modelValue</td><td><code>string | number | boolean | null</code></td><td><code>null</code></td><td>The currently selected value in the group. Use with <code>v-model</code>.</td></tr>
				<tr><td>value</td><td><code>string | number | boolean</code></td><td><code>true</code></td><td>This radio's value. When <code>modelValue === value</code>, the radio is checked.</td></tr>
				<tr><td>name</td><td><code>string</code></td><td><code>''</code></td><td>Native <code>name</code> attribute for grouping. Required for keyboard arrow navigation between radios.</td></tr>
				<tr><td>label</td><td><code>string</code></td><td><code>''</code></td><td>Label text. Ignored when default slot is used.</td></tr>
				<tr><td>disabled</td><td><code>boolean</code></td><td><code>false</code></td><td>Disables interaction. Sets native <code>disabled</code> and <code>data-disabled="true"</code>.</td></tr>
				<tr><td>size</td><td><code>'md' | 'sm'</code></td><td><code>'md'</code></td><td>Size variant. Emitted as <code>data-size</code>.</td></tr>
				<tr><td>state</td><td><code>'default' | 'error' | 'success'</code></td><td><code>'default'</code></td><td>Visual state. Emitted as <code>data-state</code>.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Slot</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>default</td><td>Label content. Overrides the <code>label</code> prop. Useful for rich labels.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Events</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Event</th><th>Payload</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>update:modelValue</td><td><code>string | number | boolean</code></td><td>Emitted when the radio is selected. Carries the radio's own <code>value</code>.</td></tr>
				<tr><td>change</td><td><code>string | number | boolean</code></td><td>Emitted alongside <code>update:modelValue</code>. Same payload — use this when you need a side-effect hook independent of v-model.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li><strong>Always pass <code>name</code> for groups.</strong> Without a shared <code>name</code>, keyboard arrow navigation between radios won't work and screen readers won't announce the group correctly.</li>
			<li><strong>Use unique <code>value</code> per radio.</strong> Each radio in a group needs a distinct <code>value</code> — the active radio is determined by <code>modelValue === value</code>.</li>
			<li><strong>Default <code>value="true"</code> is rarely what you want.</strong> When omitted, all radios in a group have <code>value: true</code> and the group becomes useless. Always set <code>value</code> explicitly.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

const plan = ref('starter');
const size_demo = ref('md');
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
