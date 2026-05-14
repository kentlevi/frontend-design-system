<script setup lang="ts">
const { t: translate } = useI18n();

const props = defineProps<{
	modelValue: boolean;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
}>();

const accredited_banks = [
	{ key: 'kb-kookmin-bank', label: '국민은행: KB Kookmin Bank', icon: '/icons/custom/payment-methods/bank-logos/kb-kookmin-bank.svg' },
	{ key: 'shinhan-card', label: '신한카드: Shinhan Card', icon: '/icons/custom/payment-methods/bank-logos/shinhan-card.svg' },
	{ key: 'hyundai-card', label: '현대카드: Hyundai Card', icon: '/icons/custom/payment-methods/bank-logos/hyundai-card.svg' },
	{ key: 'samsung-card', label: '삼성카드: Samsung Card', icon: '/icons/custom/payment-methods/bank-logos/samsung-card.svg' },
	{ key: 'nh-nonghyup-card', label: '농협카드: NH Nonghyup Card', icon: '/icons/custom/payment-methods/bank-logos/nh-nonghyup-card.svg' },
	{ key: 'kakao-bank', label: '카카오뱅크: Kakao Bank', icon: '/icons/custom/payment-methods/bank-logos/kakao-bank.svg' },
	{ key: 'bc-card', label: 'BC카드: BC Card', icon: '/icons/custom/payment-methods/bank-logos/bc-card.svg' },
	{ key: 'hana-card', label: '하나카드: Hana Card', icon: '/icons/custom/payment-methods/bank-logos/hana-card.svg' },
	{ key: 'woori-card', label: '우리카드: Woori Card', icon: '/icons/custom/payment-methods/bank-logos/woori-card.svg' },
	{ key: 'lotte-card', label: '롯데카드: Lotte Card', icon: '/icons/custom/payment-methods/bank-logos/lotte-card.svg' },
	{ key: 'citibank', label: '씨티카드: Citibank', icon: '/icons/custom/payment-methods/bank-logos/citibank.svg' },
	{ key: 'mg-saemaul-geumgo', label: '새마을금고: MG Saemaul Geumgo', icon: '/icons/custom/payment-methods/bank-logos/mg-saemaul-geumgo.svg' },
	{ key: 'kbank', label: '케이뱅크: kbank', icon: '/icons/custom/payment-methods/bank-logos/kbank.svg' },
	{ key: 'kwangju-bank', label: '광주은행: Kwangju Bank', icon: '/icons/custom/payment-methods/bank-logos/kwangju-bank.svg' },
	{ key: 'korea-post', label: '우체국: Korea Post', icon: '/icons/custom/payment-methods/bank-logos/korea-post.svg' },
	{ key: 'jeonbuk-bank', label: '전북은행: Jeonbuk Bank', icon: '/icons/custom/payment-methods/bank-logos/jeonbuk-bank.svg' },
	{ key: 'shuhyup-bank', label: '수협은행: Shuhyup Bank', icon: '/icons/custom/payment-methods/bank-logos/shuhyup-bank.svg' },
	{ key: 'shinhyup-credit-union', label: '신협은행: Shinhyup (Credit Union)', icon: '/icons/custom/payment-methods/bank-logos/shinhyup-credit-union.svg' },
] as const;

function closeModal() {
	emit('update:modelValue', false);
}
</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		align="top"
		width="640px"
		padding="0"
		gap="0"
		modal-class="checkout-member-accredited-banks-modal-shell"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<section class="checkout-member-accredited-banks-modal">
			<header class="checkout-member-accredited-banks-modal-header">
				<h3 class="checkout-member-accredited-banks-modal-title">{{ translate('checkout.member.paymentMeta.accreditedBanksModalTitle') }}</h3>
				<button
					type="button"
					class="checkout-member-accredited-banks-modal-close"
					:aria-label="translate('checkout.member.paymentMeta.accreditedBanksModalCloseAria')"
					@click="closeModal"
				>
					<UiIcon name="regular-times" size="24" color="var(--text-primary)" decorative />
				</button>
			</header>

			<div class="checkout-member-accredited-banks-modal-body">
				<div class="checkout-member-accredited-banks-modal-list">
					<div
						v-for="bank in accredited_banks"
						:key="bank.key"
						class="checkout-member-accredited-banks-modal-item"
					>
						<img :src="bank.icon" :alt="bank.label" class="checkout-member-accredited-banks-modal-icon">
						<span class="checkout-member-accredited-banks-modal-label">{{ bank.label }}</span>
					</div>
				</div>
			</div>

			<footer class="checkout-member-accredited-banks-modal-footer">
				<UiButton type="button" variant="ghost" tone="neutral" size="sm" :no-hover="true" @click="closeModal">
					{{ translate('checkout.member.paymentMeta.accreditedBanksModalClose') }}
				</UiButton>
			</footer>
		</section>
	</UiModal>
</template>

<style lang="scss">
.ui-modal.checkout-member-accredited-banks-modal-shell {
	width: min(640px, calc(100vw - 32px));
	padding: 0;
	gap: 0;
}

.checkout-member-accredited-banks-modal {
	display: grid;
	grid-template-rows: auto minmax(0, 1fr) auto;
	max-height: min(760px, calc(100vh - 40px));
	overflow: hidden;
}

.checkout-member-accredited-banks-modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 20px 24px;
	border-bottom: 1px solid var(--gray-40);
}

.checkout-member-accredited-banks-modal-title {
	font-size: var(--type-size-200);
	line-height: var(--type-line-200);
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.checkout-member-accredited-banks-modal-close {
	border: 0;
	background: transparent;
	padding: 0;
	width: 24px;
	height: 24px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.checkout-member-accredited-banks-modal-body {
	padding: 24px;
	overflow-y: auto;
}

.checkout-member-accredited-banks-modal-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 8px 16px;
}

.checkout-member-accredited-banks-modal-icon {
	width: 24px;
	height: 24px;
	object-fit: contain;
	flex-shrink: 0;
}

.checkout-member-accredited-banks-modal-label {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	color: var(--text-primary);
}

.checkout-member-accredited-banks-modal-footer {
	display: flex;
	justify-content: flex-end;
	padding: 16px 24px 24px;
	border-top: 1px solid var(--gray-40);
}
</style>