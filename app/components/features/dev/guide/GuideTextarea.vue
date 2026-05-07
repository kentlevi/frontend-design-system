<template>
	<div class="guide-section">
		<UiHeading variant="5" weight="bold">UiTextarea</UiHeading>
		<UiText size="small" color="var(--text-secondary)">
			Multiline text input with state and resize control.
		</UiText>

		<UiHeading variant="6" weight="bold">Example</UiHeading>
		<div class="guide-demo">
			<UiTextarea
				v-model="message"
				placeholder="Write your notes here"
				:rows="5"
				resize="vertical"
			/>
			<UiText size="small">{{ message.length }} characters</UiText>
		</div>
	</div>
</template>

<script setup lang="ts">
const message = ref('');
</script>