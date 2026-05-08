<script setup lang="ts">

withDefaults(defineProps<{
	embedded?: boolean;
}>(), {
	embedded: false,
});


</script>

<template>
	<section class="account-page" data-testid="account-orders-page">
		<AccountShellSection :embedded="embedded" active-tab="orders">
			<UiLinearWrapper class="account-page-content" data-testid="account-page-content" direction="column" :gap="24">
				<FeaturesAccountOrdersHeader />
				<FeaturesAccountOrdersContent />
			</UiLinearWrapper>
		</AccountShellSection>
	</section>
</template>

<style scoped lang="scss">
.account-page-content{
	padding: 40px 0;
}
</style>