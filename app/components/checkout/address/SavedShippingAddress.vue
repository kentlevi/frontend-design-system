<script setup lang="ts">
import { useAddressGeneralUICheckoutContext } from '~/composables/checkout/address/context/addressGeneralUICheckoutContext';
import { useSavedShippingAddress } from '~/composables/checkout/address/useSavedShippingAddress';
import { useAddressHelper } from '~/utils/address';

const {
	shipping_form,

	openSelectAddressModal,
} = useSavedShippingAddress()

const {
	shippingPhoneNumber,
	getAddressLine1,
	getAddressLine2
} = useAddressHelper()

const { t } = useI18n();

const {
	getAddressTagClass
} = useAddressGeneralUICheckoutContext()

</script>

<template>
	<div key="saved-address" data-shipping-panel="saved-address" class="checkout-member-address-grid">
		<button
			v-if="shipping_form"
			type="button"
			class="checkout-member-address-card is-active"
			@click="openSelectAddressModal('shipping')"
		>
			<div class="checkout-member-address-top">
				<div class="checkout-member-address-title-group">
					<strong class="checkout-member-address-name">
						{{ shipping_form.contact_name }}
					</strong>

					<UiBadge
						v-if="shipping_form.is_default"
						variant="outline"
						tone="default"
						size="md"
						class="checkout-member-address-badge"
						text-color="var(--gray-80)"
					>
						<UiIcon name="strong-ship" :size="18" />
						<span class="checkout-member-address-badge-copy">{{ t('checkout.member.addressSelection.defaultShipping') }}</span>
					</UiBadge>
				</div>
			</div>

			<div class="checkout-member-address-content">
				<div
					v-if="shippingPhoneNumber(shipping_form)"
					class="checkout-member-address-row"
				>
					<UiIcon name="regular-phone" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
					<p class="checkout-member-address-line checkout-member-address-line--strong">
						{{ shippingPhoneNumber(shipping_form) }}
					</p>
				</div>

				<div class="checkout-member-address-row checkout-member-address-row--split">
					<div class="checkout-member-address-row-main">
						<UiIcon name="regular-map-marker" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
						<div class="checkout-member-address-lines">
							<p class="checkout-member-address-line">
								{{ getAddressLine1(shipping_form) }}
								<span v-if="getAddressLine2(shipping_form)">
									, {{ getAddressLine2(shipping_form) }}
								</span>
							</p>
						</div>
					</div>

					<span
						v-if="shipping_form.label"
						class="checkout-member-address-tag"
						:class="getAddressTagClass(shipping_form.label)"
					>
						{{ shipping_form.label }}
					</span>
				</div>

				<div
					v-if="shipping_form.company"
					class="checkout-member-address-row"
				>
					<UiIcon name="regular-building" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
					<p class="checkout-member-address-line">
						{{ shipping_form.company }}
					</p>
				</div>
			</div>
		</button>
	</div>
</template>

<style scoped lang="scss">
.checkout-member-address-grid {
	display: grid;
	grid-template-columns: 1fr;
	gap: 14px;
	transform-origin: top;
	transition: opacity 0.24s ease, clip-path 1s cubic-bezier(0.22, 1, 0.36, 1);
	will-change: clip-path, opacity;

	.checkout-member-address-card {
		border: 1px solid var(--gray-40);
		border-radius: 12px;
		background: var(--contrast-light);
		text-align: left;
		cursor: pointer;
		padding: 0;
		overflow: hidden;

		&.is-active {
			border-color: var(--gray-60);
			background: var(--gray-20);
		}

		.checkout-member-address-top {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
			padding: 14px 16px;
			border-bottom: 1px solid var(--gray-40);

			.checkout-member-address-title-group {
				display: inline-flex;
				align-items: center;
				flex-wrap: wrap;
				gap: 8px;

				.checkout-member-address-name {
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					font-weight: var(--font-weight-bold);
					color: var(--text-primary);
				}

				.checkout-member-address-badge {
					display: inline-flex;
					align-items: center;
					gap: 6px;
					flex-shrink: 0;
				}

				.checkout-member-address-badge-copy {
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					font-weight: var(--font-weight-semibold);
				}
			}
		}

		.checkout-member-address-content {
			display: grid;
			gap: 10px;
			padding: 14px 16px;

			.checkout-member-address-row {
				display: flex;
				align-items: flex-start;
				gap: 8px;

				&.checkout-member-address-row--split {
					justify-content: space-between;
					gap: 16px;
				}

				.checkout-member-address-row-main {
					display: flex;
					align-items: flex-start;
					gap: 8px;
					min-width: 0;
				}

				.checkout-member-address-icon {
					flex-shrink: 0;
					margin-top: 1px;
				}

				.checkout-member-address-lines {
					min-width: 0;
				}

				.checkout-member-address-line {
					color: var(--text-secondary);
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);

					&.checkout-member-address-line--strong {
						color: var(--text-primary);
						font-weight: var(--font-weight-semibold);
					}
				}

				.checkout-member-address-tag {
					flex-shrink: 0;
					align-self: center;
					padding: 3px 10px;
					border-radius: 999px;
					background: var(--aloha-10);
					color: var(--aloha-60);
					font-size: var(--type-size-50);
					line-height: var(--type-line-50);
					font-weight: var(--font-weight-semibold);

					&.checkout-member-address-tag--office {
						background: var(--neon-blue-10);
						color: var(--neon-blue-60);
					}

					&.checkout-member-address-tag--client {
						background: var(--azure-10);
						color: var(--azure-60);
					}
				}
			}
		}
	}
}
</style>