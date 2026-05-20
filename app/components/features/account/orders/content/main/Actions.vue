<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';
import { useOrderDetailActions } from '~/composables/orders/useOrderDetailActions';

const { payment_status_label, payment_method_label } = useOrderDetailActions();
</script>

<template>
	<MuLinearWrapper class="order-actions" direction="column">
		<MuLinearWrapper class="order-actions-items">
			<MuLinearWrapper :gap="16" align="center">
				<div class="order-actions-icon">
					<UiIcon name="regular-file-dollar" color="var(--gold-70)"/>
				</div>
				<MuLinearWrapper direction="column">
					<MuText weight="bold" size="large">{{ $t('account.orders.viewInvoice') }}</MuText>
					<MuText color="abyss-40">{{ $t('account.orders.viewInvoiceText') }}</MuText>
				</MuLinearWrapper>
			</MuLinearWrapper>
		</MuLinearWrapper>
		<MuLinearWrapper class="order-actions-items" justify="space-between">
			<MuLinearWrapper :gap="16" align="center">
				<div class="order-actions-icon">
					<UiIcon name="regular-dollar-sign" color="var(--gold-70)"/>
				</div>
				<MuLinearWrapper direction="column">
					<MuText weight="bold" size="large">{{ $t('account.orders.paymentProof') }}</MuText>
					<MuText color="abyss-40">{{ $t('account.orders.paymentProofText') }}</MuText>
				</MuLinearWrapper>
			</MuLinearWrapper>
			<MuLinearWrapper direction="column" :gap="4" align="flex-end" >
				<UiBadge v-if="payment_status_label">{{ payment_status_label }}</UiBadge>
				<MuText v-if="payment_method_label" color="abyss-40">{{ $t('account.orders.paymentMethod', { method: payment_method_label }) }}</MuText>
			</MuLinearWrapper>
		</MuLinearWrapper>
		<MuLinearWrapper class="order-actions-items">

			<MuLinearWrapper :gap="16" align="center">
				<div class="order-actions-icon">
					<UiIcon name="regular-message" color="var(--gold-70)"/>
				</div>
				<MuLinearWrapper direction="column">
					<MuText weight="bold" size="large">{{ $t('account.orders.sendMessage') }}</MuText>
					<MuText color="abyss-40">{{ $t('account.orders.sendMessageText') }}</MuText>
				</MuLinearWrapper>
			</MuLinearWrapper>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<style lang="scss" scoped>
.order-actions {
	padding: 0 16px;
	margin-top: 16px;
	margin-bottom: 33px;
	.order-actions-items{
		padding: 16px 0;
		border-bottom: 1px solid var(--gray-50);
		cursor: pointer;
	}
	.order-actions-icon {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: var(--gold-10);
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
</style>