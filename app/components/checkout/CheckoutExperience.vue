<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import { useCheckoutExperience } from '~/composables/checkout/useCheckoutExperience';
import CheckoutGuestContactFeature from '~/components/checkout/features/CheckoutGuestContactFeature.vue';
import CheckoutMemberPerksFeature from '~/components/checkout/features/CheckoutMemberPerksFeature.vue';
import CheckoutPaymentFeature from '~/components/checkout/features/CheckoutPaymentFeature.vue';
import CheckoutAddressFeature from '~/components/checkout/features/CheckoutAddressFeature.vue';
import CheckoutLoginModal from '~/components/checkout/modals/CheckoutLoginModal.vue';
import CheckoutMemberAccreditedBanksModal from '~/components/checkout/modals/CheckoutMemberAccreditedBanksModal.vue';
import CheckoutPageBase from '~/components/checkout/shared/CheckoutPageBase.vue';
import CheckoutSummaryCard from '~/components/checkout/summary/CheckoutSummaryCard.vue';
import { provideCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext';
import CheckoutAddressSelectModal from './modals/CheckoutAddressSelectModal.vue';
import { useInitCheckoutAddress } from '~/composables/checkout/address/useInitCheckoutAddress';
import { useMainCheckOutStore } from '~/stores/checkout/index.store';
import CheckoutPaymentWindowOverlay from '~/components/checkout/shared/CheckoutPaymentWindowOverlay.vue';
import { provideUserAddressFormStateCheckout } from '~/composables/checkout/address/context/addressFormCheckoutContext';
import { provideUserAddressDataCheckout } from '~/composables/checkout/address/context/addressBookListCheckoutContext';
import { provideAddressGeneralUI } from '~/composables/checkout/address/context/addressGeneralUICheckoutContext';

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
			<CheckoutAddressFeature />
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