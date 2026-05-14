<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t: translate } = useI18n();

defineProps<{
	onClose: () => void;
	onPrint: () => void;
	onDownload: () => void;
}>();
</script>

<template>
	<header class="checkout-invoice-topbar">
		<div class="checkout-invoice-topbar-inner">
			<button type="button" class="checkout-invoice-topbar-button" @click="onClose">
				{{ translate('checkout.invoice.close') }}
			</button>
			<h1 class="checkout-invoice-topbar-title">{{ translate('checkout.invoice.title') }}</h1>
			<div class="checkout-invoice-topbar-actions">
				<button type="button" class="checkout-invoice-topbar-button checkout-invoice-topbar-button--icon" @click="onPrint">
					<UiIcon name="regular-print" size="18" color="currentColor" decorative />
					{{ translate('checkout.invoice.print') }}
				</button>
				<button type="button" class="checkout-invoice-topbar-button checkout-invoice-topbar-button--icon" @click="onDownload">
					<UiIcon name="regular-download" size="18" color="currentColor" decorative />
					{{ translate('checkout.invoice.download') }}
				</button>
			</div>
		</div>
	</header>
</template>

<style scoped lang="scss">
.checkout-invoice-topbar {
	position: sticky;
	top: 0;
	z-index: 10;
	border-bottom: 1px solid var(--gray-30);
	background: rgba(255, 255, 255, 0.98);
	backdrop-filter: blur(8px);

	.checkout-invoice-topbar-inner {
		position: relative;
		max-width: 1360px;
		margin: 0 auto;
		min-height: 58px;
		padding: 10px 18px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.checkout-invoice-topbar-title {
		margin: 0;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		font-size: 16px;
		line-height: 1.2;
		font-weight: var(--font-weight-bold);
		color: var(--text-primary);
		text-align: center;
		pointer-events: none;
	}

	.checkout-invoice-topbar-actions {
		display: inline-flex;
		align-items: center;
		justify-content: flex-end;
		gap: 12px;
	}

	.checkout-invoice-topbar-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: 32px;
		padding: 0 14px;
		border: 1px solid var(--gray-60);
		border-radius: 999px;
		background: var(--contrast-light);
		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);
		font-weight: var(--font-weight-semibold);
		cursor: pointer;
		transition:
			background 0.2s ease,
			border-color 0.2s ease,
			transform 0.16s ease;

		&:hover {
			background: var(--gray-10);
		}

		&:active {
			transform: scale(0.98);
		}
	}
}

@media (max-width: 900px) {
	.checkout-invoice-topbar {
		.checkout-invoice-topbar-inner {
			min-height: auto;
			flex-wrap: wrap;
		}

		.checkout-invoice-topbar-title {
			position: static;
			width: 100%;
			transform: none;
			order: -1;
		}

		.checkout-invoice-topbar-actions {
			justify-content: flex-start;
			flex-wrap: wrap;
		}
	}
}
</style>