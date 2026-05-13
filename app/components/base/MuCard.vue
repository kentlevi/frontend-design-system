<script setup lang="ts">
import type { CardVariant, CardPadding, CardRadius, CardBordered } from '~/data/ui/cards';

withDefaults(
	defineProps<{
		variant?: CardVariant;
		padding?: CardPadding;
		radius?: CardRadius;
		bordered?: CardBordered;
		disabled?: boolean;
	}>(),
	{
		variant: 'default',
		padding: 'md',
		radius: 'md',
		bordered: 'default',
		disabled: false,
	}
);
</script>

<template>
	<div
		:class="['ui-card', { 'is-disabled': disabled }]"
		:data-variant="variant"
		:data-padding="padding"
		:data-radius="radius"
		:data-bordered="bordered"
		:data-disabled="disabled || null"
	>
		<slot />
	</div>
</template>