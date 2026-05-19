import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCountry } from '~/composables/app/country/useCountry';
import { useUsersStore } from '~/stores/users/users.store';
import { useMainCheckOutStore } from '~/stores/checkout/index.store';
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
	const checkout_store = useMainCheckOutStore();
	const { guest_contact_state } = storeToRefs(checkout_store)

	// Use Member logic as the primary base for both guest and member
	const member_logic = useCheckoutMember();

	const { completing_checkout, complete_loader_ref, completeCheckout } = useCheckoutCompletion({
		...member_logic,
		redirectPath: withCountry('/checkout/success')
	});

	const is_member = computed(() => user_store.state.id !== 0);

	const can_use_rewards = computed(() => user_store.state.role?.code === 'MEMBER')

	const email = computed({
		get: () =>
			is_member.value
				? member_logic.member_email.value
				: guest_contact_state.value.email,
		set: (val) => {
			if (!is_member.value) {
				checkout_store.patchGuestContactState({
					email: val,
				})
			}
		}
	});

	const is_login_modal_open = ref(false);
	const {
		email_tooltip_open,
		points_tooltip_open,
		toggleEmailTooltip,
		togglePointsTooltip,
	} = useCheckoutTooltipState();

	// Modal States expected by the template
	const is_accredited_banks_modal_open = ref(false);
	const is_coupons_modal_open = ref(false);

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

	return {
		// Member Logic (Base for everything)
		...member_logic,

		// Unified / Overridden state
		is_member,
		can_use_rewards,
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
		is_accredited_banks_modal_open,
		is_coupons_modal_open,

		// UI Methods
		openLoginModal,
		togglePointsTooltip,
		toggleEmailTooltip,

		// Unified Data
		field_validation_by_key,

		// Unified Payment Brands (Filtered: Member brands only)
		payment_brands: checkoutMemberPaymentBrands,
	};
}