<template>
	<UiLinearWrapper class="list" direction="column" :gap="16">
		<UiText weight="bold">Order Summary:</UiText>
		<Item v-for="index in 5" :key="index"/>
	</UiLinearWrapper>
</template>

<script setup lang="ts">
import Item from './Item.vue';
</script>

<style lang="scss" scoped>
.list{
	padding-bottom: 16px;
	border-bottom: solid 1px var(--gray-50);
}
</style>