<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useCheckoutMemberPage } from '~/composables/checkout/member/useCheckoutMemberPage';

const {
	withCountry,
	t,
	selected_checkout_items,
	order_total,
	order_discount,
	order_shipping_fee,
	order_subtotal,
	formatPrice,
	sizeDimOnly,
	saved_shipping_addresses,
	selected_shipping_address_id,
	ship_to_another_address,
	selected_shipping_method,
	selected_payment_method,
	active_shipping_methods,
	active_payment_methods,
	payment_brands,
	drop_shipping_enabled,
	full_name,
	company,
	address_1,
	address_2,
	province,
	city,
	postal_code,
	phone,
	province_options,
	use_shipping_as_billing,
	points_available,
	points_to_use,
	coupon_code,
	card_number,
	expiry,
	cvv,
	useAllPoints,
	completing_checkout,
	complete_loader_ref,
	completeCheckout,
	shipping_method_details,
	itemMeta,
} = useCheckoutMemberPage();

const points_tooltip_open = ref(false);
const points_tooltip_ref = ref<HTMLElement | null>(null);

function togglePointsTooltip() {
	points_tooltip_open.value = !points_tooltip_open.value;
}

function closePointsTooltip() {
	points_tooltip_open.value = false;
}

function handlePointsTooltipPointerDown(event: PointerEvent) {
	const target = event.target as Node | null;
	if (!target) return;
	if (points_tooltip_ref.value?.contains(target)) return;
	closePointsTooltip();
}

function handlePointsTooltipEscape(event: KeyboardEvent) {
	if (event.key !== 'Escape') return;
	closePointsTooltip();
}

onMounted(() => {
	window.addEventListener('pointerdown', handlePointsTooltipPointerDown, true);
	window.addEventListener('keydown', handlePointsTooltipEscape);
});

onBeforeUnmount(() => {
	window.removeEventListener('pointerdown', handlePointsTooltipPointerDown, true);
	window.removeEventListener('keydown', handlePointsTooltipEscape);
});
</script>

