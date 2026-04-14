<script setup lang="ts">
import { useCheckoutFeatureTransition } from '~/composables/checkout/features/useCheckoutFeatureTransition';

const { beforeEnter, enter, afterEnter, beforeLeave, leave, afterLeave } = useCheckoutFeatureTransition()
</script>

<template>
	<Transition
		@before-enter="beforeEnter"
		@enter="enter"
		@after-enter="afterEnter"
		@before-leave="beforeLeave"
		@leave="leave"
		@after-leave="afterLeave"
	>
		<slot />
	</Transition>
</template>