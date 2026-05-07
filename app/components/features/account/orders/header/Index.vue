<template>
	<UiLinearWrapper justify="space-between">
		<UiHeading weight="bold">My Orders</UiHeading>
		<UiLinearWrapper>
			<UiSegmented
				v-model="active"
				:options="active_options"
			/>
		</UiLinearWrapper>
	</UiLinearWrapper>
</template>

<script setup lang="ts">

const active = ref('active');

const active_options = [
	{ label: 'Active', value: 'active' },
	{ label: 'Inactive', value: 'inactive' },
];
</script>

<style lang="scss" scoped>

</style>