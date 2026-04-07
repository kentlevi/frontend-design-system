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
			<div :ref="setCompleteLoaderRef" />
		</template>

		<template #main>
			<CheckoutGuestContactFeature />
			<CheckoutAddressFeatureV2 />
			<CheckoutPaymentFeature />
		</template>

		<template #summary>
			<CheckoutSummaryCard
				:tone="is_member ? 'member' : 'guest'"
				:items="selected_checkout_items"
				shipping-fee-tooltip-title="Shipping Fee"
				shipping-fee-tooltip-text="The shipping fee is calculated based on your selected delivery method and location."
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
			>
				<template #after-items>
					<CheckoutMemberPerksFeature />
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

<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue';
import { useCheckoutExperience } from '~/composables/checkout/useCheckoutExperience';
import CheckoutGuestContactFeature from '~/components/checkout/features/CheckoutGuestContactFeature.vue';
import CheckoutMemberPerksFeature from '~/components/checkout/features/CheckoutMemberPerksFeature.vue';
import CheckoutPaymentFeature from '~/components/checkout/features/CheckoutPaymentFeature.vue';
import CheckoutAddressFeatureV2 from '~/components/checkout/features/CheckoutAddressFeatureV2.vue';
import { provideCheckoutExperienceFeatureContext } from '~/composables/checkout/checkoutExperienceFeatureContext';

const checkout_experience = useCheckoutExperience();

const {
	is_member,
	t,
	withCountry,
	formatPrice,
	sizeDimOnly,
	completing_checkout,
	complete_loader_ref,
	selected_checkout_items,
	itemMeta,

	// Identifiers & UI State
	is_login_modal_open,
	is_drop_shipping_address_modal_open,
	is_accredited_banks_modal_open,
	is_billing_address_modal_open,
	is_shipping_address_modal_open,


	// Member Specifics (Available via spread)
	saved_shipping_addresses,
	selected_shipping_address_id,
	drop_shipping_addresses,
	selected_drop_shipping_address_id,
	billing_addresses,
	selected_billing_address_id,
} = checkout_experience;
provideCheckoutExperienceFeatureContext(checkout_experience);

function setCompleteLoaderRef(
	element: Element | ComponentPublicInstance | null,
	_refs?: Record<string, unknown>,
) {
	complete_loader_ref.value = element instanceof HTMLElement ? element : null;
}
</script>

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