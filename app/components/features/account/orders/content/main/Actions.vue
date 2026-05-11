<template>
	<UiLinearWrapper class="order-actions" direction="column">
		<UiLinearWrapper class="order-actions-items">
			<UiLinearWrapper :gap="16" align="center">
				<div class="order-actions-icon">
					<UiIcon name="regular-file-dollar" color="var(--gold-70)"/>
				</div>
				<UiLinearWrapper direction="column">
					<UiText weight="bold" size="large">View Invoice</UiText>
					<UiText color="abyss-40">Access and review detailed invoice information.</UiText>
				</UiLinearWrapper>
			</UiLinearWrapper>
		</UiLinearWrapper>
		<UiLinearWrapper class="order-actions-items" justify="space-between">
			<UiLinearWrapper :gap="16" align="center">
				<div class="order-actions-icon">
					<UiIcon name="regular-dollar-sign" color="var(--gold-70)"/>
				</div>
				<UiLinearWrapper direction="column">
					<UiText weight="bold" size="large">Payment Proof</UiText>
					<UiText color="abyss-40">Production will commence after payment completion.</UiText>
				</UiLinearWrapper>
			</UiLinearWrapper>
			<UiLinearWrapper direction="column" :gap="4" align="flex-end" >
				<UiBadge>Unpaid</UiBadge>
				<UiText color="abyss-40">Method: Bank Transfer</UiText>
			</UiLinearWrapper>
		</UiLinearWrapper>
		<UiLinearWrapper class="order-actions-items">

			<UiLinearWrapper :gap="16" align="center">
				<div class="order-actions-icon">
					<UiIcon name="regular-message" color="var(--gold-70)"/>
				</div>
				<UiLinearWrapper direction="column">
					<UiText weight="bold" size="large">Send a Message</UiText>
					<UiText color="abyss-40">Need an update or want to make changes?</UiText>
				</UiLinearWrapper>
			</UiLinearWrapper>
		</UiLinearWrapper>
	</UiLinearWrapper>
</template>

<script setup lang="ts">

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