<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { MemberAddress } from '~/types/checkout';

const props = defineProps<{
	modelValue: boolean;
	addresses: MemberAddress[];
	selectedAddressId: string;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: boolean): void;
	(e: 'select', value: string): void;
}>();

const pending_selected_address_id = ref(props.selectedAddressId);

const active_address_id = computed(() =>
	pending_selected_address_id.value || props.addresses[0]?.id || ''
);

watch(
	() => props.modelValue,
	(is_open) => {
		if (!is_open) return;
		pending_selected_address_id.value = props.selectedAddressId || props.addresses[0]?.id || '';
	}
);

watch(
	() => props.selectedAddressId,
	(next_id) => {
		if (props.modelValue) {
			pending_selected_address_id.value = next_id || props.addresses[0]?.id || '';
		}
	}
);

function closeModal() {
	emit('update:modelValue', false);
}

function confirmSelection() {
	if (active_address_id.value) {
		emit('select', active_address_id.value);
	}
	closeModal();
}

function getAddressTagClass(label?: string) {
	if (!label) return '';
	return `checkout-member-shipping-address-modal-tag--${label.toLowerCase()}`;
}
</script>

<template>
	<UiModal
		:model-value="props.modelValue"
		align="top"
		width="720px"
		padding="0"
		gap="0"
		modal-class="checkout-member-shipping-address-modal-shell"
		@update:model-value="emit('update:modelValue', $event)"
	>
		<section class="checkout-member-shipping-address-modal">
			<header class="checkout-member-shipping-address-modal-header">
				<h3 class="checkout-member-shipping-address-modal-title">Select Shipping Address</h3>
				<button
					type="button"
					class="checkout-member-shipping-address-modal-close"
					aria-label="Close shipping address modal"
					@click="closeModal"
				>
					<UiIcon name="regular-times" size="24" color="var(--text-primary)" decorative />
				</button>
			</header>

			<div class="checkout-member-shipping-address-modal-body">
				<p class="checkout-member-shipping-address-modal-copy">
					Please select the address where you'd like us to deliver your order.
				</p>

				<div class="checkout-member-shipping-address-modal-list">
					<button
						v-for="address in props.addresses"
						:key="address.id"
						type="button"
						class="checkout-member-shipping-address-modal-card"
						:class="{ 'is-active': active_address_id === address.id }"
						@click="pending_selected_address_id = address.id"
					>
						<div class="checkout-member-shipping-address-modal-card-top">
							<div class="checkout-member-shipping-address-modal-title-group">
								<span
									class="checkout-member-shipping-address-modal-radio"
									:class="{ 'is-active': active_address_id === address.id }"
									aria-hidden="true"
								>
									<span class="checkout-member-shipping-address-modal-radio-dot" />
								</span>
								<strong class="checkout-member-shipping-address-modal-name">{{ address.recipient }}</strong>
								<span v-if="address.isDefault" class="checkout-member-shipping-address-modal-badge">Default Shipping</span>
							</div>
						</div>

						<div class="checkout-member-shipping-address-modal-card-body">
							<div v-if="address.phone" class="checkout-member-shipping-address-modal-row">
								<UiIcon name="regular-phone" size="18" color="var(--text-secondary)" decorative />
								<p class="checkout-member-shipping-address-modal-line checkout-member-shipping-address-modal-line--strong">
									{{ address.phone }}
								</p>
							</div>

							<div class="checkout-member-shipping-address-modal-row checkout-member-shipping-address-modal-row--split">
								<div class="checkout-member-shipping-address-modal-row-main">
									<UiIcon name="regular-map-marker" size="18" color="var(--text-secondary)" decorative />
									<div class="checkout-member-shipping-address-modal-lines">
										<p class="checkout-member-shipping-address-modal-line">{{ address.line1 }}</p>
										<p class="checkout-member-shipping-address-modal-line">{{ address.line2 }}</p>
									</div>
								</div>
								<span
									v-if="address.label"
									class="checkout-member-shipping-address-modal-tag"
									:class="getAddressTagClass(address.label)"
								>
									{{ address.label }}
								</span>
							</div>

							<div v-if="address.company" class="checkout-member-shipping-address-modal-row">
								<UiIcon name="regular-building" size="18" color="var(--text-secondary)" decorative />
								<p class="checkout-member-shipping-address-modal-line">{{ address.company }}</p>
							</div>
						</div>
					</button>
				</div>
			</div>

			<footer class="checkout-member-shipping-address-modal-footer">
				<UiButton type="button" variant="ghost" tone="neutral" size="sm" :no-hover="true" @click="closeModal">
					Cancel
				</UiButton>
				<UiButton type="button" variant="filled" tone="neutral" size="md" @click="confirmSelection">
					Select Address
				</UiButton>
			</footer>
		</section>
	</UiModal>
</template>

