<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiFormField</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Composable label + hint + error wrapper for form controls. Auto-generates IDs for label binding and ARIA <code>aria-describedby</code> wiring. The actual control goes in the default slot, which receives scoped props for the IDs.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic</MuHeading>
		<div class="guide-demo">
			<UiFormField
				label="Email"
				hint="We only use this for account updates."
				:error="show_error ? 'Email is required.' : ''"
				required
				show-required-mark
			>
				<template #default="{ inputId, describedBy }">
					<UiInput
						:id="inputId"
						v-model="email"
						name="email"
						type="email"
						placeholder="name@example.com"
						:aria-describedby="describedBy || undefined"
					/>
				</template>
			</UiFormField>
			<div class="guide-spacer" />
			<UiButton size="sm" @click="show_error = !show_error">Toggle error</UiButton>
		</div>

		<MuHeading variant="6" weight="bold">Custom label slot</MuHeading>
		<div class="guide-demo">
			<UiFormField label="Password" hint="At least 8 characters">
				<template #label="{ required }">
					<span class="guide-custom-label">
						Password
						<UiBadge tone="default" size="sm">required: {{ String(required) }}</UiBadge>
					</span>
				</template>
				<template #default="{ inputId }">
					<UiInput :id="inputId" v-model="password" name="password" type="password" />
				</template>
			</UiFormField>
		</div>

		<MuHeading variant="6" weight="bold">Properties</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
			<tbody>
				<tr><td>label</td><td><code>string</code></td><td><code>''</code></td><td>Label text. When empty, no <code>&lt;label&gt;</code> renders.</td></tr>
				<tr><td>forId</td><td><code>string</code></td><td><code>''</code></td><td>Override the auto-generated input ID. Use when you already have a stable id you want the label to point to.</td></tr>
				<tr><td>error</td><td><code>string</code></td><td><code>''</code></td><td>Error message. Renders next to the label and is included in <code>describedBy</code> on the slot scope.</td></tr>
				<tr><td>hint</td><td><code>string</code></td><td><code>''</code></td><td>Helper text below the input. Auto-wired into <code>aria-describedby</code>.</td></tr>
				<tr><td>required</td><td><code>boolean</code></td><td><code>false</code></td><td>Forwarded to the <code>#label</code> slot scope. Doesn't enforce native required — set that on your input.</td></tr>
				<tr><td>showRequiredMark</td><td><code>boolean</code></td><td><code>false</code></td><td>Adds an asterisk next to the label when <code>required</code> is true.</td></tr>
				<tr><td>inputId</td><td><code>string</code></td><td><code>''</code></td><td>Force a specific input ID. Otherwise auto-derived via <code>useId()</code>.</td></tr>
				<tr><td>errorId</td><td><code>string</code></td><td><code>''</code></td><td>Force a specific error element ID. Defaults to <code>{inputId}-error</code>.</td></tr>
				<tr><td>hintId</td><td><code>string</code></td><td><code>''</code></td><td>Force a specific hint element ID. Defaults to <code>{inputId}-hint</code>.</td></tr>
				<tr><td>errorTestId</td><td><code>string</code></td><td><code>'ui-form-field-error-message'</code></td><td><code>data-testid</code> on the error message element.</td></tr>
				<tr><td>headClass</td><td><code>string</code></td><td><code>''</code></td><td>Extra class on the <code>.ui-form-field-head</code> (label row).</td></tr>
				<tr><td>labelClass</td><td><code>string</code></td><td><code>''</code></td><td>Extra class on the <code>&lt;label&gt;</code>.</td></tr>
				<tr><td>labelTextClass</td><td><code>string</code></td><td><code>''</code></td><td>Extra class on the inner label text span.</td></tr>
				<tr><td>errorClass</td><td><code>string</code></td><td><code>''</code></td><td>Extra class on the error message.</td></tr>
				<tr><td>hintClass</td><td><code>string</code></td><td><code>''</code></td><td>Extra class on the hint paragraph.</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<table class="guide-table">
			<thead><tr><th>Slot</th><th>Scope</th><th>Description</th></tr></thead>
			<tbody>
				<tr>
					<td>default</td>
					<td><code>{ inputId, describedBy, errorId, hintId, required }</code></td>
					<td>The actual input control. Bind the scope's <code>inputId</code> to your input's <code>id</code> and pass <code>describedBy</code> to <code>aria-describedby</code> for full a11y wiring.</td>
				</tr>
				<tr><td>label</td><td><code>{ required }</code></td><td>Replaces the default label rendering. Receives <code>required</code> in scope.</td></tr>
				<tr><td>label-right</td><td><code>—</code></td><td>Content rendered on the right side of the label row. Default behavior shows the error message here.</td></tr>
				<tr><td>hint</td><td><code>{ hintId }</code></td><td>Replaces the default hint paragraph. Use for rich hint UI (links, badges).</td></tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Notes &amp; gotchas</MuHeading>
		<ul class="guide-notes">
			<li><strong>Always pass <code>inputId</code> to your control.</strong> The auto-ID is the whole reason this wrapper exists — without binding it, the <code>&lt;label&gt;</code> doesn't connect to the input and clicks on the label won't focus the field.</li>
			<li><strong><code>describedBy</code> is space-separated.</strong> When both <code>hint</code> and <code>error</code> are present, <code>describedBy</code> returns both IDs joined with a space — the correct format for <code>aria-describedby</code>.</li>
			<li><strong><code>required</code> doesn't enforce anything.</strong> It only renders the asterisk (when <code>showRequiredMark</code> is also true) and is exposed in slot scope. Native required must be set on your input separately.</li>
			<li><strong><code>label-right</code> overrides error display.</strong> Filling the <code>label-right</code> slot suppresses the default error rendering in that spot — you'd need to re-render the error yourself if you want both.</li>
		</ul>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';

const email = ref('');
const password = ref('');
const show_error = ref(false);
</script>

<style scoped lang="scss">
.guide-spacer { height: 8px; }

.guide-custom-label {
	display: inline-flex;
	align-items: center;
	gap: 8px;
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
