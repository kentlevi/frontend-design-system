<script setup lang="ts">
import { useCheckoutAddressSelectModal } from '~/composables/checkout/address/useCheckoutAddressSelectModal';
import type { AddressItem, AddressType } from '~/types/user-address';

const props = withDefaults(defineProps<{
	title: string;
	copy?: string;
	variant: AddressType;
	confirmLabel?: string;
}>(), {
	copy: '',
	confirmLabel: '',
});

const {
	translate,

	is_select_address_modal_open,
	pending_selected_address_id,
	addresses,

	closeModal,
	confirmSelection,
	getAddressTagClass,
	shippingPhoneNumber,
	buildAddressLines,
} = useCheckoutAddressSelectModal()


function getDefaultBadgeLabel(address: AddressItem) {
	if (props.variant === 'shipping') return translate('checkout.member.addressSelection.defaultShipping');
	if (props.variant === 'billing') return ('badgeLabel' in address && address.badgeLabel) || translate('checkout.member.addressSelection.defaultBilling');
	return translate('checkout.member.addressSelection.defaultDropShipping');
}

function getDefaultBadgeIcon() {
	if (props.variant === 'shipping') return 'strong-ship'
	if (props.variant === 'billing') return 'strong-file-dollar'
	return 'strong-box-full'
}
</script>

<template>
	<UiModal
		v-model="is_select_address_modal_open"
		align="top"
		width="720px"
		padding="0"
		gap="0"
		modal-class="checkout-address-select-modal-shell"
	>
		<section class="checkout-address-select-modal">
			<header class="checkout-address-select-modal-header">
				<h3 class="checkout-address-select-modal-title">{{ props.title }}</h3>
				<button
					type="button"
					class="checkout-address-select-modal-close"
					:aria-label="translate('checkout.member.addressSelection.closeModal')"
					@click="closeModal"
				>
					<UiIcon name="regular-times" size="24" color="var(--text-primary)" decorative />
				</button>
			</header>

			<div class="checkout-address-select-modal-body">
				<p v-if="props.copy" class="checkout-address-select-modal-copy">
					{{ props.copy }}
				</p>

				<div class="checkout-address-select-modal-list">
					<button
						v-for="address in addresses"
						:key="address.id"
						type="button"
						class="checkout-address-select-modal-card"
						:class="{ 'is-active': pending_selected_address_id === address.id }"
						@click="pending_selected_address_id = address.id"
					>
						<div class="checkout-address-select-modal-card-top">
							<div class="checkout-address-select-modal-title-group">
								<span
									class="checkout-address-select-modal-radio"
									:class="{ 'is-active': pending_selected_address_id === address.id }"
									aria-hidden="true"
								>
									<span class="checkout-address-select-modal-radio-dot" />
								</span>
								<strong class="checkout-address-select-modal-name">{{ address.contact_name }}</strong>
								<UiBadge
									v-if="address.is_default"
									variant="outline"
									tone="default"
									size="md"
									class="checkout-address-select-modal-badge"
									text-color="var(--gray-80)"
								>
									<UiIcon :name="getDefaultBadgeIcon()" :size="18" />
									<span class="checkout-address-select-modal-badge-copy">
										{{ getDefaultBadgeLabel(address) }}
									</span>
								</UiBadge>
							</div>
						</div>

						<div class="checkout-address-select-modal-card-body" :data-variant="props.variant">
							<template v-if="props.variant === 'shipping'">
								<div v-if="shippingPhoneNumber(address)" class="checkout-address-select-modal-row">
									<UiIcon name="regular-phone" size="18" color="var(--text-secondary)" decorative />
									<p class="checkout-address-select-modal-line checkout-address-select-modal-line--strong">
										{{ shippingPhoneNumber(address) }}
									</p>
								</div>

								<div class="checkout-address-select-modal-row checkout-address-select-modal-row--split">
									<div class="checkout-address-select-modal-row-main">
										<UiIcon name="regular-map-marker" size="18" color="var(--text-secondary)" decorative />
										<div class="checkout-address-select-modal-lines">
											<p class="checkout-address-select-modal-line">{{ buildAddressLines(address) }}</p>
										</div>
									</div>
									<span
										v-if="address.label"
										class="checkout-address-select-modal-tag"
										:class="getAddressTagClass(address.label)"
									>
										{{ address.label }}
									</span>
								</div>

								<div v-if="'company' in address && address.company" class="checkout-address-select-modal-row">
									<UiIcon name="regular-building" size="18" color="var(--text-secondary)" decorative />
									<p class="checkout-address-select-modal-line">{{ address.company }}</p>
								</div>
							</template>

							<template v-else-if="props.variant === 'billing'">
								<div class="checkout-address-select-modal-row checkout-address-select-modal-row--split">
									<div class="checkout-address-select-modal-lines checkout-address-select-modal-lines--stacked">
										<p class="checkout-address-select-modal-line">{{ 'line1' in address ? address.line1 : '' }}</p>
										<p v-if="'line2' in address && address.line2" class="checkout-address-select-modal-line">{{ address.line2 }}</p>
										<p v-if="'company' in address && address.company" class="checkout-address-select-modal-line">{{ address.company }}</p>
									</div>
									<span
										v-if="address.label"
										class="checkout-address-select-modal-tag"
										:class="getAddressTagClass(address.label)"
									>
										{{ address.label }}
									</span>
								</div>
							</template>

							<template v-else>
								<div class="checkout-address-select-modal-row checkout-address-select-modal-row--split checkout-address-select-modal-row--centered">
									<p class="checkout-address-select-modal-line">
										{{ address.company || translate('checkout.member.addressSelection.noCompanyProvided') }}
									</p>
									<span
										v-if="address.label"
										class="checkout-address-select-modal-tag"
										:class="getAddressTagClass(address.label)"
									>
										{{ address.label }}
									</span>
								</div>
							</template>
						</div>
					</button>
				</div>
			</div>

			<footer class="checkout-address-select-modal-footer">
				<UiButton type="button" variant="ghost" tone="neutral" size="sm" :no-hover="true" @click="closeModal">
					{{ translate('checkout.member.addressSelection.cancel') }}
				</UiButton>
				<UiButton type="button" variant="filled" tone="neutral" size="md" @click="confirmSelection">
					{{ props.confirmLabel || translate('checkout.member.addressSelection.selectAddress') }}
				</UiButton>
			</footer>
		</section>
	</UiModal>
