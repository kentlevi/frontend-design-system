<script setup lang="ts">
import MuCard from '~/components/base/MuCard.vue';
</script>

<template>
	<MuCard
		padding="none"
		class="account-quote-chat"
		data-testid="account-quote-requests-chat"
	>
		<FeaturesAccountQuoteRequestsContentMainHeader />
		<FeaturesAccountQuoteRequestsContentMainMessages />
		<FeaturesAccountQuoteRequestsContentMainFooter />
	</MuCard>
</template>

<style scoped lang="scss">
.account-quote-chat {
	min-height: 460px;
	display: grid;
	grid-template-rows: auto 1fr auto;
}
</style>