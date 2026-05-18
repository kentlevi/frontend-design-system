<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import Entry from './Entry.vue';
</script>

<template>
	<section class="activity-logs">
		<MuLinearWrapper direction="column" :gap="16">
			<MuText size="large" weight="bold">Activity Logs:</MuText>
			<MuLinearWrapper direction="column" :gap="20">
				<Entry />
			</MuLinearWrapper>
		</MuLinearWrapper>
	</section>
</template>

<style scoped lang="scss">
.activity-logs {
	width: 100%;
	max-width: 720px;
	margin: 0 auto;
}
</style>