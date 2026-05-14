<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">Page Example</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Minimal section example that combines text, field controls, and actions.
		</MuText>

		<MuHeading variant="6" weight="bold">Live Preview</MuHeading>
		<div class="guide-demo">
			<MuHeading variant="6" weight="semi-bold">Contact Preference</MuHeading>
			<UiFormField label="Preferred channel" required>
				<template #default="{ inputId }">
					<UiSelect
						:id="inputId"
						v-model="channel"
						:options="channels"
						placeholder="Select channel"
					/>
				</template>
			</UiFormField>
			<UiFormField label="Notes" hint="Optional details for the support team.">
				<template #default="{ inputId }">
					<MuTextarea :id="inputId" v-model="notes" :rows="4" />
				</template>
			</UiFormField>
			<div class="guide-demo-row">
				<UiButton variant="ghost" tone="neutral">Cancel</UiButton>
				<UiButton>Save Preference</UiButton>
			</div>
		</div>

		<MuHeading variant="6" weight="bold">Template Skeleton</MuHeading>
		<div class="guide-demo">
			<pre class="guide-code"><code>{{ skeleton_code }}</code></pre>
		</div>
	</div>
</template>

<script setup lang="ts">
const channel = ref<string | number | null>(null);
const notes = ref('');
const channels = [
	{ label: 'Email', value: 'email' },
	{ label: 'Live Chat', value: 'chat' },
	{ label: 'Phone', value: 'phone' },
];

const skeleton_code = `<UiFormField label="Preferred channel" required>
  <template #default="{ inputId }">
    <UiSelect :id="inputId" v-model="channel" :options="channels" />
  </template>
</UiFormField>

<UiFormField label="Notes">
  <template #default="{ inputId }">
    <MuTextarea :id="inputId" v-model="notes" :rows="4" />
  </template>
</UiFormField>

<UiButton>Save</UiButton>`;
</script>

<style scoped lang="scss">
.guide-code {
	margin: 0;
	padding: 14px;
	background: #0f172a;
	color: #e5e7eb;
	border-radius: 8px;
	font-size: 12px;
	overflow-x: auto;
}
</style>