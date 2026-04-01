<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useCheckoutExperience } from '~/composables/checkout/useCheckoutExperience';
import CheckoutAddressForm from '~/components/checkout/shared/CheckoutAddressForm.vue';
import { useHeightTransition } from '~/composables/checkout/shared/useHeightTransition';

const {
	is_member,
	t,
	withCountry,
	formatPrice,
	sizeDimOnly,
	completing_checkout,
	completeCheckout,
	email,
	order_total,
	order_discount,
	order_shipping_fee,
	order_subtotal,
	selected_checkout_items,
	itemMeta,

	// Identifiers & UI State
	is_login_modal_open,
	email_tooltip_open,
	points_tooltip_open,
	drop_shipping_tooltip_open,
	billing_tooltip_open,
	is_drop_shipping_address_modal_open,
	is_accredited_banks_modal_open,
	is_billing_address_modal_open,
	is_shipping_address_modal_open,

	// Methods
	openLoginModal,
	useAllPoints,
	clearPoints,
	togglePointsTooltip,
	toggleDropShippingTooltip,
	toggleBillingTooltip,
	toggleEmailTooltip,
	getAddressTagClass,

	// Data
	active_shipping_methods,
	active_payment_methods,
	selected_shipping_method,
	selected_payment_method,
	shipping_method_details,
	payment_brands,
	field_validation_by_key,

	// Transition Refs
	shipping_swap_wrapper_ref,
	billing_swap_wrapper_ref,
	drop_shipping_swap_wrapper_ref,
	drop_shipping_mode_swap_wrapper_ref,
	billing_mode_swap_wrapper_ref,
	payment_meta_swap_wrapper_ref,

	// Member Specifics (Available via spread)
	saved_shipping_addresses,
	selected_shipping_address,
	selected_shipping_address_id,
	ship_to_another_address,
	drop_shipping_enabled,
	drop_shipping_ship_to_another_address,
	drop_shipping_name,
	drop_shipping_company,
	drop_shipping_addresses,
	selected_drop_shipping_address,
	selected_drop_shipping_address_id,
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
	billing_addresses,
	selected_billing_address,
	selected_billing_address_id,
	billing_use_different_address,
	billing_full_name,
	billing_company,
	billing_address_1,
	billing_address_2,
	billing_province,
	billing_city,
	billing_postal_code,
	card_number,
	expiry,
	cvv,
} = useCheckoutExperience();

// Local UI state for Tooltips
const email_tooltip_ref = ref<HTMLElement | null>(null);
const points_tooltip_ref = ref<HTMLElement | null>(null);
const drop_shipping_tooltip_ref = ref<HTMLElement | null>(null);
const billing_tooltip_ref = ref<HTMLElement | null>(null);

// Animation Logic
const shipping_swap_enter_duration_ms = 1000;
const shipping_swap_leave_duration_ms = 360;


function beforeShippingSwapEnter(element: Element) {
	const node = element as HTMLElement;
	node.style.opacity = '0';
	node.style.overflow = 'hidden';
	node.style.clipPath = 'inset(0 0 100% 0)';
}

function enterShippingSwap(element: Element, done: () => void) {
	const node = element as HTMLElement;
	requestAnimationFrame(() => {
		node.style.opacity = '1';
		node.style.clipPath = 'inset(0 0 0 0)';
	});
	window.setTimeout(() => done(), shipping_swap_enter_duration_ms);
}

function afterShippingSwapEnter(element: Element) {
	const node = element as HTMLElement;
	node.style.opacity = '1';
	node.style.overflow = '';
	node.style.clipPath = '';
}

function beforeShippingSwapLeave(element: Element) {
	const node = element as HTMLElement;
	node.style.opacity = '1';
	node.style.overflow = 'hidden';
	node.style.clipPath = 'inset(0 0 0 0)';
	node.style.position = 'absolute';
	node.style.inset = '0';
	node.style.width = '100%';
}

function leaveShippingSwap(element: Element, done: () => void) {
	const node = element as HTMLElement;
	requestAnimationFrame(() => {
		node.style.opacity = '0';
		node.style.clipPath = 'inset(0 0 100% 0)';
	});
	window.setTimeout(() => done(), shipping_swap_leave_duration_ms);
}

function afterShippingSwapLeave(element: Element) {
	const node = element as HTMLElement;
	node.style.opacity = '';
	node.style.overflow = '';
	node.style.clipPath = '';
	node.style.position = '';
	node.style.inset = '';
	node.style.width = '';
}

// Watchers for transitions
useHeightTransition(shipping_swap_wrapper_ref, ship_to_another_address,
	() => ship_to_another_address.value ? '[data-shipping-panel="another-address"]' : '[data-shipping-panel="saved-address"]',
	{ enterDurationMs: shipping_swap_enter_duration_ms, leaveDurationMs: shipping_swap_leave_duration_ms }
);

useHeightTransition(drop_shipping_swap_wrapper_ref, drop_shipping_enabled,
	() => drop_shipping_enabled.value ? '[data-drop-shipping-panel="form"]' : null,
	{ enterDurationMs: shipping_swap_enter_duration_ms, leaveDurationMs: shipping_swap_leave_duration_ms }
);

useHeightTransition(billing_swap_wrapper_ref, use_shipping_as_billing,
	() => use_shipping_as_billing.value ? null : '[data-billing-panel="content"]',
	{ enterDurationMs: shipping_swap_enter_duration_ms, leaveDurationMs: shipping_swap_leave_duration_ms }
);

