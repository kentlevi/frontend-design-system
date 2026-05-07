<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">Getting Started</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Use this page as the quickest way to add frontend UI components correctly.
		</UiText>

		<UiHeading variant="6" weight="bold">Quick Steps</UiHeading>
		<div class="guide-demo">
			<UiText>1. Build page layout first, then drop in UI components.</UiText>
			<UiText>2. Keep business logic in composables, keep component files UI-focused.</UiText>
			<UiText>3. Compose form fields with <code>UiFormField</code> + input components.</UiText>
			<UiText>4. Reuse shared variants instead of custom one-off styles.</UiText>
		</div>

		<UiHeading variant="6" weight="bold">Basic Usage Example</UiHeading>
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