<template>
	<CheckoutPageBase
		page-class="checkout-member-page"
		shell-class="checkout-member-shell"
		main-class="checkout-member-main"
		summary-class="checkout-member-summary"
		test-id="checkout-member-page"
		loading-test-id="checkout-member-complete-loading-overlay"
		:loading="completing_checkout"
		:loading-label="t('checkout.member.completeCheckout')"
	>
		<template #loader>
			<div ref="complete_loader_ref" />
		</template>

		<template #main>
			<section class="checkout-member-section">
				<div class="checkout-member-section-head">
					<h1 class="checkout-member-section-title">{{ t('checkout.member.shippingDetails') }}</h1>
					<UiButton variant="ghost" tone="neutral" size="sm" class="checkout-member-link" :no-hover="true">
						{{ t('checkout.member.viewShippingAddresses') }}
					</UiButton>
				</div>

				<div class="checkout-member-shipping-group">
					<div class="checkout-member-address-group">
						<UiRadio v-model="ship_to_another_address" :value="false" name="shipping-mode" class="checkout-member-radio-line">
							{{ t('checkout.member.myShippingAddress') }}
						</UiRadio>

						<Transition name="checkout-member-shipping-swap" mode="out-in">
							<div v-if="!ship_to_another_address" key="saved-address" class="checkout-member-address-grid">
								<button
									v-for="address in saved_shipping_addresses"
									:key="address.id"
									type="button"
									class="checkout-member-address-card"
									:class="{ 'is-active': selected_shipping_address_id === address.id }"
									@click="selected_shipping_address_id = address.id"
								>
									<div class="checkout-member-address-top">
										<div class="checkout-member-address-title-group">
											<strong class="checkout-member-address-name">{{ address.recipient }}</strong>
											<span v-if="address.isDefault" class="checkout-member-address-badge">Default Shipping</span>
										</div>
									</div>
									<div class="checkout-member-address-content">
										<div v-if="address.phone" class="checkout-member-address-row">
											<UiIcon name="regular-phone" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
											<p class="checkout-member-address-line checkout-member-address-line--strong">{{ address.phone }}</p>
										</div>
										<div class="checkout-member-address-row checkout-member-address-row--split">
											<div class="checkout-member-address-row-main">
												<UiIcon name="regular-map-marker" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
												<div class="checkout-member-address-lines">
													<p class="checkout-member-address-line">{{ address.line1 }}</p>
													<p class="checkout-member-address-line">{{ address.line2 }}</p>
												</div>
											</div>
											<span v-if="address.label" class="checkout-member-address-tag">{{ address.label }}</span>
										</div>
										<div v-if="address.company" class="checkout-member-address-row">
											<UiIcon name="regular-building" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
											<p class="checkout-member-address-line">{{ address.company }}</p>
										</div>
									</div>
								</button>
							</div>
							<div v-else key="another-address" class="checkout-member-address-form">
								<UiRadio v-model="ship_to_another_address" :value="true" name="shipping-mode" class="checkout-member-radio-line checkout-member-radio-line--inline">
									{{ t('checkout.member.shipToAnotherAddress') }}
								</UiRadio>
								<div class="checkout-member-address-form-note">This address will be saved for future use.</div>
								<div class="checkout-member-field-grid">
									<UiFormField
										:label="t('checkout.guest.fields.fullName.label')"
										:required="true"
										:show-required-mark="true"
										head-class="checkout-form-field-head"
										label-class="checkout-form-field-label"
										label-text-class="checkout-form-field-label-text"
									>
										<UiInput v-model="full_name" size="lg" :placeholder="t('checkout.guest.fields.fullName.placeholder')" />
									</UiFormField>
									<UiFormField
										:label="t('checkout.guest.fields.company.label')"
										head-class="checkout-form-field-head"
										label-class="checkout-form-field-label"
										label-text-class="checkout-form-field-label-text"
									>
										<UiInput v-model="company" size="lg" :placeholder="t('checkout.guest.fields.company.placeholder')" />
									</UiFormField>
								</div>
								<UiFormField
									:label="t('checkout.guest.fields.streetAddress.label')"
									:required="true"
									:show-required-mark="true"
									head-class="checkout-form-field-head"
									label-class="checkout-form-field-label"
									label-text-class="checkout-form-field-label-text"
								>
									<div class="checkout-member-field-stack">
										<UiInput v-model="address_1" size="lg" :placeholder="t('checkout.guest.fields.streetAddress.line1Placeholder')" />
										<UiInput v-model="address_2" size="lg" :placeholder="t('checkout.guest.fields.streetAddress.line2Placeholder')" />
									</div>
								</UiFormField>
								<div class="checkout-member-field-grid">
									<UiFormField
										:label="t('checkout.guest.fields.province.label')"
										:required="true"
										:show-required-mark="true"
										head-class="checkout-form-field-head"
										label-class="checkout-form-field-label"
										label-text-class="checkout-form-field-label-text"
									>
										<UiSelect
											:model-value="province"
											:options="province_options"
											:placeholder="t('checkout.guest.fields.province.placeholder')"
											class="checkout-member-select"
											trigger-class="checkout-member-select-trigger"
											@update:model-value="province = String($event)"
										/>
									</UiFormField>
									<UiFormField
										:label="t('checkout.guest.fields.city.label')"
										:required="true"
										:show-required-mark="true"
										head-class="checkout-form-field-head"
										label-class="checkout-form-field-label"
										label-text-class="checkout-form-field-label-text"
									>
										<UiInput v-model="city" size="lg" :placeholder="t('checkout.guest.fields.city.placeholder')" />
									</UiFormField>
								</div>
								<div class="checkout-member-field-grid">
									<UiFormField
										:label="t('checkout.guest.fields.postalCode.label')"
										:required="true"
										:show-required-mark="true"
										head-class="checkout-form-field-head"
										label-class="checkout-form-field-label"
										label-text-class="checkout-form-field-label-text"
									>
										<UiInput v-model="postal_code" size="lg" :placeholder="t('checkout.guest.fields.postalCode.placeholder')" />
									</UiFormField>
									<UiFormField
										:label="t('checkout.guest.fields.phone.label')"
										head-class="checkout-form-field-head"
										label-class="checkout-form-field-label"
										label-text-class="checkout-form-field-label-text"
									>
										<div class="checkout-member-phone-field">
											<div class="checkout-member-phone-prefix">+82</div>
											<UiInput
												v-model="phone"
												size="lg"
												class="checkout-member-phone-input"
												input-class="checkout-member-phone-input-field"
												:placeholder="t('checkout.guest.fields.phone.placeholder')"
											/>
										</div>
									</UiFormField>
								</div>
							</div>
						</Transition>
					</div>

					<UiRadio v-model="ship_to_another_address" :value="true" name="shipping-mode" class="checkout-member-radio-line">
						{{ t('checkout.member.shipToAnotherAddress') }}
					</UiRadio>

					<div class="checkout-member-block">
						<div class="checkout-member-block-head">
							<div class="checkout-member-block-title">{{ t('checkout.member.shippingMethod') }}</div>
							<div class="checkout-member-block-note">{{ t('checkout.member.shippingNote') }}</div>
						</div>
						<div class="checkout-member-card-grid">
							<button
								v-for="method in active_shipping_methods"
								:key="method.key"
								type="button"
								class="checkout-member-choice-card"
								:class="{ 'is-active': selected_shipping_method === method.key }"
								@click="selected_shipping_method = method.key"
							>
								<img :src="method.icon" :alt="shipping_method_details[method.key]?.name" class="checkout-member-choice-icon">
								<div class="checkout-member-choice-copy">
									<div class="checkout-member-choice-title">{{ shipping_method_details[method.key]?.name }}</div>
									<div class="checkout-member-choice-subtitle">{{ shipping_method_details[method.key]?.date }}</div>
								</div>
								<div class="checkout-member-choice-price">{{ shipping_method_details[method.key]?.price }}</div>
							</button>
						</div>
					</div>

					<div class="checkout-member-inline-row">
						<UiCheckbox v-model="drop_shipping_enabled">{{ t('checkout.member.enableDropShipping') }}</UiCheckbox>
						<UiButton variant="ghost" tone="neutral" size="sm" class="checkout-member-link is-muted" :no-hover="true">
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
							v-for="method in active_payment_methods"
							:key="method.key"
							type="button"
							class="checkout-member-choice-card checkout-member-choice-card--payment"
							:class="{ 'is-active': selected_payment_method === method.key }"
							@click="selected_payment_method = method.key"
						>
							<img :src="method.icon" :alt="t(`checkout.guest.paymentMethods.${method.i18nKey}.alt`)" class="checkout-member-choice-icon">
							<div class="checkout-member-choice-title">{{ t(`checkout.guest.paymentMethods.${method.i18nKey}.label`) }}</div>
						</button>
					</div>

					<div class="checkout-member-payment-meta">
						<div class="checkout-member-subnote">{{ t('checkout.member.paymentSubnote') }}</div>
						<div class="checkout-member-payment-brands">
							<div v-for="brand in payment_brands" :key="brand.key" class="checkout-member-payment-brand">
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
						<UiInput v-model="card_number" size="lg" :placeholder="t('checkout.member.fields.cardNumber.placeholder')" />
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
					<UiCheckbox v-model="use_shipping_as_billing">{{ t('checkout.member.useShippingAsBilling') }}</UiCheckbox>
					<UiButton variant="ghost" tone="neutral" size="sm" class="checkout-member-link is-muted" :no-hover="true">
						{{ t('checkout.member.viewBillingAddresses') }}
					</UiButton>
				</div>
			</section>
		</template>

		<template #summary>
			<CheckoutSummaryCard
				tone="member"
				:title="t('checkout.member.orderSummary')"
				:items="selected_checkout_items"
				:subtotal-label="t('checkout.member.summary.subtotal')"
				:shipping-fee-label="t('checkout.member.summary.shippingFee', { method: shipping_method_details[selected_shipping_method]?.name })"
				shipping-fee-tooltip-title="Shipping Fee"
				shipping-fee-tooltip-text="The shipping fee is calculated based on your selected delivery method and location. Standard shipping offers a more affordable option, while express shipping delivers your order faster at a higher cost."
				:discounts-label="t('checkout.member.summary.discounts')"
				:total-label="t('checkout.member.summary.total')"
				:subtotal-value="formatPrice(order_subtotal)"
				:shipping-fee-value="formatPrice(order_shipping_fee)"
				:discount-value="`-${formatPrice(order_discount)}`"
				:total-value="formatPrice(order_total)"
				:complete-label="t('checkout.member.completeCheckout')"
				:agreement-prefix="t('checkout.member.agreement.prefix')"
				:agreement-terms="t('checkout.member.agreement.terms')"
				:agreement-and="t('checkout.member.agreement.and')"
				:agreement-privacy="t('checkout.member.agreement.privacy')"
				:agreement-suffix="t('checkout.member.agreement.suffix')"
				:terms-path="withCountry('/terms-of-use')"
				:privacy-path="withCountry('/privacy-policy')"
				:disabled="selected_checkout_items.length === 0"
				:loading="completing_checkout"
				:size-dim-only="sizeDimOnly"
				:format-price="formatPrice"
				:item-meta="itemMeta"
				@submit="completeCheckout(selected_checkout_items.length > 0)"
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
									<div ref="points_tooltip_ref" class="checkout-member-perk-label-group">
										<span class="checkout-member-perk-label-primary">{{ t('checkout.member.points') }}</span>
										<UiTooltip
											:open="points_tooltip_open"
											side="right"
											align="start"
											mobile-side="bottom"
											tone="neutral"
											:offset="10"
											:slide-distance="24"
											role="dialog"
											content-class="checkout-member-points-tooltip-content"
											class="checkout-member-points-tooltip"
										>
											<template #trigger>
												<button
													type="button"
													class="checkout-member-points-tooltip-trigger"
													:class="{ 'is-active': points_tooltip_open }"
													:aria-expanded="points_tooltip_open"
													aria-haspopup="dialog"
													aria-label="Show points information"
													@click="togglePointsTooltip"
												>
													<UiIcon
														:name="points_tooltip_open ? 'strong-question-circle' : 'regular-question-circle'"
														size="20"
														color="var(--text-secondary)"
														decorative
													/>
												</button>
											</template>

											<div class="checkout-member-points-tooltip-copy">
												<strong class="checkout-member-points-tooltip-title">How Points Work</strong>
												<p class="checkout-member-points-tooltip-text">
													Use your points to reduce your total at checkout. 1 point is equivalent to 1 won, and the applied points will be deducted directly from your order amount.
												</p>
											</div>
										</UiTooltip>
									</div>
									<span class="checkout-member-perk-label-secondary">{{ t('checkout.member.pointsAvailable', { value: points_available.toFixed(2) }) }}</span>
								</div>
								<div class="checkout-member-perk-control">
									<UiInput v-model="points_to_use" size="md" :placeholder="t('checkout.member.pointsPlaceholder')" />
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
									<UiInput v-model="coupon_code" size="md" :placeholder="t('checkout.member.couponPlaceholder')" />
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
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-semibold);
				color: var(--text-primary);

				&.checkout-member-radio-line--inline {
					margin-bottom: 2px;
				}
			}

			.checkout-member-shipping-group {
				display: grid;
				gap: 14px;

				.checkout-member-address-group {
					display: grid;
					gap: 8px;
				}

				.checkout-member-address-grid {
					display: grid;
					grid-template-columns: 1fr;
					gap: 12px;
				}

				.checkout-member-address-form {
					display: grid;
					gap: 14px;
				}

				.checkout-member-address-form-note {
					color: var(--text-secondary);
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					text-align: right;
				}

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
					text-align: left;
					cursor: pointer;

					&.is-active {
						border-color: var(--gray-60);
						background: var(--gray-20);
					}
				}

				.checkout-member-address-card {
					padding: 0;
					overflow: hidden;
				}

				.checkout-member-address-top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 12px;
					padding: 14px 16px;
					border-bottom: 1px solid var(--gray-40);
				}

				.checkout-member-address-title-group {
					display: inline-flex;
					align-items: center;
					flex-wrap: wrap;
					gap: 8px;
				}

				.checkout-member-address-name {
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					font-weight: var(--font-weight-bold);
					color: var(--text-primary);
				}

				.checkout-member-address-badge {
					padding: 3px 10px;
					border-radius: 999px;
					border: 1px solid var(--gray-40);
					background: var(--contrast-light);
					font-size: var(--type-size-50);
					line-height: var(--type-line-50);
					font-weight: var(--font-weight-semibold);
					color: var(--text-secondary);
				}

				.checkout-member-address-content {
					display: grid;
					gap: 10px;
					padding: 14px 16px;
				}

				.checkout-member-address-row {
					display: flex;
					align-items: flex-start;
					gap: 8px;
				}

				.checkout-member-address-row--split {
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
					line-height: 1.35;
				}

				.checkout-member-address-line--strong {
					color: var(--text-primary);
					font-weight: var(--font-weight-semibold);
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
						min-height: 62px;
						display: flex;
						align-items: center;
						gap: 12px;
						padding: 14px 16px;

						.checkout-member-choice-icon {
							width: 36px;
							height: 36px;
							object-fit: contain;
							flex-shrink: 0;
						}

						.checkout-member-choice-copy {
							flex: 1;
							display: grid;
							gap: 4px;
						}

						.checkout-member-choice-title {
							font-size: var(--type-size-100);
							line-height: var(--type-line-100);
							font-weight: var(--font-weight-semibold);
							color: var(--text-primary);
						}

						.checkout-member-choice-subtitle {
							color: var(--text-secondary);
							font-size: var(--type-size-100);
							line-height: var(--type-line-100);
						}

						.checkout-member-choice-price {
							font-size: var(--type-size-100);
							line-height: var(--type-line-100);
							font-weight: var(--font-weight-semibold);
							color: var(--text-primary);
						}
					}
				}
			}

			.checkout-member-card-grid {
				display: grid;
				grid-template-columns: repeat(2, minmax(0, 1fr));
				gap: 12px;

				&.checkout-member-card-grid--payments {
					grid-template-columns: repeat(3, minmax(0, 1fr));
				}
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
					padding: 20px 22px;
					min-height: 62px;
				}

				.checkout-member-choice-icon {
					width: 38px;
					height: 38px;
					object-fit: contain;
					flex-shrink: 0;
				}

				.checkout-member-choice-title {
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
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
					justify-content: space-between;
					gap: 16px;

					.checkout-member-payment-brands {
						display: flex;
						align-items: center;
						flex-wrap: nowrap;

						.checkout-member-payment-brand {
							display: inline-flex;
							align-items: center;
							justify-content: center;
						}

						.checkout-member-payment-brand-icon {
							display: block;
							height: 28px;
							width: auto;
							max-width: 76px;
							object-fit: contain;
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

			.checkout-member-select {
				width: 100%;
			}

			.checkout-member-select-trigger {
				height: 44px;
				border-radius: 8px;
				box-shadow: none;
			}

			.checkout-member-phone-field {
				display: grid;
				grid-template-columns: 54px minmax(0, 1fr);
				border: 1px solid var(--gray-40);
				border-radius: 8px;
				overflow: hidden;
				background: var(--contrast-light);
			}

			.checkout-member-phone-prefix {
				display: flex;
				align-items: center;
				justify-content: center;
				background: var(--gray-20);
				border-right: 1px solid var(--gray-40);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				color: var(--text-primary);
				min-height: 44px;
				padding: 0 12px;
			}

			.checkout-member-phone-input {
				width: 100%;
				border: 0;
				border-radius: 0;
				box-shadow: none;
				background: transparent;
				min-height: 44px;
				padding-inline: 0;

				.checkout-member-phone-input-field {
					height: 100%;
					min-height: 44px;
					padding: 0 16px;
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
				}
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
						position: relative;
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

.checkout-member-points-tooltip {
	display: inline-flex;
	align-items: center;
	line-height: 1;
}

.checkout-member-points-tooltip-trigger {
	border: 0;
	padding: 0;
	width: 20px;
	height: 20px;
	background: transparent;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	border-radius: 999px;
	transition: transform 0.16s ease;

	&:active {
		transform: scale(0.96);
	}
}

.checkout-member-points-tooltip-content {
	width: min(480px, calc(100vw - 32px));
	max-width: calc(100vw - 32px);
	display: flex;
	align-items: flex-start;
	padding: 16px 20px;
	border-radius: 12px;
	white-space: normal;
	box-shadow: 0 10px 28px rgba(15, 23, 42, 0.24);
}

.checkout-member-points-tooltip-copy {
	display: grid;
	gap: 10px;
	width: 100%;
	min-width: 0;
}

.checkout-member-points-tooltip-title {
	font-size: 14px;
	line-height: 24px;
	font-weight: var(--font-weight-semibold);
	color: inherit;
}

.checkout-member-points-tooltip-text {
	font-size: 14px;
	line-height: 24px;
	font-weight: var(--font-weight-regular);
	color: inherit;
	word-break: break-word;
}

.checkout-member-shipping-swap-enter-active,
.checkout-member-shipping-swap-leave-active {
	transition: opacity 0.24s ease, transform 0.24s ease;
	transform-origin: top;
}

.checkout-member-shipping-swap-enter-from,
.checkout-member-shipping-swap-leave-to {
	opacity: 0;
	transform: translateY(-10px);
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

					.checkout-member-address-row--split {
						align-items: flex-start;
						flex-direction: column;
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

				.checkout-member-address-form-note {
					text-align: left;
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

	:deep(.checkout-member-points-tooltip-content) {
		width: min(320px, calc(100vw - 32px));
	}

	.checkout-member-points-tooltip-title,
	.checkout-member-points-tooltip-text {
		line-height: 20px;
	}
}
</style>
