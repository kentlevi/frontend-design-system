<script setup lang="ts">
import { defineAsyncComponent, type ComponentPublicInstance } from 'vue';
import { useCheckoutExperience } from '~/composables/checkout/useCheckoutExperience';
import CheckoutGuestContactFeature from '~/components/checkout/features/CheckoutGuestContactFeature.vue';
import CheckoutMemberPerksFeature from '~/components/checkout/features/CheckoutMemberPerksFeature.vue';
import CheckoutPaymentFeature from '~/components/checkout/features/CheckoutPaymentFeature.vue';
import CheckoutAddressFeature from '~/components/checkout/features/CheckoutAddressFeature.vue';
import CheckoutPageBase from '~/components/checkout/shared/CheckoutPageBase.vue';
import CheckoutSummaryCard from '~/components/checkout/summary/CheckoutSummaryCard.vue';
import { provideCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext';
import { useInitCheckoutAddress } from '~/composables/checkout/address/useInitCheckoutAddress';
import { useMainCheckOutStore } from '~/stores/checkout/index.store';
import CheckoutPaymentWindowOverlay from '~/components/checkout/shared/CheckoutPaymentWindowOverlay.vue';
import { provideUserAddressFormStateCheckout } from '~/composables/checkout/address/context/addressFormCheckoutContext';
import { provideUserAddressDataCheckout } from '~/composables/checkout/address/context/addressBookListCheckoutContext';
import { provideAddressGeneralUI } from '~/composables/checkout/address/context/addressGeneralUICheckoutContext';

const CheckoutLoginModal = defineAsyncComponent(
	() => import('~/components/checkout/modals/CheckoutLoginModal.vue')
);
const CheckoutMemberAccreditedBanksModal = defineAsyncComponent(
	() => import('~/components/checkout/modals/CheckoutMemberAccreditedBanksModal.vue')
);
const CheckoutAddressSelectModal = defineAsyncComponent(
	() => import('./modals/CheckoutAddressSelectModal.vue')
);

/** Standalone address context (isolated from checkout_experience) */
await useInitCheckoutAddress()

provideUserAddressFormStateCheckout()
provideUserAddressDataCheckout()
provideAddressGeneralUI()

const checkout_experience = useCheckoutExperience();

const {
	is_member,
	translate,
	withCountry,
	completing_checkout,
	complete_loader_ref,
	selected_checkout_items,

	// Identifiers & UI State
	is_login_modal_open,
	is_accredited_banks_modal_open,

} = checkout_experience;

const { payment_window_open } = storeToRefs(useMainCheckOutStore());

provideCheckoutExperienceFeatureContext(checkout_experience);

function setCompleteLoaderRef(
	element: Element | ComponentPublicInstance | null,
	_refs?: Record<string, unknown>,
) {
	complete_loader_ref.value = element instanceof HTMLElement ? element : null;
}
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
		:loading-label="translate(is_member ? 'checkout.member.completeCheckout' : 'checkout.guest.completeCheckout')"
	>
		<template #loader>
			<div :ref="setCompleteLoaderRef" />
		</template>

		<template #main>
			<CheckoutGuestContactFeature />
			<ClientOnly>
				<CheckoutAddressFeature />
				<template #fallback>
					<div class="checkout-address-loader" aria-busy="true" aria-live="polite">
						<!-- "My shipping address" radio + "View" link -->
						<div class="checkout-address-loader-row">
							<div class="checkout-address-loader-inline">
								<UiSkeleton :width="20" :height="20" circle />
								<UiSkeleton :height="16" :width="100" />
							</div>
							<UiSkeleton :height="14" :width="90" />
						</div>

						<!-- Saved address card -->
						<div class="checkout-address-loader-card">
							<div class="checkout-address-loader-card-head">
								<UiSkeleton :height="18" :width="120" />
								<UiSkeleton :height="22" :width="78" :border-radius="999" />
							</div>
							<div class="checkout-address-loader-card-line">
								<UiSkeleton :width="16" :height="16" />
								<UiSkeleton :height="14" :width="160" />
							</div>
							<div class="checkout-address-loader-card-line">
								<UiSkeleton :width="16" :height="16" />
								<UiSkeleton :height="14" :width="260" />
								<UiSkeleton class="checkout-address-loader-card-tag" :height="22" :width="48" :border-radius="999" />
							</div>
							<div class="checkout-address-loader-card-line">
								<UiSkeleton :width="16" :height="16" />
								<UiSkeleton :height="14" :width="80" />
							</div>
						</div>

						<!-- "Ship to another address" radio -->
						<div class="checkout-address-loader-inline">
							<UiSkeleton :width="20" :height="20" circle />
							<UiSkeleton :height="16" :width="140" />
						</div>

						<!-- Shipping method heading + note -->
						<div class="checkout-address-loader-row">
							<UiSkeleton :height="16" :width="80" />
							<UiSkeleton :height="14" :width="240" />
						</div>

						<!-- Shipping method card -->
						<div class="checkout-address-loader-shipping-card">
							<UiSkeleton :width="36" :height="36" :border-radius="10" />
							<div class="checkout-address-loader-shipping-copy">
								<UiSkeleton :height="14" :width="120" />
								<UiSkeleton :height="12" :width="140" />
							</div>
							<UiSkeleton :height="14" :width="60" />
						</div>

						<!-- Drop shipping checkbox -->
						<div class="checkout-address-loader-inline">
							<UiSkeleton :width="18" :height="18" :border-radius="4" />
							<UiSkeleton :height="14" :width="120" />
							<UiSkeleton :width="14" :height="14" circle />
						</div>
					</div>
				</template>
			</ClientOnly>
			<CheckoutPaymentFeature />
		</template>

		<template #summary>
			<CheckoutSummaryCard
				:tone="is_member ? 'member' : 'guest'"
				:items="selected_checkout_items"
				:shipping-fee-tooltip-title="translate(is_member ? 'checkout.member.summary.shippingFeeTooltipTitle' : 'checkout.guest.summary.shippingFeeTooltipTitle')"
				:shipping-fee-tooltip-text="translate(is_member ? 'checkout.member.summary.shippingFeeTooltipText' : 'checkout.guest.summary.shippingFeeTooltipText')"
				:complete-label="translate(is_member ? 'checkout.member.completeCheckout' : 'checkout.guest.completeCheckout')"
				:agreement-prefix="translate(is_member ? 'checkout.member.agreement.prefix' : 'checkout.guest.agreement.prefix')"
				:agreement-terms="translate(is_member ? 'checkout.member.agreement.terms' : 'checkout.guest.agreement.terms')"
				:agreement-and="translate(is_member ? 'checkout.member.agreement.and' : 'checkout.guest.agreement.and')"
				:agreement-privacy="translate(is_member ? 'checkout.member.agreement.privacy' : 'checkout.guest.agreement.privacy')"
				:agreement-suffix="translate(is_member ? 'checkout.member.agreement.suffix' : 'checkout.guest.agreement.suffix')"
				:terms-path="withCountry('/terms-of-use')"
				:privacy-path="withCountry('/privacy-policy')"
			>
				<template #after-items>
					<CheckoutMemberPerksFeature />
				</template>
			</CheckoutSummaryCard>
		</template>
	</CheckoutPageBase>

	<!-- Modals -->
	<CheckoutLoginModal v-model="is_login_modal_open" />
	<CheckoutAddressSelectModal
		:title="translate('checkout.member.addressSelection.shippingTitle')"
		:copy="translate('checkout.member.addressSelection.shippingDescription')"
		:confirm-label="translate('checkout.member.addressSelection.selectAddress')"
	/>
	<CheckoutMemberAccreditedBanksModal v-model="is_accredited_banks_modal_open" />

	<!-- Payment window overlay -->
	<CheckoutPaymentWindowOverlay :visible="payment_window_open" />
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
	}

	.checkout-member-summary {
		position: sticky;
		top: 100px;
	}
}

.checkout-address-loader,
.checkout-payment-loader {
	display: grid;
	gap: 14px;
}

.checkout-address-loader {
	.checkout-address-loader-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}

	.checkout-address-loader-inline {
		display: inline-flex;
		align-items: center;
		gap: 10px;
	}

	.checkout-address-loader-card {
		display: grid;
		gap: 12px;
		padding: 18px 20px;
		border: 1px solid var(--gray-40);
		border-radius: 12px;
		background: var(--contrast-light);
	}

	.checkout-address-loader-card-head {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.checkout-address-loader-card-line {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.checkout-address-loader-card-tag {
		margin-left: auto;
	}

	.checkout-address-loader-shipping-card {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 14px 16px;
		border: 1px solid var(--gray-40);
		border-radius: 12px;
		background: var(--contrast-light);
		min-height: 62px;
	}

	.checkout-address-loader-shipping-copy {
		flex: 1;
		display: grid;
		gap: 6px;
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
	}
}
</style>