import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useCheckoutExperienceFeatureContext } from "../checkoutExperienceFeatureContext";
import { useCheckoutFeatureTransition } from "../features/useCheckoutFeatureTransition";
import { useDismissibleTooltip } from "../features/useDismissibleTooltip";
import { useHeightTransition } from "../shared/useHeightTransition";
import { useUserAddressDataCheckoutContext } from "./context/addressBookListCheckoutContext";
import { useAddressGeneralUIContext } from "./context/addressGeneralUICheckoutContext";

export function useBillingAddressUI() {

	/**
     * Stores
     */
	const main_checkout_store = useMainCheckOutStore()
	const { use_shipping_as_billing, billing_use_different_address } = storeToRefs(main_checkout_store)


	/** Contexts */
	const { is_member } = useCheckoutExperienceFeatureContext();

	const {
		billing_tooltip_open,
		is_billing_address_modal_open,

		toggleBillingTooltip,
		getAddressTagClass
	} = useAddressGeneralUIContext()

	const {	has_billing_addresses } = useUserAddressDataCheckoutContext()

	const {
		enter_duration_ms,
		leave_duration_ms,
		beforeEnter,
		enter,
		afterEnter,
		beforeLeave,
		leave,
		afterLeave,
	} = useCheckoutFeatureTransition();





	const { t: translate } = useI18n()

	const billing_swap_wrapper_ref = ref<HTMLElement | null>(null);
	const billing_mode_swap_wrapper_ref = ref<HTMLElement | null>(null);
	const billing_tooltip_ref = ref<HTMLElement | null>(null);

	useDismissibleTooltip(billing_tooltip_ref, billing_tooltip_open);

	useHeightTransition(
		billing_swap_wrapper_ref,
		use_shipping_as_billing,
		() => use_shipping_as_billing.value ? null : '[data-billing-panel="content"]',
		{ enterDurationMs: enter_duration_ms, leaveDurationMs: leave_duration_ms }
	);

	useHeightTransition(
		billing_mode_swap_wrapper_ref,
		billing_use_different_address,
		() =>
			billing_use_different_address.value
				? '[data-billing-mode-panel="manual-address"]'
				: '[data-billing-mode-panel="saved-address"]',
		{
			enabled: () => !use_shipping_as_billing.value,
			enterDurationMs: enter_duration_ms,
			leaveDurationMs: leave_duration_ms,
		}
	);

	return {
		translate,
		beforeEnter,
		enter,
		afterEnter,
		beforeLeave,
		leave,
		afterLeave,
		is_member,
		billing_use_different_address,
		use_shipping_as_billing,
		billing_tooltip_open,
		billing_tooltip_ref,
		is_billing_address_modal_open,
		has_billing_addresses,
		getAddressTagClass,
		toggleBillingTooltip,
	}
}