useHeightTransition(drop_shipping_mode_swap_wrapper_ref, drop_shipping_ship_to_another_address,
	() => drop_shipping_ship_to_another_address.value ? '[data-drop-shipping-mode-panel="another-address"]' : '[data-drop-shipping-mode-panel="saved-address"]',
	{ enabled: () => drop_shipping_enabled.value, enterDurationMs: shipping_swap_enter_duration_ms, leaveDurationMs: shipping_swap_leave_duration_ms }
);

useHeightTransition(billing_mode_swap_wrapper_ref, billing_use_different_address,
	() => billing_use_different_address.value ? '[data-billing-mode-panel="different-address"]' : '[data-billing-mode-panel="saved-address"]',
	{ enabled: () => !use_shipping_as_billing.value, enterDurationMs: shipping_swap_enter_duration_ms, leaveDurationMs: shipping_swap_leave_duration_ms }
);

useHeightTransition(payment_meta_swap_wrapper_ref, selected_payment_method,
	() => selected_payment_method.value === 'credit-card' ? '[data-payment-panel="credit-card"]' : (selected_payment_method.value === 'bank-transfer' ? '[data-payment-panel="bank-transfer"]' : null),
	{ enterDurationMs: shipping_swap_enter_duration_ms, leaveDurationMs: shipping_swap_leave_duration_ms }
);

function handleDocumentClick(event: MouseEvent) {
	const target = event.target as HTMLElement;
	if (!target) return;

	// Helper to check if a ref contains the target
	const isOutside = (ref: { value: HTMLElement | null }) => 
		ref.value && !ref.value.contains(target);

	// If any tooltip is open, close it if clicking outside its trigger area
	if (email_tooltip_open.value && isOutside(email_tooltip_ref)) {
		email_tooltip_open.value = false;
	}
	if (points_tooltip_open.value && isOutside(points_tooltip_ref)) {
		points_tooltip_open.value = false;
	}
	if (drop_shipping_tooltip_open.value && isOutside(drop_shipping_tooltip_ref)) {
		drop_shipping_tooltip_open.value = false;
	}
	if (billing_tooltip_open.value && isOutside(billing_tooltip_ref)) {
		billing_tooltip_open.value = false;
	}
}

onMounted(() => {
	document.addEventListener('click', handleDocumentClick, true);
});

