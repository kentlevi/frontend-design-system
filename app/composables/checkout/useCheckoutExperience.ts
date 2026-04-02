import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCountry } from '~/composables/app/country/useCountry';
import { useUsersStore } from '~/stores/users/users.store';
import { useCheckoutMember } from '~/composables/checkout/member/useCheckoutMember';
import { useCheckoutCompletion } from '~/composables/checkout/completion/useCheckoutCompletion';
import { useCheckoutTooltipState } from '~/composables/checkout/features/useCheckoutTooltipState';
import {
	checkoutFieldValidation,
	checkoutMemberPaymentBrands,
} from '~/data/checkout/options';

export function useCheckoutExperience() {
	const { t } = useI18n();
	const { withCountry } = useCountry();
	const user_store = useUsersStore();

	// Use Member logic as the primary base for both guest and member
	const member_logic = useCheckoutMember();

	const { completing_checkout, complete_loader_ref, completeCheckout } = useCheckoutCompletion({
		...member_logic,
		redirectPath: withCountry('/checkout/success')
	});

	const is_member = computed(() => user_store.state.id !== 0);

	// Guest-specific fields that aren't in Member logic
	const guest_email = ref('');
	const email = computed({
		get: () => is_member.value ? member_logic.member_email.value : guest_email.value,
		set: (val) => {
			if (!is_member.value) guest_email.value = val;
		}
	});

	const is_login_modal_open = ref(false);
	const {
		email_tooltip_open,
		points_tooltip_open,
		drop_shipping_tooltip_open,
		billing_tooltip_open,
		toggleEmailTooltip,
		togglePointsTooltip,
		toggleDropShippingTooltip,
		toggleBillingTooltip,
	} = useCheckoutTooltipState();

	// Modal States expected by the template
	const is_shipping_address_modal_open = ref(false);
	const is_billing_address_modal_open = ref(false);
	const is_drop_shipping_address_modal_open = ref(false);
	const is_accredited_banks_modal_open = ref(false);

	// Static lookup data for the template
	const shipping_method_details = {
		standard: { name: 'Standard', date: 'December 15, 2025', price: 'Free' },
		express: { name: 'Express', date: 'December 12, 2025', price: '$15.00' },
	} as Record<string, { name: string; date: string; price: string }>;

	const field_validation_by_key = checkoutFieldValidation;

	function openLoginModal() {
		is_login_modal_open.value = true;
	}

	function itemMeta(sizeLabel: string, qty: number) {
		const size = member_logic.sizeDimOnly(sizeLabel);
		return t('checkout.guest.summary.itemMeta', {
			size,
			qty: qty.toLocaleString(),
		});
	}

	function getAddressTagClass(label: string) {
		const lower_label = label.toLowerCase();
		if (lower_label.includes('office')) return 'checkout-member-address-tag--office';
		if (lower_label.includes('client')) return 'checkout-member-address-tag--client';
		return '';
	}

	return {
		// Member Logic (Base for everything)
		...member_logic,

		// Unified / Overridden state
		is_member,
		email,
		t,
		withCountry,
		completing_checkout,
		complete_loader_ref,
		completeCheckout,
		itemMeta,

		// UI State
		is_login_modal_open,
		email_tooltip_open,
		points_tooltip_open,
		drop_shipping_tooltip_open,
		billing_tooltip_open,
		is_shipping_address_modal_open,
		is_billing_address_modal_open,
		is_drop_shipping_address_modal_open,
		is_accredited_banks_modal_open,

		// UI Methods
		openLoginModal,
		togglePointsTooltip,
		toggleDropShippingTooltip,
		toggleBillingTooltip,
		toggleEmailTooltip,
		getAddressTagClass,

		// Unified Data
		shipping_method_details,
		field_validation_by_key,

		// Unified Payment Brands (Filtered: Member brands only)
		payment_brands: checkoutMemberPaymentBrands,
	};
}