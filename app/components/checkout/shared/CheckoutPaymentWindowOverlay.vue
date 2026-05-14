<script setup lang="ts">
import { useI18n } from 'vue-i18n';

defineProps<{
	visible: boolean;
}>();

const { t: translate } = useI18n();
</script>

<template>
	<Teleport to="body">
		<Transition name="checkout-payment-window-overlay">
			<div
				v-if="visible"
				class="checkout-payment-window-overlay"
				role="status"
				aria-live="polite"
			>
				<div class="checkout-payment-window-card">
					<img
						src="/icons/custom/checkout/toss-payment.png"
						alt="Toss Pay"
						class="checkout-payment-window-logo"
					>
					<p class="checkout-payment-window-message">
						{{ translate('checkout.paymentWindow.continueTransaction') }}
					</p>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped lang="scss">
.checkout-payment-window-overlay {
	position: fixed;
	inset: 0;
	z-index: 200;
	display: grid;
	place-items: center;
	background: rgba(0, 0, 0, 0.56);
}

.checkout-payment-window-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24px;
	background: #ffffff;
	border-radius: 20px;
	padding: 40px 48px;
	width: min(360px, calc(100vw - 48px));
	box-shadow:
		0 32px 80px rgba(0, 0, 0, 0.28),
		0 8px 24px rgba(0, 0, 0, 0.10);
}

.checkout-payment-window-logo {
	height: 28px;
	width: auto;
	object-fit: contain;
}

.checkout-payment-window-message {
	color: #4e5968;
	font-size: 14px;
	line-height: 22px;
	text-align: center;
	max-width: 220px;
	margin: 0;
}

.checkout-payment-window-overlay-enter-active,
.checkout-payment-window-overlay-leave-active {
	transition: opacity 0.2s ease;
}

.checkout-payment-window-overlay-enter-from,
.checkout-payment-window-overlay-leave-to {
	opacity: 0;
}
</style>