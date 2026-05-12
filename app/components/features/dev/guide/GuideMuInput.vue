<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuInput</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			A flexible text input component combining admin MuInput structure with frontend UiInput styling. Supports multiple sizes, states, and icon slots.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-inputs">
				<MuInput
					id="basic-input"
					name="basic"
					v-model="basic"
					placeholder="Type something..."
				/>
				<MuText size="small">Value: <code>{{ basic || '(empty)' }}</code></MuText>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">With Label</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-inputs">
				<MuInput
					id="email-input"
					name="email"
					v-model="email"
					type="email"
					placeholder="example@mail.com"
				>
					<template #label>Email Address</template>
				</MuInput>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Sizes</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-inputs">
				<MuInput
					id="size-lg"
					name="size-lg"
					v-model="text_lg"
					size="lg"
					placeholder="Large size..."
				>
					<template #label>Large (lg)</template>
				</MuInput>
				<MuInput
					id="size-md"
					name="size-md"
					v-model="text_md"
					size="md"
					placeholder="Medium size..."
				>
					<template #label>Medium (md) - Default</template>
				</MuInput>
				<MuInput
					id="size-sm"
					name="size-sm"
					v-model="text_sm"
					size="sm"
					placeholder="Small size..."
				>
					<template #label>Small (sm)</template>
				</MuInput>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">States</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-inputs">
				<MuInput
					id="default-input"
					name="default"
					v-model="default_val"
					placeholder="Default state"
					state="default"
				>
					<template #label>Default</template>
				</MuInput>
				<MuInput
					id="success-input"
					name="success"
					v-model="success_val"
					placeholder="Success state"
					state="success"
				>
					<template #label>Success</template>
				</MuInput>
				<MuInput
					id="error-input"
					name="error"
					v-model="error_val"
					placeholder="Error state"
					state="error"
					:hasError="true"
				>
					<template #label>Error</template>
					<template #error>This field is required</template>
				</MuInput>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">With Prefix/Suffix</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-inputs">
				<MuInput
					id="prefix-input"
					name="prefix"
					v-model="prefix_val"
					type="number"
					placeholder="0.00"
				>
					<template #label>Price</template>
					<template #prefix>$</template>
				</MuInput>
				<MuInput
					id="suffix-input"
					name="suffix"
					v-model="suffix_val"
					type="number"
					placeholder="100"
				>
					<template #label>Quantity</template>
					<template #suffix>pcs</template>
				</MuInput>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">With Icons (Inner Slots)</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-inputs">
				<MuInput
					id="search-input"
					name="search"
					v-model="search_val"
					type="search"
					placeholder="Search..."
				>
					<template #label>Search</template>
					<template #inner-left>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.35-4.35" />
						</svg>
					</template>
				</MuInput>
				<MuInput
					id="password-input"
					name="password"
					v-model="password_val"
					:type="show_password ? 'text' : 'password'"
					placeholder="Enter password"
				>
					<template #label>Password</template>
					<template #inner-right>
						<button
							type="button"
							class="icon-btn"
							@click="show_password = !show_password"
						>
							<svg v-if="show_password" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
								<circle cx="12" cy="12" r="3" />
							</svg>
							<svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
								<line x1="1" y1="1" x2="23" y2="23" />
							</svg>
						</button>
					</template>
				</MuInput>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Disabled & Readonly</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-inputs">
				<MuInput
					id="disabled-input"
					name="disabled"
					v-model="disabled_val"
					placeholder="Disabled input"
					disabled
				>
					<template #label>Disabled</template>
				</MuInput>
				<MuInput
					id="readonly-input"
					name="readonly"
					v-model="readonly_val"
					placeholder="Readonly input"
					readonly
				>
					<template #label>Readonly</template>
				</MuInput>
			</div>
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
					<td>modelValue</td>
					<td><code>string | number | null</code></td>
					<td><code>''</code></td>
					<td>Input value (v-model).</td>
				</tr>
				<tr>
					<td>name</td>
					<td><code>string</code></td>
					<td>Required</td>
					<td>Input name attribute.</td>
				</tr>
				<tr>
					<td>id</td>
					<td><code>string</code></td>
					<td>Required</td>
					<td>Input id attribute for label binding.</td>
				</tr>
				<tr>
					<td>type</td>
					<td><code>string</code></td>
					<td><code>'text'</code></td>
					<td>HTML input type (text, email, password, number, search, tel, url).</td>
				</tr>
				<tr>
					<td>placeholder</td>
					<td><code>string</code></td>
					<td><code>''</code></td>
					<td>Placeholder text.</td>
				</tr>
				<tr>
					<td>size</td>
					<td><code>'lg' | 'md' | 'sm'</code></td>
					<td><code>'md'</code></td>
					<td>Component size (large, medium, small).</td>
				</tr>
				<tr>
					<td>state</td>
					<td><code>'default' | 'error' | 'success'</code></td>
					<td><code>'default'</code></td>
					<td>Visual state. Use hasError prop to trigger error state.</td>
				</tr>
				<tr>
					<td>hasError</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>When true, displays error state and error slot.</td>
				</tr>
				<tr>
					<td>disabled</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Disables the input field.</td>
				</tr>
				<tr>
					<td>readonly</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Makes input read-only.</td>
				</tr>
				<tr>
					<td>required</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Required attribute.</td>
				</tr>
				<tr>
					<td>autocomplete</td>
					<td><code>string</code></td>
					<td><code>'on'</code></td>
					<td>Autocomplete attribute.</td>
				</tr>
				<tr>
					<td>inputClass</td>
					<td><code>string</code></td>
					<td><code>''</code></td>
					<td>Custom CSS classes for the input field.</td>
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
					<td>label</td>
					<td>Custom label content. Rendered above the input field.</td>
				</tr>
				<tr>
					<td>prefix</td>
					<td>Content rendered before the input (e.g., $ symbol).</td>
				</tr>
				<tr>
					<td>suffix</td>
					<td>Content rendered after the input (e.g., unit label).</td>
				</tr>
				<tr>
					<td>inner-left</td>
					<td>Icon or element on the left side inside the input.</td>
				</tr>
				<tr>
					<td>inner-right</td>
					<td>Icon or element on the right side inside the input.</td>
				</tr>
				<tr>
					<td>error</td>
					<td>Error message content. Displayed when hasError is true.</td>
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
					<td><code>string | number | null</code></td>
					<td>Emitted when input value changes. Use with v-model.</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
import MuInput from '~/components/base/MuInput.vue';

const basic = ref('');
const email = ref('');
const text_lg = ref('');
const text_md = ref('');
const text_sm = ref('');
const default_val = ref('Default state');
const success_val = ref('Valid input');
const error_val = ref('');
const prefix_val = ref('');
const suffix_val = ref('');
const search_val = ref('');
const password_val = ref('');
const show_password = ref(false);
const disabled_val = ref('This is disabled');
const readonly_val = ref('This is readonly');
</script>

<style lang="scss" scoped>
.guide-demo-inputs {
	display: flex;
	flex-direction: column;
	gap: 16px;
	max-width: 400px;
}

.icon-btn {
	background: none;
	border: none;
	cursor: pointer;
	padding: 4px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: var(--text-muted);
	transition: color 0.2s ease;

	&:hover {
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
