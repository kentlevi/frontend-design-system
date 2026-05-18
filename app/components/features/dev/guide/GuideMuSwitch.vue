<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuSwitch</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Two-state toggle. Use the <code>default</code> variant with a label slot, or the
			<code>label-inside</code> variant when the active / inactive text should live inside the slider.
		</MuText>

		<MuHeading variant="6" weight="bold">Default (label after)</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-column">
				<MuSwitch v-model="default_value">
					<MuText size="small">Notifications</MuText>
				</MuSwitch>
			</div>
			<MuText size="small">Value: <code>{{ default_value }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Label before (named slot)</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-column">
				<MuSwitch v-model="before_value">
					<template #before>
						<MuText size="small">Dark Background</MuText>
					</template>
				</MuSwitch>
			</div>
			<MuText size="small">Value: <code>{{ before_value }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Label inside the slider</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-column">
				<MuSwitch v-model="inside_value" variant="label-inside">
					<template #inactive-text>OFF</template>
					<template #active-text>ON</template>
				</MuSwitch>
			</div>
			<MuText size="small">Value: <code>{{ inside_value }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Usage</MuHeading>
		<pre class="guide-mu-switch__playground-snippet"><code>&lt;!-- default — label after via default slot --&gt;
&lt;MuSwitch v-model="enabled"&gt;
  &lt;MuText size="small"&gt;Notifications&lt;/MuText&gt;
&lt;/MuSwitch&gt;

&lt;!-- label before via #before slot --&gt;
&lt;MuSwitch v-model="enabled"&gt;
  &lt;template #before&gt;
    &lt;MuText size="small"&gt;Dark Background&lt;/MuText&gt;
  &lt;/template&gt;
&lt;/MuSwitch&gt;

&lt;!-- label-inside variant — text lives inside the slider --&gt;
&lt;MuSwitch v-model="enabled" variant="label-inside"&gt;
  &lt;template #inactive-text&gt;OFF&lt;/template&gt;
  &lt;template #active-text&gt;ON&lt;/template&gt;
&lt;/MuSwitch&gt;</code></pre>

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
					<td>modelValue</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Current on/off state. Bind via <code>v-model</code>.</td>
				</tr>
				<tr>
					<td>variant</td>
					<td><code>'default' | 'label-inside'</code></td>
					<td><code>'default'</code></td>
					<td><code>default</code> shows the slider alone (label goes before/after via slots). <code>label-inside</code> renders the active / inactive text within the slider track.</td>
				</tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Events</MuHeading>
		<table class="guide-table">
			<thead>
				<tr>
					<th>Event</th>
					<th>Payload</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>update:modelValue</td>
					<td><code>boolean</code></td>
					<td>Fires when the user toggles the switch. Powers <code>v-model</code>.</td>
				</tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<table class="guide-table">
			<thead>
				<tr>
					<th>Slot</th>
					<th>Available in</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>default</td>
					<td><code>default</code> variant</td>
					<td>Content rendered after the slider (the standard label position).</td>
				</tr>
				<tr>
					<td>before</td>
					<td><code>default</code> variant</td>
					<td>Content rendered before the slider — use when the label should sit on the left of the track.</td>
				</tr>
				<tr>
					<td>after</td>
					<td><code>default</code> variant</td>
					<td>Same position as <code>default</code>; named alias for clarity when also using <code>#before</code>.</td>
				</tr>
				<tr>
					<td>inactive-text</td>
					<td><code>label-inside</code> variant</td>
					<td>Text shown inside the slider when the switch is off.</td>
				</tr>
				<tr>
					<td>active-text</td>
					<td><code>label-inside</code> variant</td>
					<td>Text shown inside the slider when the switch is on.</td>
				</tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li><strong>Fully controlled.</strong> The component does not maintain its own state — it emits <code>update:modelValue</code> and reads <code>modelValue</code>. Bind a ref via <code>v-model</code>.</li>
			<li><strong>Track sizes differ per variant.</strong> Default = 36×20px; <code>label-inside</code> = at least 108×36px to fit the inner text. Pick the variant that fits your layout, not the other way around.</li>
			<li><strong>Color tokens.</strong> Off-state track uses <code>--gray-60</code>; on-state uses <code>--abyss-base</code>; knob uses <code>--white-base</code>. Active text uses <code>--white-base</code>. Customize via overrides if needed.</li>
			<li><strong>Keyboard.</strong> The underlying <code>&lt;input type="checkbox"&gt;</code> is focusable and toggles with Space, but the input is <code>hidden</code> — focus visibility relies on the label/track. If keyboard discoverability is critical for your use, add a <code>:focus-visible</code> ring to the slider in your scoped style.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuSwitch from '~/components/base/MuSwitch.vue';
import MuText from '~/components/base/MuText.vue';

const default_value = ref(false);
const before_value = ref(true);
const inside_value = ref(false);
</script>

<style scoped lang="scss">
.guide-demo-column {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.guide-mu-switch__playground-snippet {
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
