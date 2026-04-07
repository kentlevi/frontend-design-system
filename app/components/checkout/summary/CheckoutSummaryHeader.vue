<template>
	<div class="checkout-summary-title">
		<span>Order Summary</span>
		<div class="checkout-summary-title-actions">
			<UiButton
				type="button"
				variant="ghost"
				tone="neutral"
				size="sm"
				:no-hover="true"
				class="checkout-summary-title-action"
				aria-label="Edit order summary"
				@click="goToCart"
			>
				<UiIcon name="regular-edit" size="24px" color="var(--text-primary)" decorative />
			</UiButton>
			<UiButton
				type="button"
				variant="ghost"
				tone="neutral"
				size="sm"
				:no-hover="true"
				class="checkout-summary-title-action"
				aria-label="Print order summary"
				@click="goToInvoice"
			>
				<UiIcon name="regular-print" size="24px" color="var(--text-primary)" decorative />
			</UiButton>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCountry } from '~/composables/app/country/useCountry';

const { withCountry } = useCountry();

function goToCart() {
	void navigateTo(withCountry('/cart'));
}

function goToInvoice() {
	void navigateTo(withCountry('/checkout/invoice'));
}
</script>

<style scoped lang="scss">
.checkout-summary-title {
	padding: 12px 24px;
	border-bottom: 1px solid var(--gray-50);
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);

	.checkout-summary-title-actions {
		display: inline-flex;
		align-items: center;
		gap: 12px;

		.checkout-summary-title-action {
			width: 32px;
			height: 32px;
			padding: 4px;
			min-height: auto;
			color: var(--text-primary);
			display: inline-flex;
			align-items: center;
			justify-content: center;
			box-shadow: none;

			&:hover {
				background: var(--gray-20);
				border-radius: var(--radius-md);
			}
		}
	}
}
</style>