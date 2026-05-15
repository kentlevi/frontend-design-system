<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiToast</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Transient notification anchored to the page via Teleport. Five tones, optional dismiss button, default + outlined variants. Visibility is fully controlled — the parent handles auto-dismiss timing.
		</MuText>

		<MuHeading variant="6" weight="bold">Tones</MuHeading>
		<div class="guide-demo">
			<div class="guide-row">
				<UiButton size="sm" @click="show('primary')">Primary</UiButton>
				<UiButton size="sm" @click="show('success')">Success</UiButton>
				<UiButton size="sm" tone="warning" @click="show('warning')">Warning</UiButton>
				<UiButton size="sm" tone="danger" @click="show('error')">Error</UiButton>
				<UiButton size="sm" tone="neutral" @click="show('info')">Info</UiButton>
			</div>
			<UiToast
				:visible="visible"
				:tone="tone"
				title="Guide Toast"
				message="This is a sample toast message."
				@close="visible = false"
			/>
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>visible</td><td><code>boolean</code></td><td><code>false</code></td><td>Open/closed state. Fully controlled by the parent — no internal timer.</td></tr>
				<tr><td>title</td><td><code>string | null</code></td><td><code>''</code></td><td>Bold heading text. Combined with <code>message</code> via "title - message".</td></tr>
				<tr><td>message</td><td><code>string | null</code></td><td><code>''</code></td><td>Body text. When <code>title</code> is empty, message renders alone.</td></tr>
				<tr><td>tone</td><td><code>'primary' | 'success' | 'warning' | 'error' | 'info'</code></td><td><code>'primary'</code></td><td>Drives icon + color. Each tone has a fixed icon (check, exclamation, times, info).</td></tr>
				<tr><td>dismissible</td><td><code>boolean</code></td><td><code>true</code></td><td>When true, renders the X close button.</td></tr>
				<tr><td>variant</td><td><code>'default' | 'outlined'</code></td><td><code>'default'</code></td><td>Visual variant. Emitted as <code>data-variant</code>.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Slot</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>default</td><td>Replaces the default <code>title</code> + <code>message</code> rendering. Use when you need rich content (links, multiple lines, formatting).</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Events</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Event</th><th>Payload</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>close</td><td><code>—</code></td><td>Emitted when the X button is clicked. You must set <code>visible = false</code> yourself.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li><strong>Teleported to <code>&lt;body&gt;</code>.</strong> The toast renders outside its parent's DOM subtree, so positioning is handled by global toast styles, not the call site.</li>
			<li><strong>No auto-dismiss built in.</strong> If you want the toast to disappear after N seconds, set a <code>setTimeout</code> from the parent to flip <code>visible = false</code>.</li>
			<li><strong>Tone <code>'info'</code> in the old guide was a UI shortcut.</strong> The actual valid tones are <code>primary | success | warning | error | info</code>. <code>info</code> exists but most error notifications use <code>error</code>.</li>
			<li><strong>Attrs fall through to <code>.ui-toast</code>.</strong> Despite <code>inheritAttrs: false</code>, the component manually re-binds <code>v-bind="$attrs"</code> on the container, so <code>class</code> and <code>data-*</code> attributes do reach it.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

const visible = ref(false);
const tone = ref<'primary' | 'success' | 'warning' | 'error' | 'info'>('success');

function show(nextTone: 'primary' | 'success' | 'warning' | 'error' | 'info') {
	tone.value = nextTone;
	visible.value = true;
}
</script>

<style scoped lang="scss">
.guide-row { display: flex; flex-wrap: wrap; gap: 8px; }

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
