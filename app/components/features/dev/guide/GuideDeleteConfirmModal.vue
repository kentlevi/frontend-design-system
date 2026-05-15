<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiDeleteConfirmModal</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Prebuilt destructive-confirmation modal built on top of <code>UiModal</code>. Renders a centered icon + title + description, with Cancel and Confirm buttons (Confirm is <code>danger</code>-toned by default). Use for delete prompts where you want consistent look + reduced boilerplate.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic</MuHeading>
		<div class="guide-demo">
			<UiButton tone="danger" @click="is_open = true">Open delete modal</UiButton>
			<UiDeleteConfirmModal
				:model-value="is_open"
				title="Delete this address?"
				description="This action cannot be undone. The address will be removed from your address book immediately."
				cancel-label="Cancel"
				confirm-label="Delete"
				@cancel="is_open = false"
				@confirm="handleConfirm"
			/>
			<MuText size="small">Last action: <code>{{ last_action }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>modelValue</td><td><code>boolean</code></td><td>Required</td><td>Open state. Pass via <code>:model-value</code> — the modal doesn't emit <code>update:modelValue</code>, only <code>cancel</code> and <code>confirm</code>.</td></tr>
				<tr><td>title</td><td><code>string</code></td><td>Required</td><td>Bold heading shown above the description.</td></tr>
				<tr><td>description</td><td><code>string</code></td><td>Required</td><td>Body text explaining the action and its consequences.</td></tr>
				<tr><td>iconSrc</td><td><code>string</code></td><td><code>'/icons/custom/account/delete-photo-trash.svg'</code></td><td>Path to the illustration shown at the top.</td></tr>
				<tr><td>iconAlt</td><td><code>string</code></td><td><code>''</code></td><td>Alt text for the illustration. Leave empty if purely decorative.</td></tr>
				<tr><td>width</td><td><code>string</code></td><td><code>'520px'</code></td><td>Modal width. Forwarded to <code>UiModal</code>.</td></tr>
				<tr><td>modalClass</td><td><code>string</code></td><td><code>'delete-confirm-modal-shell'</code></td><td>Extra class on the modal container. Override to apply your own shell theme.</td></tr>
				<tr><td>cancelLabel</td><td><code>string</code></td><td>Required</td><td>Cancel button text.</td></tr>
				<tr><td>confirmLabel</td><td><code>string</code></td><td>Required</td><td>Confirm button text.</td></tr>
				<tr><td>confirmTone</td><td><code>ButtonTone</code></td><td><code>'danger'</code></td><td>Tone for the confirm button. Default <code>'danger'</code> matches the destructive intent.</td></tr>
				<tr><td>testId</td><td><code>string</code></td><td><code>'delete-confirm-modal'</code></td><td>Sets <code>data-testid</code> on the modal and derives <code>{testId}-cancel</code> / <code>{testId}-confirm</code> on the buttons.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<MuText size="small" color="var(--text-secondary)">None — the layout is fixed. Use the props for all text. If you need a custom layout, drop down to <code>UiModal</code> directly.</MuText>

		<MuHeading variant="6" weight="bold">Events</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Event</th><th>Payload</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>cancel</td><td><code>—</code></td><td>Emitted when the Cancel button is clicked, the backdrop is clicked, or ESC is pressed. You must flip <code>modelValue</code> to false yourself.</td></tr>
				<tr><td>confirm</td><td><code>—</code></td><td>Emitted when the Confirm button is clicked. You must flip <code>modelValue</code> to false yourself if you want the modal to close after confirming.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li><strong>No <code>v-model</code> support.</strong> The component takes <code>:model-value</code> as a one-way prop and emits only <code>cancel</code> / <code>confirm</code> — no <code>update:modelValue</code>. Drive state from the parent in your <code>@cancel</code> / <code>@confirm</code> handlers.</li>
			<li><strong>Header is hidden via <code>hide-header</code>.</strong> The underlying <code>UiModal</code>'s built-in title row is suppressed — the title visible here is the custom <code>&lt;h3&gt;</code> rendered inside the body.</li>
			<li><strong>The Confirm button is always destructive-styled.</strong> Even if you set <code>confirmTone</code>, the inner button template uses <code>tone="danger"</code> hard-coded. The prop is exposed but not currently wired to the button — open a tracking task if you need a non-danger confirm.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

const is_open = ref(false);
const last_action = ref('none');

function handleConfirm() {
	last_action.value = 'confirmed';
	is_open.value = false;
}
</script>

<style scoped lang="scss">
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
