<script setup lang="ts">
import { useCheckoutMemberPage } from '~/composables/checkout/member/useCheckoutMemberPage';

const {
	withCountry,
	t,
	selectedCheckoutItems,
	orderTotal,
	orderDiscount,
	orderShippingFee,
	orderSubtotal,
	formatPrice,
	sizeDimOnly,
	savedShippingAddresses,
	selectedShippingAddressId,
	shipToAnotherAddress,
	selectedShippingMethod,
	selectedPaymentMethod,
	activeShippingMethods,
	activePaymentMethods,
	paymentBrands,
	dropShippingEnabled,
	useShippingAsBilling,
	pointsAvailable,
	pointsToUse,
	couponCode,
	cardNumber,
	expiry,
	cvv,
	useAllPoints,
	completingCheckout,
	completeLoaderRef,
	completeCheckout,
	shippingMethodDetails,
	itemMeta,
} = useCheckoutMemberPage();
</script>

<template>
	<CheckoutPageBase
		page-class="checkout-member-page"
		shell-class="checkout-member-shell"
		main-class="checkout-member-main"
		summary-class="checkout-member-summary"
		test-id="checkout-member-page"
		loading-test-id="checkout-member-complete-loading-overlay"
		:loading="completingCheckout"
		:loading-label="t('checkout.member.completeCheckout')"
	>
		<template #loader>
			<div ref="completeLoaderRef" />
		</template>

		<template #main>
			<section class="checkout-member-section">
				<div class="checkout-member-section-head">
					<h1 class="checkout-member-section-title">{{ t('checkout.member.shippingDetails') }}</h1>
					<UiButton variant="ghost" tone="neutral" size="sm" class="checkout-member-link">
						{{ t('checkout.member.viewShippingAddresses') }}
					</UiButton>
				</div>

				<div class="checkout-member-shipping-group">
					<div class="checkout-member-address-group">
						<UiRadio v-model="shipToAnotherAddress" :value="false" name="shipping-mode" class="checkout-member-radio-line">
							{{ t('checkout.member.myShippingAddress') }}
						</UiRadio>

						<div class="checkout-member-address-grid">
							<button
								v-for="address in savedShippingAddresses"
								:key="address.id"
								type="button"
								class="checkout-member-address-card"
								:class="{ 'is-active': selectedShippingAddressId === address.id }"
								@click="selectedShippingAddressId = address.id"
							>
								<div class="checkout-member-address-top">
									<strong class="checkout-member-address-name">{{ address.recipient }}</strong>
									<span v-if="address.isDefault" class="checkout-member-address-badge">{{ t('checkout.member.defaultBadge') }}</span>
								</div>
								<div class="checkout-member-address-content">
									<UiIcon name="regular-map-marker" size="24" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
									<div class="checkout-member-address-lines">
										<p class="checkout-member-address-line">{{ address.line1 }}</p>
										<p class="checkout-member-address-line">{{ address.line2 }}</p>
									</div>
								</div>
							</button>
						</div>
					</div>

					<UiRadio v-model="shipToAnotherAddress" :value="true" name="shipping-mode" class="checkout-member-radio-line">
						{{ t('checkout.member.shipToAnotherAddress') }}
					</UiRadio>

					<div class="checkout-member-block">
						<div class="checkout-member-block-head">
							<div class="checkout-member-block-title">{{ t('checkout.member.shippingMethod') }}</div>
							<div class="checkout-member-block-note">{{ t('checkout.member.shippingNote') }}</div>
						</div>
						<div class="checkout-member-card-grid">
							<button
								v-for="method in activeShippingMethods"
								:key="method.key"
								type="button"
								class="checkout-member-choice-card"
								:class="{ 'is-active': selectedShippingMethod === method.key }"
								@click="selectedShippingMethod = method.key"
							>
								<img :src="method.icon" :alt="shippingMethodDetails[method.key]?.name" class="checkout-member-choice-icon">
								<div class="checkout-member-choice-copy">
									<div class="checkout-member-choice-title">{{ shippingMethodDetails[method.key]?.name }}</div>
									<div class="checkout-member-choice-subtitle">{{ shippingMethodDetails[method.key]?.date }}</div>
								</div>
								<div class="checkout-member-choice-price">{{ shippingMethodDetails[method.key]?.price }}</div>
							</button>
						</div>
					</div>

					<div class="checkout-member-inline-row">
						<UiCheckbox v-model="dropShippingEnabled">{{ t('checkout.member.enableDropShipping') }}</UiCheckbox>
						<UiButton variant="ghost" tone="neutral" size="sm" class="checkout-member-link is-muted">
							{{ t('checkout.member.viewDropShippingAddresses') }}
						</UiButton>
					</div>
				</div>
			</section>

			<section class="checkout-member-section">
				<h2 class="checkout-member-section-title">{{ t('checkout.member.payment') }}</h2>

				<div class="checkout-member-payment-group">
					<div class="checkout-member-card-grid checkout-member-card-grid--payments">
						<button
							v-for="method in activePaymentMethods"
							:key="method.key"
							type="button"
							class="checkout-member-choice-card checkout-member-choice-card--payment"
							:class="{ 'is-active': selectedPaymentMethod === method.key }"
							@click="selectedPaymentMethod = method.key"
						>
							<img :src="method.icon" :alt="t(`checkout.guest.paymentMethods.${method.i18nKey}.alt`)" class="checkout-member-choice-icon">
							<div class="checkout-member-choice-title">{{ t(`checkout.guest.paymentMethods.${method.i18nKey}.label`) }}</div>
						</button>
					</div>

					<div class="checkout-member-payment-meta">
						<div class="checkout-member-subnote">{{ t('checkout.member.paymentSubnote') }}</div>
						<div class="checkout-member-payment-brands">
							<div v-for="brand in paymentBrands" :key="brand.key" class="checkout-member-payment-brand">
								<img :src="brand.icon" :alt="brand.label" class="checkout-member-payment-brand-icon">
							</div>
						</div>
					</div>
				</div>

				<div class="checkout-member-field-stack">
					<UiFormField
						:label="t('checkout.member.fields.cardNumber.label')"
						:required="true"
						:show-required-mark="true"
						head-class="checkout-form-field-head"
						label-class="checkout-form-field-label"
						label-text-class="checkout-form-field-label-text"
					>
						<UiInput v-model="cardNumber" size="lg" :placeholder="t('checkout.member.fields.cardNumber.placeholder')" />
					</UiFormField>
					<div class="checkout-member-field-grid">
						<UiFormField
							:label="t('checkout.member.fields.expiration.label')"
							:required="true"
							:show-required-mark="true"
							head-class="checkout-form-field-head"
							label-class="checkout-form-field-label"
							label-text-class="checkout-form-field-label-text"
						>
							<UiInput v-model="expiry" size="lg" :placeholder="t('checkout.member.fields.expiration.placeholder')" />
						</UiFormField>
						<UiFormField
							:label="t('checkout.member.fields.cvv.label')"
							:required="true"
							:show-required-mark="true"
							head-class="checkout-form-field-head"
							label-class="checkout-form-field-label"
							label-text-class="checkout-form-field-label-text"
						>
							<UiInput v-model="cvv" size="lg" :placeholder="t('checkout.member.fields.cvv.placeholder')" />
						</UiFormField>
					</div>
				</div>

				<div class="checkout-member-inline-row">
					<UiCheckbox v-model="useShippingAsBilling">{{ t('checkout.member.useShippingAsBilling') }}</UiCheckbox>
					<UiButton variant="ghost" tone="neutral" size="sm" class="checkout-member-link is-muted">
						{{ t('checkout.member.viewBillingAddresses') }}
					</UiButton>
				</div>
			</section>
		</template>

		<template #summary>
			<CheckoutSummaryCard
				tone="member"
				:title="t('checkout.member.orderSummary')"
				:items="selectedCheckoutItems"
				:subtotal-label="t('checkout.member.summary.subtotal')"
				:shipping-fee-label="t('checkout.member.summary.shippingFee', { method: shippingMethodDetails[selectedShippingMethod]?.name })"
				:discounts-label="t('checkout.member.summary.discounts')"
				:total-label="t('checkout.member.summary.total')"
				:subtotal-value="formatPrice(orderSubtotal)"
				:shipping-fee-value="formatPrice(orderShippingFee)"
				:discount-value="`-${formatPrice(orderDiscount)}`"
				:total-value="formatPrice(orderTotal)"
				:complete-label="t('checkout.member.completeCheckout')"
				:agreement-prefix="t('checkout.member.agreement.prefix')"
				:agreement-terms="t('checkout.member.agreement.terms')"
				:agreement-and="t('checkout.member.agreement.and')"
				:agreement-privacy="t('checkout.member.agreement.privacy')"
				:agreement-suffix="t('checkout.member.agreement.suffix')"
				:terms-path="withCountry('/terms-of-use')"
				:privacy-path="withCountry('/privacy-policy')"
				:disabled="selectedCheckoutItems.length === 0"
				:loading="completingCheckout"
				:size-dim-only="sizeDimOnly"
				:format-price="formatPrice"
				:item-meta="itemMeta"
				@submit="completeCheckout(selectedCheckoutItems.length > 0)"
			>
				<template #after-items>
					<div class="checkout-member-perks">
						<div class="checkout-member-perks-head">
							<span>{{ t('checkout.member.pointsAndCoupons') }}</span>
							<UiIcon name="light-angle-up" size="24" decorative />
						</div>
						<div class="checkout-member-perks-body">
							<div class="checkout-member-perk-field">
								<div class="checkout-member-perk-label-row">
									<div class="checkout-member-perk-label-group">
										<span class="checkout-member-perk-label-primary">{{ t('checkout.member.points') }}</span>
										<UiIcon name="regular-question-circle" size="20" color="var(--text-secondary)" decorative />
									</div>
									<span class="checkout-member-perk-label-secondary">{{ t('checkout.member.pointsAvailable', { value: pointsAvailable.toFixed(2) }) }}</span>
								</div>
								<div class="checkout-member-perk-control">
									<UiInput v-model="pointsToUse" size="md" :placeholder="t('checkout.member.pointsPlaceholder')" />
									<UiButton variant="outline" tone="neutral" size="md" class="checkout-member-inline-button" @click="useAllPoints">
										{{ t('checkout.member.useAll') }}
									</UiButton>
								</div>
							</div>

							<div class="checkout-member-perk-field">
								<div class="checkout-member-perk-label-row">
									<span class="checkout-member-perk-label-primary">{{ t('checkout.member.coupon') }}</span>
								</div>
								<div class="checkout-member-perk-control">
									<UiInput v-model="couponCode" size="md" :placeholder="t('checkout.member.couponPlaceholder')" />
									<UiButton variant="outline" tone="neutral" size="md" class="checkout-member-inline-button">
										{{ t('checkout.member.applyCoupon') }}
									</UiButton>
								</div>
							</div>
						</div>
					</div>
				</template>
			</CheckoutSummaryCard>
		</template>
	</CheckoutPageBase>
