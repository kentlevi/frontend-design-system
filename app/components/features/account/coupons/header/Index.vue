<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuHeading from '~/components/base/MuHeading.vue';

const { t } = useI18n();
</script>

<template>
	<MuLinearWrapper
		class="account-coupons-header"
		data-testid="account-coupons-header"
		justify="space-between"
		align="center"
		:gap="16"
	>
		<MuHeading variant="4" weight="bold" class="account-coupons-title" data-testid="account-coupons-title">
			{{ t('account.coupons.title') }}
		</MuHeading>
		<MuLinearWrapper
			class="account-coupons-add-row"
			data-testid="account-coupons-add-row"
			align="center"
			:gap="8"
		>
			<UiInput
				model-value=""
				type="text"
				class="account-coupons-code-input"
				:placeholder="t('account.coupons.codePlaceholder')"
				data-testid="account-coupons-code-input"
			/>
			<UiButton variant="filled" tone="neutral" size="md" data-testid="account-coupons-add-button">
				{{ t('account.coupons.addCoupon') }}
			</UiButton>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<style scoped lang="scss">
.account-coupons-header {
	margin-bottom: 20px;
}

.account-coupons-add-row {
	.account-coupons-code-input {
		width: 420px;
	}
}
</style>
