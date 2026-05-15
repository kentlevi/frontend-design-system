<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiTextarea</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Multiline text input wrapper around the native <code>&lt;textarea&gt;</code>. Supports state styling, fixed-row sizing, max-length, readonly/disabled, and configurable resize handle direction.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic</MuHeading>
		<div class="guide-demo">
			<UiTextarea
				v-model="basic"
				placeholder="Write your notes here..."
				:rows="4"
			/>
			<MuText size="small">Value length: <code>{{ basic.length }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">States</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			<code>state</code> drives a <code>data-state</code> attribute on the wrapper. Style each state in your global theme.
		</MuText>
		<div class="guide-demo guide-stack">
			<UiTextarea v-model="default_val" placeholder="Default state" state="default" :rows="3" />
			<UiTextarea v-model="success_val" placeholder="Success state" state="success" :rows="3" />
			<UiTextarea v-model="error_val" placeholder="Error state" state="error" :rows="3" />
		</div>

		<MuHeading variant="6" weight="bold">Resize control</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			<code>resize</code> sets the native CSS <code>resize</code> property directly on the textarea via inline style.
		</MuText>
		<div class="guide-demo guide-stack">
			<UiTextarea v-model="r_none" placeholder="resize: none" resize="none" :rows="3" />
			<UiTextarea v-model="r_v" placeholder="resize: vertical (default)" resize="vertical" :rows="3" />
			<UiTextarea v-model="r_h" placeholder="resize: horizontal" resize="horizontal" :rows="3" />
			<UiTextarea v-model="r_both" placeholder="resize: both" resize="both" :rows="3" />
		</div>

		<MuHeading variant="6" weight="bold">Max length &amp; counter</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			The component caps input via the native <code>maxlength</code> attribute. Counter UI is your responsibility — render it next to the textarea using the v-model value.
		</MuText>
		<div class="guide-demo">
			<UiTextarea v-model="capped" placeholder="Max 100 chars" :max-length="100" :rows="3" />
			<MuText size="small">{{ capped.length }} / 100</MuText>
		</div>

		<MuHeading variant="6" weight="bold">Disabled &amp; readonly</MuHeading>
		<div class="guide-demo guide-stack">
			<UiTextarea v-model="dis_val" placeholder="Disabled" disabled :rows="3" />
			<UiTextarea v-model="ro_val" placeholder="Readonly" readonly :rows="3" />
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead>
				<tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr>
			</thead>
			<tbody>
				<tr>
					<td>modelValue</td>
					<td><code>string</code></td>
					<td><code>''</code></td>
					<td>Textarea value. Use with <code>v-model</code>.</td>
				</tr>
				<tr>
					<td>placeholder</td>
					<td><code>string</code></td>
					<td><code>''</code></td>
					<td>Placeholder text.</td>
				</tr>
				<tr>
					<td>state</td>
					<td><code>'default' | 'error' | 'success'</code></td>
					<td><code>'default'</code></td>
					<td>Visual state. Emitted as <code>data-state</code> on the wrapper (drop the default-state attribute when state is <code>'default'</code>).</td>
				</tr>
				<tr>
					<td>readonly</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Sets native <code>readonly</code> and <code>data-readonly="true"</code>.</td>
				</tr>
				<tr>
					<td>disabled</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Sets native <code>disabled</code> and <code>data-disabled="true"</code>.</td>
				</tr>
				<tr>
					<td>maxLength</td>
					<td><code>number | undefined</code></td>
					<td><code>undefined</code></td>
					<td>Forwarded to the native <code>maxlength</code> attribute.</td>
				</tr>
				<tr>
					<td>rows</td>
					<td><code>number</code></td>
					<td><code>4</code></td>
					<td>Initial visible row count. Affects the textarea's default height before any user resize.</td>
				</tr>
				<tr>
					<td>resize</td>
					<td><code>'none' | 'vertical' | 'horizontal' | 'both'</code></td>
					<td><code>'vertical'</code></td>
					<td>Applied as inline <code>resize</code> style on the textarea.</td>
				</tr>
				<tr>
					<td>fieldClass</td>
					<td><code>string</code></td>
					<td><code>''</code></td>
					<td>Extra class appended to the native <code>&lt;textarea class="ui-textarea-field"&gt;</code>.</td>
				</tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Events</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Event</th><th>Payload</th><th>Description</th></tr></thead>
			<tbody>
				<tr>
					<td>update:modelValue</td>
					<td><code>string</code></td>
					<td>Emitted on every <code>input</code>. Drives <code>v-model</code>.</td>
				</tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<MuText size="small" color="var(--text-secondary)">None — UiTextarea has no slots. For label / error layout, wrap it in <code>UiFormField</code> or your own composition.</MuText>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li>
				<strong>No <code>name</code> or <code>id</code> props.</strong> Unlike <code>MuInput</code>, the wrapper doesn't accept <code>id</code> / <code>name</code>. If you need them for form submission or <code>&lt;label for&gt;</code> binding, use <code>fieldClass</code> + a wrapper, or fall through attrs (attrs do reach the wrapper since <code>inheritAttrs</code> is the default <code>true</code> here).
			</li>
			<li>
				<strong>Class on <code>&lt;UiTextarea&gt;</code> lands on the wrapper.</strong> No <code>inheritAttrs: false</code>, so plain <code>class="foo"</code> attaches to <code>.ui-textarea</code>. Use <code>fieldClass</code> when you need it on the inner <code>&lt;textarea&gt;</code> instead.
			</li>
			<li>
				<strong>No character counter UI.</strong> <code>maxLength</code> caps input but doesn't render a counter — you build that yourself from the v-model value (see the Max length demo above).
			</li>
			<li>
				<strong>Resize via inline style.</strong> The <code>resize</code> prop is applied via inline style on the textarea, so it overrides any CSS rule you write at the same specificity.
			</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

const basic = ref('');
const default_val = ref('');
const success_val = ref('Valid content');
const error_val = ref('');
const r_none = ref('');
const r_v = ref('');
const r_h = ref('');
const r_both = ref('');
const capped = ref('');
const dis_val = ref('Cannot edit this');
const ro_val = ref('Read-only content');
</script>

<style scoped lang="scss">
.guide-stack {
	display: flex;
	flex-direction: column;
	gap: 12px;
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