</template>

<style lang="scss">
.checkout-member-page {
	padding: 40px 24px 64px;

	.checkout-member-shell {
		max-width: 1200px;
		margin: 0 auto;
		display: grid;
		grid-template-columns: minmax(0, 1fr) 384px;
		gap: 126px;
		align-items: start;
	}

	.checkout-member-main {
		display: grid;
		gap: 28px;

		.checkout-member-section {
			display: grid;
			gap: 12px;

			.checkout-member-section-head,
			.checkout-member-block-head,
			.checkout-member-inline-row,
			.checkout-member-perk-label-row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 12px;
			}

			.checkout-member-section-title {

				font-size: var(--type-size-300);
				line-height: var(--type-line-200);
				font-weight: var(--font-weight-bold);
				color: var(--text-primary);
			}

			.checkout-member-link {
				padding: 0;
				min-height: auto;
				color: var(--gold-60);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-semibold);
				box-shadow: none;

				&.is-muted {
					opacity: 32%;
				}
			}

			.checkout-member-radio-line {
				align-self: start;
			}

			.checkout-member-shipping-group {
				display: grid;
				gap: 16px;

				.checkout-member-address-group {
					display: grid;
					gap: 8px;
				}

				.checkout-member-address-grid,
				.checkout-member-card-grid {
					display: grid;
					grid-template-columns: repeat(2, minmax(0, 1fr));
					gap: 12px;
				}

				.checkout-member-address-card,
				.checkout-member-choice-card {
					border: 1px solid var(--gray-40);
					border-radius: 12px;
					background: var(--contrast-light);
					padding: 18px 20px;
					text-align: left;
					cursor: pointer;
					display: grid;
					gap: 8px;

					&.is-active {
						border-color: var(--gray-60);
						background: var(--gray-20);
					}
				}

				.checkout-member-address-top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 12px;
				}

				.checkout-member-address-name {
					font-size: var(--type-size-200);
					line-height: var(--type-line-200);
					font-weight: var(--font-weight-bold);
					color: var(--text-primary);
				}

				.checkout-member-address-badge {
					padding: 0 12px;
					border-radius: 999px;
					background: var(--white-base);
					box-shadow: var(--shadow-base);
					font-size: var(--type-size-50);
					line-height: var(--type-line-50);
					font-weight: var(--font-weight-semibold);
				}

				.checkout-member-address-content {
					display: flex;
					align-items: flex-start;
					gap: 8px;
				}

				.checkout-member-address-icon {
					flex-shrink: 0;
				}

				.checkout-member-address-lines {
					color: var(--text-secondary);
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);

					.checkout-member-address-line {

					}
				}

				.checkout-member-block {
					display: grid;
					gap: 8px;

					.checkout-member-block-title {
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
						font-weight: var(--font-weight-bold);
						color: var(--text-primary);
					}

					.checkout-member-block-note {
						color: var(--text-secondary);
						font-size: var(--type-size-100);
						line-height: var(--type-line-100);
						text-align: right;
					}

					.checkout-member-choice-card {
						min-height: 102px;
						display: flex;
						align-items: center;
						gap: 18px;

						.checkout-member-choice-icon {
							width: 48px;
							height: 48px;
							object-fit: contain;
							flex-shrink: 0;
						}

						.checkout-member-choice-copy {
							flex: 1;
							display: grid;
							gap: 4px;
						}

						.checkout-member-choice-title {
							font-size: var(--type-size-200);
							line-height: var(--type-line-200);
							font-weight: var(--font-weight-semibold);
							color: var(--text-primary);
						}

						.checkout-member-choice-subtitle {
							color: var(--text-secondary);
							font-size: var(--type-size-100);
							line-height: var(--type-line-100);
						}
					}
				}
			}

			.checkout-member-card-grid {
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: 12px;
			}

			.checkout-member-choice-card {
				border: 1px solid var(--gray-40);
				border-radius: 12px;
				background: var(--contrast-light);
				padding: 16px 20px;
				text-align: left;
				cursor: pointer;
				min-height: 102px;
				display: flex;
				align-items: center;
				gap: 18px;

				&.is-active {
					border-color: var(--gray-60);
					background: var(--gray-20);
				}

				&.checkout-member-choice-card--payment {
					justify-content: center;
					padding: 24px 28px;
				}

				.checkout-member-choice-icon {
					width: 48px;
					height: 48px;
					object-fit: contain;
					flex-shrink: 0;
				}

				.checkout-member-choice-title {
					font-size: var(--type-size-200);
					line-height: var(--type-line-200);
					font-weight: var(--font-weight-semibold);
					color: var(--text-primary);
				}
			}

			.checkout-member-subnote {
				color: var(--text-secondary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
			}

			.checkout-member-payment-group {
				display: grid;
				gap: 8px;

				.checkout-member-payment-meta {
					display: flex;
					align-items: center;
					gap: 16px;

					.checkout-member-payment-brands {
						display: flex;
						align-items: center;
						gap: 12px;
						flex-wrap: nowrap;

						.checkout-member-payment-brand {
							flex: 0 0 58px;
							width: 58px;
							height: 36px;
							display: grid;
							place-items: center;
							border: 1px solid var(--gray-40);
							border-radius: 10px;
							background: var(--contrast-light);
							padding: 4px 8px;

							.checkout-member-payment-brand-icon {
								max-width: 100%;
								width: 36px;
								height: 20px;
								object-fit: contain;
							}
						}
					}
				}
			}

			.checkout-member-field-stack,
			.checkout-member-field-grid {
				display: grid;
				gap: 14px;

				.checkout-form-field-head {
					.checkout-form-field-label {
						.checkout-form-field-label-text {
							font-size: var(--type-size-100);
							line-height: var(--type-line-100);
							font-weight: var(--font-weight-semibold);
							color: var(--text-primary);
						}
					}
				}
			}

			.checkout-member-field-grid {
				grid-template-columns: repeat(2, minmax(0, 1fr));
			}
		}
	}

	.checkout-member-summary {
		position: sticky;
		top: 100px;

		.checkout-member-perks {
			border-bottom: 1px solid var(--gray-40);

			.checkout-member-perks-head {
				padding: 18px 24px;
				border-bottom: 1px solid var(--gray-40);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-bold);
				color: var(--text-primary);
				display: flex;
				justify-content: space-between;
				align-items: center;
			}

				.checkout-member-perks-body {
					display: grid;
					gap: 12px;
					padding: 16px 24px;

				.checkout-member-perk-field {
					display: grid;
					gap: 8px;
				}

				.checkout-member-perk-label-row {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 16px;
					color: var(--text-secondary);
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);

					.checkout-member-perk-label-group {
						display: inline-flex;
						align-items: center;
						gap: 6px;
						min-width: 0;
					}

					.checkout-member-perk-label-primary {
						color: var(--text-primary);
						font-weight: var(--font-weight-semibold);
					}

					.checkout-member-perk-label-secondary {
						flex-shrink: 0;
						text-align: right;
					}
				}

				.checkout-member-perk-control {
					display: grid;
					grid-template-columns: minmax(0, 1fr) auto;
					gap: 12px;
				}

				.checkout-member-inline-button {
					min-width: 98px;
					padding-inline: 18px;
					border-radius: 16px;
				}
			}
		}
	}
}

