<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import Preview from './Preview.vue';
import ActivityLogs from './activity-logs/Index.vue';
</script>

<template>
	<MuLinearWrapper
		direction="column"
		:gap="40"
		width="100%"
		overflow-y="auto"
		class="artwork-detail-content"
	>
		<Preview />
		<ActivityLogs />
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.artwork-detail-content {
	flex: 1;
	padding: 40px 0;
}
</style>