onBeforeUnmount(() => {
	document.removeEventListener('click', handleDocumentClick, true);
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
		:loading-label="t(is_member ? 'checkout.member.completeCheckout' : 'checkout.guest.completeCheckout')"
	>
		<template #loader>
			<div ref="complete_loader_ref" />
		</template>

		<template #main>
			<!-- Guest Contact Information (Unified with member section style) -->
			<section v-if="!is_member" class="checkout-member-section">
				<h2 class="checkout-member-section-title">{{ t('checkout.guest.contactInformation') }}</h2>
				<div class="checkout-member-shipping-group">
					<div class="checkout-contact-group">
						<div class="checkout-contact-head">
							<div ref="email_tooltip_ref" class="checkout-contact-label-wrap">
								<span class="checkout-label">
									Email
									<span class="checkout-label-required" aria-hidden="true">*</span>
								</span>
								<UiTooltip
									:open="email_tooltip_open"
									side="right"
									align="start"
									mobile-side="left"
									tone="neutral"
									:offset="10"
									:slide-distance="24"
									role="dialog"
									content-class="checkout-email-tooltip-content"
									class="checkout-email-tooltip"
								>
									<template #trigger>
										<button
											type="button"
											:class="['checkout-email-tooltip-trigger', { 'is-active': email_tooltip_open }]"
											@click="toggleEmailTooltip"
										>
											<UiIcon :name="email_tooltip_open ? 'strong-question-circle' : 'regular-question-circle'" size="20" color="var(--text-secondary)" decorative />
										</button>
									</template>
									<div class="checkout-email-tooltip-copy">
										<strong class="checkout-email-tooltip-title">Email for Verification &amp; Updates</strong>
										<p class="checkout-email-tooltip-text">
											Enter your email address to continue. We'll use it to check if you already have an account and to send updates about your order.
										</p>
									</div>
								</UiTooltip>
							</div>
							<div class="checkout-login-link">
								<span class="checkout-login-link-text">{{ t('checkout.guest.loginPrompt') }}</span>
								<UiButton variant="ghost" tone="neutral" size="sm" class="checkout-login-link-action" @click="openLoginModal">
									{{ t('checkout.guest.login') }}
								</UiButton>
							</div>
						</div>
						<UiInput v-model="email" type="email" class="checkout-input" :placeholder="t('checkout.guest.fields.email.placeholder')" />
					</div>
				</div>
			</section>

			<!-- Shipping Details Section (Unified Member-Style) -->
			<section class="checkout-member-section">
 
				<div class="checkout-member-shipping-group">
					<div class="checkout-member-address-group">
						<!-- Member: Address Selection / Toggle -->
						<div v-if="is_member" class="checkout-member-radio-row">
							<UiRadio v-model="ship_to_another_address" :value="false" name="shipping-mode" class="checkout-member-radio-line">
								{{ t('checkout.member.myShippingAddress') }}
							</UiRadio>
							<UiButton type="button" variant="ghost" tone="neutral" size="sm" class="checkout-member-link" :no-hover="true" @click="is_shipping_address_modal_open = true">
								{{ t('checkout.member.viewShippingAddresses') }}
							</UiButton>
						</div>

						<div ref="shipping_swap_wrapper_ref" class="checkout-member-shipping-swap-wrap">
							<Transition @before-enter="beforeShippingSwapEnter" @enter="enterShippingSwap" @after-enter="afterShippingSwapEnter" @before-leave="beforeShippingSwapLeave" @leave="leaveShippingSwap" @after-leave="afterShippingSwapLeave">
								<!-- Saved Address (Member Only) -->
								<div v-if="is_member && !ship_to_another_address" key="saved-address" data-shipping-panel="saved-address" class="checkout-member-address-grid">
									<button v-if="selected_shipping_address" type="button" class="checkout-member-address-card is-active" @click="is_shipping_address_modal_open = true">
										<div class="checkout-member-address-top">
											<div class="checkout-member-address-title-group">
												<strong class="checkout-member-address-name">{{ selected_shipping_address.recipient }}</strong>
												<span v-if="selected_shipping_address.isDefault" class="checkout-member-address-badge">Default Shipping</span>
											</div>
										</div>
										<div class="checkout-member-address-content">
											<div v-if="selected_shipping_address.phone" class="checkout-member-address-row">
												<UiIcon name="regular-phone" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
												<p class="checkout-member-address-line checkout-member-address-line--strong">{{ selected_shipping_address.phone }}</p>
											</div>
											<div class="checkout-member-address-row checkout-member-address-row--split">
												<div class="checkout-member-address-row-main">
													<UiIcon name="regular-map-marker" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
													<div class="checkout-member-address-lines">
														<p class="checkout-member-address-line">{{ selected_shipping_address.line1 }}</p>
														<p class="checkout-member-address-line">{{ selected_shipping_address.line2 }}</p>
													</div>
												</div>
												<span v-if="selected_shipping_address.label" class="checkout-member-address-tag" :class="getAddressTagClass(selected_shipping_address.label)">
													{{ selected_shipping_address.label }}
												</span>
											</div>
											<div v-if="selected_shipping_address.company" class="checkout-member-address-row">
												<UiIcon name="regular-building" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
												<p class="checkout-member-address-line">{{ selected_shipping_address.company }}</p>
											</div>
										</div>
									</button>
								</div>

								<!-- Manual Form (Guest or Member Another Address) -->
								<div v-else key="manual-address" data-shipping-panel="manual-address" class="checkout-member-address-form">
									<div v-if="is_member" class="checkout-member-address-form-head">
										<UiRadio v-model="ship_to_another_address" :value="true" name="shipping-mode" class="checkout-member-radio-line checkout-member-radio-line--inline">
											{{ t('checkout.member.shipToAnotherAddress') }}
										</UiRadio>
										<div class="checkout-member-address-form-note">This address will be saved for future use.</div>
									</div>
									<CheckoutAddressForm
										v-model:fullName="full_name"
										v-model:company="company"
										v-model:address1="address_1"
										v-model:address2="address_2"
										v-model:province="province"
										v-model:city="city"
										v-model:postalCode="postal_code"
										v-model:phone="phone"
										:province-options="province_options"
										size="md"
									/>
								</div>
							</Transition>
						</div>
					</div>
					<UiRadio v-if="is_member && !ship_to_another_address" v-model="ship_to_another_address" :value="true" name="shipping-mode" class="checkout-member-radio-line">
						{{ t('checkout.member.shipToAnotherAddress') }}
					</UiRadio>

					<!-- Shipping Method Section -->
					<div class="checkout-member-block">
						<div class="checkout-member-block-head">
							<div class="checkout-member-block-title">{{ t('checkout.member.shippingMethod') }}</div>
							<div class="checkout-member-block-note">{{ t('checkout.member.shippingNote') }}</div>
						</div>
						<div class="checkout-member-card-grid">
							<button v-for="method in active_shipping_methods" :key="method.key" type="button" class="checkout-member-choice-card" :class="{ 'is-active': selected_shipping_method === method.key }" @click="selected_shipping_method = method.key">
								<img :src="method.icon" :alt="shipping_method_details[method.key]?.name" class="checkout-member-choice-icon">
								<div class="checkout-member-choice-copy">
									<div class="checkout-member-choice-title">{{ shipping_method_details[method.key]?.name }}</div>
									<div class="checkout-member-choice-subtitle">{{ shipping_method_details[method.key]?.date }}</div>
								</div>
								<div class="checkout-member-choice-price">{{ shipping_method_details[method.key]?.price }}</div>
							</button>
						</div>
					</div>

					<!-- Drop Shipping Section (Member Only in Original Screenshot but let's keep it shareable if enabled) -->
					<div class="checkout-member-inline-row">
						<div ref="drop_shipping_tooltip_ref" class="checkout-member-checkbox-with-tooltip">
							<UiCheckbox v-model="drop_shipping_enabled">{{ t('checkout.member.enableDropShipping') }}</UiCheckbox>
							<UiTooltip :open="drop_shipping_tooltip_open" side="right" align="start" mobile-side="bottom" tone="neutral" :offset="10" content-class="checkout-member-drop-shipping-tooltip-content" class="checkout-member-points-tooltip">
								<template #trigger>
									<button type="button" class="checkout-member-points-tooltip-trigger" @click.stop.prevent="toggleDropShippingTooltip">
										<UiIcon :name="drop_shipping_tooltip_open ? 'strong-question-circle' : 'regular-question-circle'" size="20" color="var(--text-secondary)" decorative />
									</button>
								</template>
								<div class="checkout-member-points-tooltip-copy">
									<strong class="checkout-member-points-tooltip-title">Enable Drop Shipping</strong>
									<p class="checkout-member-points-tooltip-text">
										Ship orders directly to your customer without handling the delivery. We will produce, pack, and ship the order on your behalf.
									</p>
								</div>
							</UiTooltip>
						</div>
						<div v-if="drop_shipping_enabled" class="checkout-member-drop-shipping-form-note" :class="{ 'is-muted': !is_member }">
							{{ is_member ? 'This will be saved as your default drop shipping address.' : 'Only available for members to save addresses.' }}
						</div>
					</div>

					<!-- Drop Shipping Selection Row (Member Only) -->
					<div v-if="is_member && drop_shipping_enabled" class="checkout-member-address-group">
						<div class="checkout-member-radio-row">
							<UiRadio v-model="drop_shipping_ship_to_another_address" :value="false" name="drop-shipping-mode" class="checkout-member-radio-line">
								My Drop Shipping Address
							</UiRadio>
							<UiButton variant="ghost" tone="neutral" size="sm" class="checkout-member-link" :no-hover="true" @click="is_drop_shipping_address_modal_open = true">
								View Drop Shipping Addresses
							</UiButton>
						</div>
					</div>

					<!-- Drop Shipping Swap Wrapper (Unified) -->
					<div ref="drop_shipping_swap_wrapper_ref" class="checkout-member-drop-shipping-swap-wrap">
						<Transition @before-enter="beforeShippingSwapEnter" @enter="enterShippingSwap" @after-enter="afterShippingSwapEnter" @before-leave="beforeShippingSwapLeave" @leave="leaveShippingSwap" @after-leave="afterShippingSwapLeave">
							<!-- Only show if enabled -->
							<div v-if="drop_shipping_enabled" data-drop-shipping-panel="form" class="checkout-member-drop-shipping-form">
								<!-- Member: with saved or another address options -->
								<template v-if="is_member">
									<div ref="drop_shipping_mode_swap_wrapper_ref" class="checkout-member-drop-shipping-mode-swap-wrap">
										<Transition @before-enter="beforeShippingSwapEnter" @enter="enterShippingSwap" @after-enter="afterShippingSwapEnter" @before-leave="beforeShippingSwapLeave" @leave="leaveShippingSwap" @after-leave="afterShippingSwapLeave">
											<div v-if="!drop_shipping_ship_to_another_address" key="drop-shipping-saved" data-drop-shipping-mode-panel="saved-address" class="checkout-member-drop-shipping-mode-panel">
												<div class="checkout-member-address-grid">
													<button type="button" class="checkout-member-address-card is-active">
														<div class="checkout-member-address-top">
															<div class="checkout-member-address-title-group">
																<strong class="checkout-member-address-name">{{ selected_drop_shipping_address?.recipient }}</strong>
																<span v-if="selected_drop_shipping_address?.isDefault" class="checkout-member-address-badge">Default Drop Shipping</span>
															</div>
														</div>
														<div class="checkout-member-address-content">
															<div class="checkout-member-address-row checkout-member-address-row--split">
																<div class="checkout-member-address-row-main">
																	<p class="checkout-member-address-line">{{ selected_drop_shipping_address?.company || 'No company provided' }}</p>
																</div>
																<span v-if="selected_drop_shipping_address?.label" class="checkout-member-address-tag" :class="getAddressTagClass(selected_drop_shipping_address.label)">
																	{{ selected_drop_shipping_address.label }}
																</span>
															</div>
														</div>
													</button>
												</div>
												<div class="checkout-member-address-form-head is-solo">
													<UiRadio v-model="drop_shipping_ship_to_another_address" :value="true" name="drop-shipping-mode" class="checkout-member-radio-line checkout-member-radio-line--inline">
														Ship to Another Drop Shipping Address
													</UiRadio>
												</div>
											</div>
											<div v-else key="drop-shipping-another-address" data-drop-shipping-mode-panel="another-address" class="checkout-member-drop-shipping-mode-panel">
												<div class="checkout-member-address-form-head">
													<UiRadio v-model="drop_shipping_ship_to_another_address" :value="true" name="drop-shipping-mode" class="checkout-member-radio-line checkout-member-radio-line--inline">
														Ship to Another Drop Shipping Address
													</UiRadio>
													<div class="checkout-member-address-form-note">This address will be saved for future use.</div>
												</div>
												<div class="checkout-member-field-grid">
													<UiFormField label="Name" :required="true" :show-required-mark="true">
														<UiInput v-model="drop_shipping_name" placeholder="Enter Full Name" />
													</UiFormField>
													<UiFormField label="Company (Optional)">
														<UiInput v-model="drop_shipping_company" placeholder="Enter Company Name" />
													</UiFormField>
												</div>
											</div>
										</Transition>
									</div>
								</template>

								<!-- Guest Always sees the manual form -->
								<template v-else>
									<div class="checkout-member-field-grid">
										<UiFormField label="Name" :required="true" :show-required-mark="true">
											<UiInput v-model="drop_shipping_name" placeholder="Enter Full Name" />
										</UiFormField>
										<UiFormField label="Company (Optional)">
											<UiInput v-model="drop_shipping_company" placeholder="Enter Company Name" />
										</UiFormField>
									</div>
								</template>
							</div>
						</Transition>
					</div>
				</div>
			</section>

			<!-- Payment Section (Unified Member-Style) -->
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

					<div ref="payment_meta_swap_wrapper_ref" class="checkout-member-payment-meta-swap-wrap">
						<Transition
							@before-enter="beforeShippingSwapEnter"
							@enter="enterShippingSwap"
							@after-enter="afterShippingSwapEnter"
							@before-leave="beforeShippingSwapLeave"
							@leave="leaveShippingSwap"
							@after-leave="afterShippingSwapLeave"
						>
							<div v-if="selected_payment_method === 'credit-card'" data-payment-panel="credit-card" class="checkout-member-payment-meta-panel">
								<div class="checkout-member-payment-meta">
									<button
										type="button"
										class="checkout-member-subnote-button"
										@click="is_accredited_banks_modal_open = true"
									>
										List of Accredited Banks:
									</button>
									<div class="checkout-member-payment-brands">
										<div v-for="brand in payment_brands" :key="brand.key" class="checkout-member-payment-brand">
											<img :src="brand.icon" :alt="brand.label" class="checkout-member-payment-brand-icon">
										</div>
									</div>
								</div>
							</div>
							<div v-else-if="selected_payment_method === 'bank-transfer'" data-payment-panel="bank-transfer" class="checkout-member-payment-meta-panel">
								<div class="checkout-member-payment-transfer-meta">
									<div class="checkout-member-payment-transfer-note">
										Note: Kindly allow 1-2 business days for bank transfer payments to be processed and cleared.
									</div>
									<div class="checkout-member-payment-transfer-brand">
										<img
											src="/icons/custom/payment-methods/bank-logos/hana-bank-full.svg"
											alt="Hana Bank"
											class="checkout-member-payment-transfer-brand-icon"
										>
									</div>
								</div>
							</div>
						</Transition>
					</div>
				</div>

				<!-- Credit Card Fields -->
				<div v-if="selected_payment_method === 'credit-card'" class="checkout-member-field-stack">
					<UiFormField
						:label="t('checkout.member.fields.cardNumber.label')"
						:required="true"
						:show-required-mark="true"
						head-class="checkout-form-field-head"
						label-class="checkout-form-field-label"
						label-text-class="checkout-form-field-label-text"
					>
						<UiInput v-model="card_number" size="md" :placeholder="t('checkout.member.fields.cardNumber.placeholder')" />
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
							<UiInput v-model="expiry" size="md" :placeholder="t('checkout.member.fields.expiration.placeholder')" />
						</UiFormField>
						<UiFormField
							:label="t('checkout.member.fields.cvv.label')"
							:required="true"
							:show-required-mark="true"
							head-class="checkout-form-field-head"
							label-class="checkout-form-field-label"
							label-text-class="checkout-form-field-label-text"
						>
							<UiInput v-model="cvv" size="md" :placeholder="t('checkout.member.fields.cvv.placeholder')" />
						</UiFormField>
					</div>
				</div>

				<div class="checkout-member-inline-row">
					<div ref="billing_tooltip_ref" class="checkout-member-checkbox-with-tooltip">
						<UiCheckbox v-model="use_shipping_as_billing">{{ t('checkout.member.useShippingAsBilling') }}</UiCheckbox>
						<UiTooltip :open="billing_tooltip_open" side="right" align="center" mobile-side="bottom" tone="neutral" :offset="10" :slide-distance="24" content-class="checkout-member-billing-tooltip-content" class="checkout-member-points-tooltip">
							<template #trigger>
								<button type="button" class="checkout-member-points-tooltip-trigger" @click.stop.prevent="toggleBillingTooltip">
									<UiIcon :name="billing_tooltip_open ? 'strong-question-circle' : 'regular-question-circle'" size="20" color="var(--text-secondary)" decorative />
								</button>
							</template>

							<div class="checkout-member-points-tooltip-copy">
								<strong class="checkout-member-points-tooltip-title">{{ t('checkout.member.billingTooltip.title') }}</strong>
								<p class="checkout-member-points-tooltip-text">{{ t('checkout.member.billingTooltip.text') }}</p>
							</div>
						</UiTooltip>
					</div>
				</div>

				<div ref="billing_swap_wrapper_ref" class="checkout-member-billing-swap-wrap">
					<Transition @before-enter="beforeShippingSwapEnter" @enter="enterShippingSwap" @after-enter="afterShippingSwapEnter" @before-leave="beforeShippingSwapLeave" @leave="leaveShippingSwap" @after-leave="afterShippingSwapLeave">
						<div v-if="!use_shipping_as_billing" data-billing-panel="content" class="checkout-member-billing-panel">
							<div class="checkout-member-billing-group">
								<div v-if="is_member" class="checkout-member-radio-row">
									<UiRadio v-model="billing_use_different_address" :value="false" name="billing-mode" class="checkout-member-radio-line">
										My Billing Address
									</UiRadio>
									<UiButton type="button" variant="ghost" tone="neutral" size="sm" class="checkout-member-link" :no-hover="true" @click="is_billing_address_modal_open = true">
										View Billing Addresses
									</UiButton>
								</div>

								<div ref="billing_mode_swap_wrapper_ref" class="checkout-member-drop-shipping-mode-swap-wrap">
									<Transition @before-enter="beforeShippingSwapEnter" @enter="enterShippingSwap" @after-enter="afterShippingSwapEnter" @before-leave="beforeShippingSwapLeave" @leave="leaveShippingSwap" @after-leave="afterShippingSwapLeave">
										<div v-if="!billing_use_different_address && is_member" key="billing-saved" data-billing-mode-panel="saved-address" class="checkout-member-drop-shipping-mode-panel">
											<div class="checkout-member-address-grid">
												<button v-if="selected_billing_address" type="button" class="checkout-member-address-card is-active" @click="is_billing_address_modal_open = true">
													<div class="checkout-member-address-top">
														<div class="checkout-member-address-title-group">
															<strong class="checkout-member-address-name">{{ selected_billing_address.recipient }}</strong>
															<span v-if="selected_billing_address.isDefault" class="checkout-member-address-badge">Default Billing</span>
														</div>
													</div>
													<div class="checkout-member-address-content">
														<div v-if="selected_billing_address.phone" class="checkout-member-address-row">
															<UiIcon name="regular-phone" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
															<p class="checkout-member-address-line checkout-member-address-line--strong">{{ selected_billing_address.phone }}</p>
														</div>
														<div class="checkout-member-address-row checkout-member-address-row--split">
															<div class="checkout-member-address-row-main">
																<UiIcon name="regular-map-marker" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
																<div class="checkout-member-address-lines">
																	<p class="checkout-member-address-line">{{ selected_billing_address.line1 }}</p>
																	<p v-if="selected_billing_address.line2" class="checkout-member-address-line">{{ selected_billing_address.line2 }}</p>
																</div>
															</div>
															<span v-if="selected_billing_address.label" class="checkout-member-address-tag" :class="getAddressTagClass(selected_billing_address.label)">
																{{ selected_billing_address.label }}
															</span>
														</div>
														<div v-if="selected_billing_address.company" class="checkout-member-address-row">
															<UiIcon name="regular-building" size="18" color="var(--text-secondary)" class="checkout-member-address-icon" decorative />
															<p class="checkout-member-address-line">{{ selected_billing_address.company }}</p>
														</div>
													</div>
												</button>
											</div>
											<div class="checkout-member-address-form-head is-solo">
												<UiRadio v-model="billing_use_different_address" :value="true" name="billing-mode" class="checkout-member-radio-line checkout-member-radio-line--inline">
													Use Another Billing Address
												</UiRadio>
											</div>
										</div>
										<div v-else key="billing-manual" data-billing-mode-panel="manual-address" class="checkout-member-drop-shipping-mode-panel">
											<div v-if="is_member" class="checkout-member-address-form-head">
												<UiRadio v-model="billing_use_different_address" :value="true" name="billing-mode" class="checkout-member-radio-line checkout-member-radio-line--inline">
													Ship to Another Billing Address
												</UiRadio>
											</div>
											<CheckoutAddressForm
												v-model:fullName="billing_full_name"
												v-model:company="billing_company"
												v-model:address1="billing_address_1"
												v-model:address2="billing_address_2"
												v-model:province="billing_province"
												v-model:city="billing_city"
												v-model:postalCode="billing_postal_code"
												:province-options="province_options"
												size="md"
												:hide-phone="true"
											/>
										</div>
									</Transition>
								</div>
							</div>
						</div>
					</Transition>
				</div>
			</section>
		</template>

		<template #summary>
			<CheckoutSummaryCard
				:tone="is_member ? 'member' : 'guest'"
				:title="t(is_member ? 'checkout.member.orderSummary' : 'checkout.guest.orderSummary')"
				:items="selected_checkout_items"
				:subtotal-label="t(is_member ? 'checkout.member.summary.subtotal' : 'checkout.guest.summary.subtotal')"
				:shipping-fee-label="is_member ? t('checkout.member.summary.shippingFee', { method: shipping_method_details[selected_shipping_method]?.name }) : t('checkout.guest.summary.shippingFee')"
				shipping-fee-tooltip-title="Shipping Fee"
				shipping-fee-tooltip-text="The shipping fee is calculated based on your selected delivery method and location."
				:discounts-label="t(is_member ? 'checkout.member.summary.discounts' : 'checkout.guest.summary.discounts')"
				:total-label="t(is_member ? 'checkout.member.summary.total' : 'checkout.guest.summary.total')"
				:subtotal-value="formatPrice(order_subtotal)"
				:shipping-fee-value="formatPrice(order_shipping_fee)"
				:discount-value="`-${formatPrice(order_discount)}`"
				:total-value="formatPrice(order_total)"
				:complete-label="t(is_member ? 'checkout.member.completeCheckout' : 'checkout.guest.completeCheckout')"
				:agreement-prefix="t(is_member ? 'checkout.member.agreement.prefix' : 'checkout.guest.agreement.prefix')"
				:agreement-terms="t(is_member ? 'checkout.member.agreement.terms' : 'checkout.guest.agreement.terms')"
				:agreement-and="t(is_member ? 'checkout.member.agreement.and' : 'checkout.guest.agreement.and')"
				:agreement-privacy="t(is_member ? 'checkout.member.agreement.privacy' : 'checkout.guest.agreement.privacy')"
				:agreement-suffix="t(is_member ? 'checkout.member.agreement.suffix' : 'checkout.guest.agreement.suffix')"
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
					<div v-if="is_member" class="checkout-member-perks">
						<div class="checkout-member-perks-head">
							{{ t('checkout.member.discountsAndPerks') }}
						</div>
						<div class="checkout-member-perks-body">
							<div class="checkout-member-perk-field">
								<div class="checkout-member-perk-label-row">
									<div ref="points_tooltip_ref" class="checkout-member-perk-label-group">
										<span class="checkout-member-perk-label-primary">{{ t('checkout.member.points') }}</span>
										<UiTooltip :open="points_tooltip_open" side="right" align="start" mobile-side="bottom" tone="neutral" :offset="10" content-class="checkout-member-points-tooltip-content" class="checkout-member-points-tooltip">
											<template #trigger>
												<button type="button" class="checkout-member-points-tooltip-trigger" @click="togglePointsTooltip">
													<UiIcon :name="points_tooltip_open ? 'strong-question-circle' : 'regular-question-circle'" size="20" color="var(--text-secondary)" decorative />
												</button>
											</template>
											<div class="checkout-member-points-tooltip-copy">
												<strong class="checkout-member-points-tooltip-title">How Points Work</strong>
												<p class="checkout-member-points-tooltip-text">Use your points to reduce your total at checkout. 1 point = 1 won.</p>
											</div>
										</UiTooltip>
									</div>
									<span class="checkout-member-perk-label-secondary">{{ t('checkout.member.pointsAvailable', { value: points_available.toFixed(2) }) }}</span>
								</div>
								<div class="checkout-member-perk-control">
									<UiInput v-model="points_to_use" size="md" :placeholder="t('checkout.member.pointsPlaceholder')" />
									<UiButton variant="outline" tone="neutral" size="md" class="checkout-member-inline-button" @click="points_to_use ? clearPoints() : useAllPoints()">
										{{ points_to_use ? 'Remove' : t('checkout.member.useAll') }}
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

	<!-- Modals -->
	<CheckoutLoginModal v-model="is_login_modal_open" />
	<CheckoutMemberShippingAddressModal v-model="is_shipping_address_modal_open" :addresses="saved_shipping_addresses" :selected-address-id="selected_shipping_address_id" @select="selected_shipping_address_id = $event" />
	<CheckoutMemberDropShippingAddressModal v-model="is_drop_shipping_address_modal_open" :addresses="drop_shipping_addresses" :selected-address-id="selected_drop_shipping_address_id" @select="selected_drop_shipping_address_id = $event" />
	<CheckoutMemberBillingAddressModal v-model="is_billing_address_modal_open" :addresses="billing_addresses" :selected-address-id="selected_billing_address_id" @select="selected_billing_address_id = $event" />
	<CheckoutMemberAccreditedBanksModal v-model="is_accredited_banks_modal_open" />
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

				&[disabled],
				&[aria-disabled='true'] {
					opacity: 0.4;
					cursor: not-allowed;
					pointer-events: none;
				}

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

			.checkout-member-radio-row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 12px;
			}

			.checkout-member-billing-group {
				display: grid;
				gap: 8px;

				.checkout-member-address-grid {
					display: grid;
					grid-template-columns: 1fr;
					gap: 12px;
				}

				.checkout-member-address-card {
					border: 1px solid var(--gray-40);
					border-radius: 12px;
					background: var(--contrast-light);
					padding: 0;
					overflow: hidden;
					text-align: left;
					cursor: pointer;

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

				.checkout-member-address-tag--office {
					background: #eeecff;
					color: #6b63ff;
				}

				.checkout-member-address-tag--client {
					background: #e7f2ff;
					color: #2a78ff;
				}
			}

			.checkout-member-shipping-group {
				display: grid;
				gap: 14px;

				.checkout-member-drop-shipping-form {
					display: grid;
					gap: 14px;
				}

				.checkout-member-drop-shipping-form-note {
					color: var(--text-secondary);
					font-size: var(--type-size-100);
					line-height: var(--type-line-100);
					text-align: right;
				}

				.checkout-member-address-group {
					display: grid;
					gap: 8px;
				}

				.checkout-member-billing-group {
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

				.checkout-member-address-form-head {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 16px;

					&.is-solo {
						padding-top: 4px;
					}
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

				.checkout-member-address-tag--office {
					background: #eeecff;
					color: #6b63ff;
				}

				.checkout-member-address-tag--client {
					background: #e7f2ff;
					color: #2a78ff;
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

			.checkout-member-subnote-button {
				border: 0;
				padding: 0;
				background: transparent;
				color: var(--text-primary);
				font-size: var(--type-size-100);
				line-height: var(--type-line-100);
				font-weight: var(--font-weight-bold);
				text-decoration: underline;
				text-underline-offset: 2px;
				cursor: pointer;
				text-align: left;
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
							height: 32px;
							width: auto;
							max-width: 130px;
							object-fit: contain;
						}
					}
				}

				.checkout-member-payment-transfer-meta {
					display: grid;
					gap: 14px;
				}

				.checkout-member-payment-transfer-note {
					color: var(--text-secondary);
					font-size: var(--type-size-100);
					line-height: 1.35;
				}

				.checkout-member-payment-transfer-brand {
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					min-height: 74px;
					padding-block: 16px;

					&::before {
						content: '';
						position: absolute;
						top: 50%;
						left: 0;
						right: 0;
						border-top: 1px solid var(--gray-40);
						transform: translateY(-50%);
					}
				}

				.checkout-member-payment-transfer-brand-icon {
					position: relative;
					z-index: 1;
					display: block;
					margin: 0 auto;
					width: min(100%, 240px);
					height: auto;
					padding-inline: 22px;
					background: var(--contrast-light);
					object-fit: contain;
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
				border-radius: 8px;
				box-shadow: none;
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

	/* Guest Contact Specific Styles (Literal port from CheckoutGuestPage.vue) */
	.checkout-contact-group {
		display: flex;
		flex-direction: column;
		gap: 8px;

		.checkout-contact-head {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 12px;
		}
	}

	.checkout-contact-label-wrap {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}

	.checkout-email-tooltip {
		display: inline-flex;
		align-items: center;
		align-self: center;
		line-height: 1;
	}

	.checkout-email-tooltip-trigger {
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
		transition: transform 0.16s ease, background-color 0.16s ease, color 0.16s ease;

		&:hover,
		&.is-active {
			background: transparent;
		}

		&:active {
			transform: scale(0.96);
		}
	}



	.checkout-label-required {
		color: var(--error);
	}

	.checkout-login-link {
		display: inline-flex;
		align-items: center;
		color: var(--text-primary);
		font-size: var(--type-size-100);
		line-height: var(--type-line-100);

		.checkout-login-link-action {
			--btn-soft: transparent;
			--btn-border: transparent;
			--btn-bg: transparent;
			margin-left: 4px;
			min-height: auto;
			height: auto;
			padding: 0;
			border-radius: 0;
			box-shadow: none;
			color: var(--gold-60);
			font-weight: var(--font-weight-semibold);
			text-decoration: underline;
			text-underline-offset: 3px;
			text-decoration-thickness: 2px;

			.checkout-login-link-action-label {
				padding: 0;
			}
		}
	}

	.checkout-section-title {
		font-size: var(--type-size-300);
		font-weight: var(--font-weight-semibold);
		line-height: var(--type-line-200);
		color: var(--text-primary);
	}

	.checkout-panel {
		padding: 0;
	}
}

.checkout-member-points-tooltip {
	display: inline-flex;
	align-items: center;
	line-height: 1;
}

.checkout-member-checkbox-with-tooltip {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	min-width: 0;
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
	border-radius: 9999px;
	transition: transform 0.16s ease;

	&:active {
		transform: scale(0.96);
	}
}

.checkout-member-drop-shipping-tooltip-content {
	width: min(620px, calc(100vw - 32px)) !important;
	max-width: calc(100vw - 32px) !important;
	display: flex;
	align-items: flex-start;
	padding: 16px 20px;
	border-radius: 12px;
	white-space: normal;
	box-shadow: 0 10px 28px rgba(15, 23, 42, 0.24);
}

.checkout-email-tooltip-content {
	width: min(420px, calc(100vw - 32px)) !important;
	max-width: calc(100vw - 32px) !important;
	display: flex;
	align-items: flex-start;
	padding: 16px 20px;
	border-radius: 12px;
	white-space: normal;
	box-shadow: 0 10px 28px rgba(15, 23, 42, 0.24);
}

.checkout-email-tooltip-copy {
	display: grid;
	gap: 8px;
}

.checkout-email-tooltip-title {
	font-size: 14px;
	line-height: 24px;
	font-weight: var(--font-weight-semibold);
	color: inherit;
}

.checkout-email-tooltip-text {
	font-size: 14px;
	line-height: 24px;
	font-weight: var(--font-weight-regular);
	color: inherit;
}

.checkout-member-billing-tooltip-content {
	width: min(420px, calc(100vw - 32px)) !important;
	max-width: calc(100vw - 32px) !important;
	padding: 16px 20px;
	border-radius: 12px;
	white-space: normal;
	box-shadow: 0 10px 28px rgba(15, 23, 42, 0.24);
}

.checkout-member-points-tooltip-content {
	width: min(480px, calc(100vw - 32px)) !important;
	max-width: calc(100vw - 32px) !important;
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

.checkout-member-billing-tooltip-content {
	width: min(420px, calc(100vw - 32px));
	max-width: none;
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

.checkout-member-address-grid,
.checkout-member-address-form,
.checkout-member-billing-panel,
.checkout-member-drop-shipping-form,
.checkout-member-drop-shipping-mode-panel {
	display: grid;
	gap: 14px;
	transform-origin: top;
	transition:
		opacity 0.24s ease,
		clip-path 1s cubic-bezier(0.22, 1, 0.36, 1);
	will-change: clip-path, opacity;
}

.checkout-member-payment-meta-panel {
	transform-origin: top;
	transition:
		opacity 0.24s ease,
		clip-path 1s cubic-bezier(0.22, 1, 0.36, 1);
	will-change: clip-path, opacity;
}

.checkout-member-shipping-swap-wrap,
.checkout-member-billing-swap-wrap,
.checkout-member-drop-shipping-swap-wrap,
.checkout-member-drop-shipping-mode-swap-wrap,
.checkout-member-payment-meta-swap-wrap {
	position: relative;
	transition: height 1s cubic-bezier(0.22, 1, 0.36, 1);
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
				.checkout-member-inline-row,
				.checkout-member-radio-row {
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

				.checkout-member-address-form-head {
					align-items: flex-start;
					flex-direction: column;
				}

				.checkout-member-drop-shipping-form-note,
				.checkout-member-address-form-note {
					text-align: left;
				}
			}

			/* Guest specific responsive styles */
			.checkout-contact-group {
				.checkout-contact-head {
					align-items: flex-start;
					flex-direction: column;
					gap: 4px;
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

	:deep(.checkout-member-drop-shipping-tooltip-content) {
		width: min(320px, calc(100vw - 32px));
	}

	.checkout-member-points-tooltip-title,
	.checkout-member-points-tooltip-text {
		line-height: 20px;
	}
}
</style>
