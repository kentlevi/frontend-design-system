<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
</script>

<template>
	<section class="account-page" data-testid="account-orders-page">
		<MuLinearWrapper class="account-page-content" data-testid="account-page-content" direction="column" :gap="24">
			<FeaturesAccountOrdersHeader />
			<FeaturesAccountOrdersContent />
			<!-- <FeaturesAccountOrdersNoOrders/> -->
			<FeaturesAccountOrdersModalsUploadArworkModal />
		</MuLinearWrapper>
		<!-- <MuLinearWrapper class="account-page-no-content" data-testid="account-page-no-content" direction="column" :gap="24">
			<FeaturesAccountOrdersNoContent />
		</MuLinearWrapper> -->
	</section>
</template>

<style scoped lang="scss">
.account-page-content{
	padding: 40px 0;
}
.account-page-no-content{
	padding: 168px 0;
}
</style>