</template>

<style lang="scss">
.ui-modal.checkout-address-select-modal-shell {
	width: min(720px, calc(100vw - 32px));
	padding: 0;
	gap: 0;
}

.checkout-address-select-modal {
	display: grid;
	grid-template-rows: auto minmax(0, 1fr) auto;
	max-height: min(760px, calc(100vh - 40px));
	overflow: hidden;
}

.checkout-address-select-modal-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 20px 24px;
	border-bottom: 1px solid var(--gray-40);
}

.checkout-address-select-modal-title {
	font-size: var(--type-size-200);
	line-height: var(--type-line-200);
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.checkout-address-select-modal-close {
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

.checkout-address-select-modal-body {
	display: grid;
	gap: 18px;
	padding: 24px;
	overflow-y: auto;
}

.checkout-address-select-modal-copy {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	color: var(--text-secondary);
}

.checkout-address-select-modal-list {
	display: grid;
	gap: 16px;
}

.checkout-address-select-modal-card {
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

.checkout-address-select-modal-card-top {
	padding: 14px 18px;
	border-bottom: 1px solid var(--gray-40);
}

.checkout-address-select-modal-title-group {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 10px;
}

.checkout-address-select-modal-radio {
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

.checkout-address-select-modal-radio-dot {
	width: 8px;
	height: 8px;
	border-radius: 999px;
	background: var(--contrast-light);
	opacity: 0;
	transition: opacity 0.18s ease;

	.checkout-address-select-modal-radio.is-active & {
		opacity: 1;
	}
}

.checkout-address-select-modal-name {
	font-size: var(--type-size-150);
	line-height: var(--type-line-150);
	font-weight: var(--font-weight-bold);
	color: var(--text-primary);
}

.checkout-address-select-modal-badge {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	flex-shrink: 0;
}

.checkout-address-select-modal-badge-copy {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	font-weight: var(--font-weight-semibold);
}

.checkout-address-select-modal-card-body {
	display: grid;
	gap: 10px;
	padding: 16px 18px;
}

.checkout-address-select-modal-row {
	display: flex;
	align-items: flex-start;
	gap: 10px;
}

.checkout-address-select-modal-row--split {
	justify-content: space-between;
	gap: 16px;
}

.checkout-address-select-modal-row--centered {
	align-items: center;
}

.checkout-address-select-modal-row-main {
	display: flex;
	align-items: flex-start;
	gap: 10px;
	min-width: 0;
}

.checkout-address-select-modal-lines {
	min-width: 0;
}

.checkout-address-select-modal-lines--stacked {
	display: grid;
	gap: 6px;
}

.checkout-address-select-modal-line {
	font-size: var(--type-size-100);
	line-height: var(--type-line-100);
	color: var(--text-secondary);
}

.checkout-address-select-modal-line--strong {
	color: var(--text-primary);
	font-weight: var(--font-weight-semibold);
}

.checkout-address-select-modal-tag {
	flex-shrink: 0;
	align-self: center;
	padding: 4px 12px;
	border-radius: 999px;
	font-size: var(--type-size-50);
	line-height: var(--type-line-50);
	font-weight: var(--font-weight-semibold);
}

.checkout-address-select-modal-tag--home {
	background: var(--aloha-10);
	color: var(--aloha-60);
}

.checkout-address-select-modal-tag--office {
	background: var(--neon-blue-10);
	color: var(--neon-blue-60);
}

.checkout-address-select-modal-tag--client {
	background: var(--azure-10);
	color: var(--azure-60);
}

.checkout-address-select-modal-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 16px 24px 24px;
	border-top: 1px solid var(--gray-40);
}

@media (max-width: 760px) {
	.checkout-address-select-modal-body {
		padding: 18px 16px;
	}

	.checkout-address-select-modal-row--split,
	.checkout-address-select-modal-footer {
		align-items: flex-start;
		flex-direction: column;
	}
}
</style>