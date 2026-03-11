<script setup lang="ts">
defineProps<{
	loading: boolean;
	loadingLabel: string;
	pageClass: string;
	shellClass: string;
	mainClass: string;
	summaryClass: string;
	testId: string;
	loadingTestId: string;
	overlayClass?: string;
	loaderClass?: string;
	transitionName?: string;
}>();
</script>

<template>
	<main :class="pageClass" :data-testid="testId">
		<UiLoadingOverlay
			:visible="loading"
			:label="loadingLabel"
			:test-id="loadingTestId"
			:overlay-class="overlayClass"
			:loader-class="loaderClass"
			:transition-name="transitionName"
		>
			<slot name="loader" />
		</UiLoadingOverlay>

		<section :class="shellClass">
			<section :class="mainClass">
				<slot name="main" />
			</section>

			<aside :class="summaryClass">
				<slot name="summary" />
			</aside>
		</section>
	</main>
</template>