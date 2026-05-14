<script setup lang="ts">
import MuHeading from '~/components/base/MuHeading.vue';
import MuText from '~/components/base/MuText.vue';
</script>

<template>
	<div class="guide-section">
		<MuHeading variant="5" weight="bold">MuLinearWrapper</MuHeading>
		<MuText size="small" color="var(--text-secondary)">
			Flex layout helper for direction, spacing, and alignment.
		</MuText>

		<MuHeading variant="6" weight="bold">Row</MuHeading>
		<div class="guide-demo">
			<MuLinearWrapper :gap="12" align="center">
				<UiBadge tone="default">Item 1</UiBadge>
				<UiBadge tone="success">Item 2</UiBadge>
				<UiBadge tone="warning">Item 3</UiBadge>
			</MuLinearWrapper>
		</div>

		<MuHeading variant="6" weight="bold">Column</MuHeading>
		<div class="guide-demo">
			<MuLinearWrapper direction="column" :gap="8">
				<MuText>First row</MuText>
				<MuText>Second row</MuText>
				<MuText>Third row</MuText>
			</MuLinearWrapper>
		</div>
	</div>
</template>

<script setup lang="ts">
</script>