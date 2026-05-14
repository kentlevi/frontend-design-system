<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuSegmented</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Segmented control for switching between small sets of options.
			Supports default option rendering and custom slot rendering.
		</MuText>

		<MuHeading variant="6" weight="bold">Example: Default</MuHeading>
		<div class="guide-demo">
			<MuSegmented
				v-model="unit"
				:options="unit_options"
			/>
			<MuText size="small">Selected: <code>{{ unit }}</code></MuText>
		</div>

		<MuHeading variant="6" weight="bold">Sizes</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-row">
				<div>
					<MuText size="xsmall" weight="semi-bold">SM</MuText>
					<MuSegmented v-model="size_sm" :options="size_options" size="sm" />
				</div>
				<div>
					<MuText size="xsmall" weight="semi-bold">MD (default)</MuText>
					<MuSegmented v-model="size_md" :options="size_options" size="md" />
				</div>
				<div>
					<MuText size="xsmall" weight="semi-bold">LG</MuText>
					<MuSegmented v-model="size_lg" :options="size_options" size="lg" />
				</div>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Full Width</MuHeading>
		<div class="guide-demo">
			<MuSegmented v-model="full_value" :options="full_options" full />
		</div>

		<MuHeading variant="6" weight="bold">Fit (content-based width)</MuHeading>
		<div class="guide-demo">
			<MuSegmented v-model="fit_value" :options="fit_options" fit />
		</div>

		<MuHeading variant="6" weight="bold">Disabled</MuHeading>
		<div class="guide-demo">
			<MuSegmented v-model="disabled_value" :options="unit_options" disabled />
		</div>

		<MuHeading variant="6" weight="bold">Custom Slot</MuHeading>
		<div class="guide-demo">
			<MuSegmented v-model="slot_value" :options="slot_options">
				<template #option="{ option, is_active }">
					<span class="guide-dot" :class="{ 'is-active': is_active }" />
					<MuText variant="span" :weight="is_active ? 'bold' : 'regular'" size="small">
						{{ option.label }}
					</MuText>
				</template>
			</MuSegmented>
			<MuText size="small">Selected: <code>{{ slot_value }}</code></MuText>
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
					<td><code>string | number</code></td>
					<td>—</td>
					<td>Current selected value.</td>
				</tr>
				<tr>
					<td>options</td>
					<td><code>{ label, value, disabled? }[]</code></td>
					<td>—</td>
					<td>Option list.</td>
				</tr>
				<tr>
					<td>size</td>
					<td><code>'sm' | 'md' | 'lg'</code></td>
					<td><code>'md'</code></td>
					<td>Button padding size.</td>
				</tr>
				<tr>
					<td>full</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Stretch to 100% width.</td>
				</tr>
				<tr>
					<td>fit</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Content-based width per button.</td>
				</tr>
				<tr>
					<td>disabled</td>
					<td><code>boolean</code></td>
					<td><code>false</code></td>
					<td>Disable all options.</td>
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
					<td><code>string | number</code></td>
					<td>Emitted on selection change.</td>
				</tr>
				<tr>
					<td>change</td>
					<td><code>string | number</code></td>
					<td>Mirror event for selection updates.</td>
				</tr>
			</tbody>
		</table>

		<MuHeading variant="6" weight="bold">Slots</MuHeading>
		<table class="guide-table">
			<thead>
				<tr>
					<th>Slot</th>
					<th>Props</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>option</td>
					<td><code>{ option, is_active, is_disabled }</code></td>
					<td>Custom render for each option button.</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
const unit = ref('mm');
const unit_options = [
	{ label: 'mm', value: 'mm' },
	{ label: 'cm', value: 'cm' },
];

const size_sm = ref('a');
const size_md = ref('a');
const size_lg = ref('a');
const size_options = [
	{ label: 'Option A', value: 'a' },
	{ label: 'Option B', value: 'b' },
];

const full_value = ref('active');
const full_options = [
	{ label: 'Active', value: 'active' },
	{ label: 'Inactive', value: 'inactive' },
];

const fit_value = ref('short');
const fit_options = [
	{ label: 'Short', value: 'short' },
	{ label: 'A Much Longer Label', value: 'long' },
];

const disabled_value = ref('mm');

const slot_value = ref('passed');
const slot_options = [
	{ label: 'Passed', value: 'passed' },
	{ label: 'Failed', value: 'failed' },
];
</script>

<style lang="scss" scoped>
.guide-demo-row {
	display: flex;
	gap: 24px;
	align-items: flex-start;
	flex-wrap: wrap;

	> div {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
}

.guide-dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: var(--text-muted);
	display: inline-block;

	&.is-active {
		background: var(--contrast-light);
	}
}
</style>