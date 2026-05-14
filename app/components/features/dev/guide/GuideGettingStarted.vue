<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">Getting Started</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Use this page as the quickest way to add frontend UI components correctly.
		</MuText>

		<MuHeading variant="6" weight="bold">Quick Steps</MuHeading>
		<div class="guide-demo">
			<MuText>1. Build page layout first, then drop in UI components.</MuText>
			<MuText>2. Keep business logic in composables, keep component files UI-focused.</MuText>
			<MuText>3. Compose form fields with <code>UiFormField</code> + input components.</MuText>
			<MuText>4. Reuse shared variants instead of custom one-off styles.</MuText>
		</div>

		<MuHeading variant="6" weight="bold">Basic Usage Example</MuHeading>
		<div class="guide-demo">
			<pre class="guide-code"><code>{{ sample_code }}</code></pre>
		</div>
	</div>
</template>

<script setup lang="ts">
const sample_code = `<template>
  <UiFormField label="Email" required>
    <template #default="{ inputId, describedBy }">
      <UiInput
        :id="inputId"
        v-model="email"
        type="email"
        placeholder="name@example.com"
        :aria-describedby="describedBy || undefined"
      />
    </template>
  </UiFormField>

  <UiButton @click="submit">Submit</UiButton>
</template>

const email = ref('');
function submit() {
  // call composable/store action
}`;
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