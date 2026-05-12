<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuTextarea</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Multiline text input with state and resize control.
		</MuText>

		<MuHeading variant="6" weight="bold">Example</MuHeading>
		<div class="guide-demo">
			<MuTextarea
				v-model="message"
				placeholder="Write your notes here"
				:rows="5"
				resize="vertical"
			/>
			<MuText size="small">{{ message.length }} characters</MuText>
		</div>
	</div>
</template>

<script setup lang="ts">
const message = ref('');
</script>
