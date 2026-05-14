<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">UiInput</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Text input component with icon slot support.
		</MuText>

		<MuHeading variant="6" weight="bold">Basic</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-inputs">
				<UiInput v-model="basic" type="text" placeholder="Type something..." />
				<MuText size="small">Value: <code>{{ basic || '(empty)' }}</code></MuText>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">With Icon Slots</MuHeading>
		<div class="guide-demo">
			<div class="guide-demo-inputs">
				<UiInput v-model="search" type="search" placeholder="Search...">
					<template #icon-left>
						<UiIcon name="regular-search" :size="20" color="var(--text-secondary)" />
					</template>
				</UiInput>
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
					<td><code>string</code></td>
					<td>—</td>
					<td>Input value (v-model).</td>
				</tr>
				<tr>
					<td>type</td>
					<td><code>text | search | email | password | number</code></td>
					<td><code>text</code></td>
					<td>HTML input type.</td>
				</tr>
				<tr>
					<td>placeholder</td>
					<td><code>string</code></td>
					<td><code>''</code></td>
					<td>Placeholder text.</td>
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
					<td>icon-left</td>
					<td>Content rendered before the input field.</td>
				</tr>
				<tr>
					<td>icon-right</td>
					<td>Content rendered after the input field.</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script setup lang="ts">
const basic = ref('');
const search = ref('');
</script>

<style lang="scss" scoped>
.guide-demo-inputs {
	display: flex;
	flex-direction: column;
	gap: 8px;
	max-width: 400px;
}
</style>