@media (max-width: 1100px) {
	.checkout-member-page {
		.checkout-member-shell {
			grid-template-columns: 1fr;
		}

		.checkout-member-summary {
			position: static;
		}
	}
}

@media (max-width: 760px) {
	.checkout-member-page {
		padding: 24px 16px 56px;

		.checkout-member-main {
			.checkout-member-section {
				.checkout-member-section-head,
				.checkout-member-inline-row {
					align-items: flex-start;
					flex-direction: column;
				}

				.checkout-member-shipping-group {
					.checkout-member-address-grid,
					.checkout-member-card-grid {
						grid-template-columns: 1fr;
					}

					.checkout-member-block {
						.checkout-member-block-head {
							align-items: flex-start;
							flex-direction: column;
						}

						.checkout-member-block-note {
							text-align: left;
						}
					}
				}

				.checkout-member-card-grid,
				.checkout-member-field-grid {
					grid-template-columns: 1fr;
				}

				.checkout-member-payment-meta {
					align-items: flex-start;
					flex-direction: column;
				}
			}
		}

		.checkout-member-summary {
			.checkout-member-perks {
				.checkout-member-perks-body {
					.checkout-member-perk-control {
						grid-template-columns: 1fr;
					}

					.checkout-member-perk-label-row {
						align-items: flex-start;
						flex-direction: column;
					}
				}
			}
		}
	}
}
</style>