<script setup lang="ts">
</script>

<template>
	<div class="account-quote-layout" data-testid="account-quote-requests-layout">
		<FeaturesAccountQuoteRequestsContentSide />
		<FeaturesAccountQuoteRequestsContentMain />
	</div>
</template>

<style scoped lang="scss">
.account-quote-layout {
	display: grid;
	grid-template-columns: 320px 1fr;
	gap: 14px;
}

@media (max-width: 980px) {
	.account-quote-layout {
		grid-template-columns: 1fr;
	}
}
</style>