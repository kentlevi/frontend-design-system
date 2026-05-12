<template>
	<MuLinearWrapper class="order-actions" direction="column">
		<MuLinearWrapper class="order-actions-items">
			<MuLinearWrapper :gap="16" align="center">
				<div class="order-actions-icon">
					<UiIcon name="regular-file-dollar" color="var(--gold-70)"/>
				</div>
				<MuLinearWrapper direction="column">
					<MuText weight="bold" size="large">View Invoice</MuText>
					<MuText color="abyss-40">Access and review detailed invoice information.</MuText>
				</MuLinearWrapper>
			</MuLinearWrapper>
		</MuLinearWrapper>
		<MuLinearWrapper class="order-actions-items" justify="space-between">
			<MuLinearWrapper :gap="16" align="center">
				<div class="order-actions-icon">
					<UiIcon name="regular-dollar-sign" color="var(--gold-70)"/>
				</div>
				<MuLinearWrapper direction="column">
					<MuText weight="bold" size="large">Payment Proof</MuText>
					<MuText color="abyss-40">Production will commence after payment completion.</MuText>
				</MuLinearWrapper>
			</MuLinearWrapper>
			<MuLinearWrapper direction="column" :gap="4" align="flex-end" >
				<UiBadge>Unpaid</UiBadge>
				<MuText color="abyss-40">Method: Bank Transfer</MuText>
			</MuLinearWrapper>
		</MuLinearWrapper>
		<MuLinearWrapper class="order-actions-items">

			<MuLinearWrapper :gap="16" align="center">
				<div class="order-actions-icon">
					<UiIcon name="regular-message" color="var(--gold-70)"/>
				</div>
				<MuLinearWrapper direction="column">
					<MuText weight="bold" size="large">Send a Message</MuText>
					<MuText color="abyss-40">Need an update or want to make changes?</MuText>
				</MuLinearWrapper>
			</MuLinearWrapper>
		</MuLinearWrapper>
	</MuLinearWrapper>
</template>

<script setup lang="ts">
import MuLinearWrapper from '~/components/base/MuLinearWrapper.vue';
import MuText from '~/components/base/MuText.vue';


</script>

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