<script setup lang="ts">
import Item from './Item.vue';
</script>

<template>
	<div class="list">
		<Item v-for="index in 6" :key="index" />
	</div>
</template>

<style scoped lang="scss">
.list {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 32px;
}

@media (max-width: 1180px) {
	.list {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		justify-content: initial;
	}
}

@media (max-width: 760px) {
	.list {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
	}
}
</style>
