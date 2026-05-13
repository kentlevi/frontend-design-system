<script setup lang="ts">
import type { CardVariant, CardPadding, CardRadius, CardBordered } from '~/data/ui/cards';

withDefaults(
	defineProps<{
		variant?: CardVariant;
		padding?: CardPadding;
		radius?: CardRadius;
		bordered?: CardBordered;
	}>(),
	{
		variant: 'default',
		padding: 'md',
		radius: 'md',
		bordered: 'default',
	}
);
</script>

<template>
	<div
		class="ui-card"
		:data-variant="variant"
		:data-padding="padding"
		:data-radius="radius"
		:data-bordered="bordered"
	>
		<slot />
	</div>
</template>