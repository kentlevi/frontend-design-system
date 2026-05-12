<template>
	<MuLinearWrapper class="coupon-list" direction="column" :gap="16">
		<Item v-for="index in 5" :key="index"/>
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import Item from './Item.vue';
</script>

<style lang="scss" scoped>
</style>