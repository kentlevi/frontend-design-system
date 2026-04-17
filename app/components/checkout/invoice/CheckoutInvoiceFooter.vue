<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
</script>

<template>
	<footer class="checkout-invoice-footer">
		<div class="checkout-invoice-footer-copy">
			<strong>Musticker</strong>
			<span>{{ t('checkout.invoice.footerAddress') }}</span>
		</div>
		<strong>www.musticker.com</strong>
	</footer>
</template>

<style scoped lang="scss">
.checkout-invoice-footer {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	gap: 16px;
	padding: 30px 40px 34px;
	background: #ffffff;
	color: var(--text-secondary);
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);

	.checkout-invoice-footer-copy {
		display: grid;
		gap: 6px;

		strong {
			color: var(--text-primary);
			font-size: 18px;
			line-height: 1.3;
			font-weight: 700;
		}
	}
}

@media (max-width: 900px) {
	.checkout-invoice-footer {
		padding-left: 24px;
		padding-right: 24px;
	}
}

@media (max-width: 640px) {
	.checkout-invoice-footer {
		flex-direction: column;
		align-items: flex-start;
	}
}
</style>