<style lang="scss">
.ui-modal.checkout-member-shipping-address-modal-shell {
	width: min(720px, calc(100vw - 32px));
	padding: 0;
	gap: 0;
}

.checkout-member-shipping-address-modal {
	display: grid;
	grid-template-rows: auto minmax(0, 1fr) auto;
	max-height: min(760px, calc(100vh - 40px));
	overflow: hidden;
}

.checkout-member-shipping-address-modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 20px 24px;
	border-bottom: 1px solid var(--gray-40);
}

.checkout-member-shipping-address-modal-close {
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

.checkout-member-shipping-address-modal-title {
	font-size: var(--type-size-200);
	line-height: var(--type-line-200);
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.checkout-member-shipping-address-modal-body {
	display: grid;
	gap: 18px;
	padding: 24px;
	overflow-y: auto;
}

.checkout-member-shipping-address-modal-copy {
	font-size: var(--type-size-100);
	line-height: 1.45;
	color: var(--text-secondary);
}

.checkout-member-shipping-address-modal-list {
	display: grid;
	gap: 16px;
}

.checkout-member-shipping-address-modal-card {
	border: 1px solid var(--gray-40);
	border-radius: 12px;
	background: var(--contrast-light);
	padding: 0;
	text-align: left;
	overflow: hidden;
	cursor: pointer;
	transition:
		border-color 0.18s ease,
		background-color 0.18s ease,
		box-shadow 0.18s ease;

	&.is-active {
		border-color: var(--gray-60);
		background: var(--gray-20);
	}
}

.checkout-member-shipping-address-modal-card-top {
	padding: 14px 18px;
	border-bottom: 1px solid var(--gray-40);
}

.checkout-member-shipping-address-modal-title-group {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 10px;
}

.checkout-member-shipping-address-modal-radio {
	width: 22px;
	height: 22px;
	border: 1.5px solid var(--gray-50);
	border-radius: 999px;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	background: var(--contrast-light);
	transition:
		border-color 0.18s ease,
		background-color 0.18s ease;

	&.is-active {
		border-color: var(--gray-100);
		background: var(--gray-100);
	}
}

.checkout-member-shipping-address-modal-radio-dot {
	width: 8px;
	height: 8px;
	border-radius: 999px;
	background: var(--contrast-light);
	opacity: 0;
	transition: opacity 0.18s ease;

	.checkout-member-shipping-address-modal-radio.is-active & {
		opacity: 1;
	}
}

.checkout-member-shipping-address-modal-name {
	font-size: var(--type-size-150);
	line-height: var(--type-line-150);
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.checkout-member-shipping-address-modal-badge {
	padding: 4px 12px;
	border-radius: 999px;
	border: 1px solid var(--gray-40);
	background: var(--contrast-light);
	font-size: var(--type-size-50);
	line-height: var(--type-line-50);
	font-weight: var(--font-weight-semibold);
	color: var(--text-secondary);
}

.checkout-member-shipping-address-modal-card-body {
	display: grid;
	gap: 10px;
	padding: 16px 18px;
}

.checkout-member-shipping-address-modal-row {
	display: flex;
	align-items: flex-start;
	gap: 10px;
}

.checkout-member-shipping-address-modal-row--split {
	justify-content: space-between;
	gap: 16px;
}

.checkout-member-shipping-address-modal-row-main {
	display: flex;
	align-items: flex-start;
	gap: 10px;
	min-width: 0;
}

.checkout-member-shipping-address-modal-lines {
	min-width: 0;
}

.checkout-member-shipping-address-modal-line {
	font-size: var(--type-size-100);
	line-height: 1.45;
	color: var(--text-secondary);
}

.checkout-member-shipping-address-modal-line--strong {
	color: var(--text-primary);
	font-weight: var(--font-weight-semibold);
}

.checkout-member-shipping-address-modal-tag {
	flex-shrink: 0;
	align-self: center;
	padding: 4px 12px;
	border-radius: 999px;
	font-size: var(--type-size-50);
	line-height: var(--type-line-50);
	font-weight: var(--font-weight-semibold);
}

.checkout-member-shipping-address-modal-tag--home {
	background: var(--aloha-10);
	color: var(--aloha-60);
}

.checkout-member-shipping-address-modal-tag--office {
	background: #eeecff;
	color: #6b63ff;
}

.checkout-member-shipping-address-modal-tag--client {
	background: #e7f2ff;
	color: #2a78ff;
}

.checkout-member-shipping-address-modal-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 16px 24px 24px;
	border-top: 1px solid var(--gray-40);
}

@media (max-width: 760px) {
	.checkout-member-shipping-address-modal-body {
		padding: 18px 16px;
	}

	.checkout-member-shipping-address-modal-row--split,
	.checkout-member-shipping-address-modal-footer {
		align-items: flex-start;
		flex-direction: column;
	}
}
</style>