<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiFormField</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Wrapper that provides label, hint, and error states for form controls.
		</UiText>

		<UiHeading variant="6" weight="bold">Example</UiHeading>
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
						type="email"
						placeholder="name@example.com"
						:aria-describedby="describedBy || undefined"
					/>
				</template>
			</UiFormField>
			<UiButton size="sm" @click="show_error = !show_error">
				Toggle Error
			</UiButton>
		</div>
	</div>
</template>

<script setup lang="ts">
const email = ref('');
const show_error = ref(false);
</script>