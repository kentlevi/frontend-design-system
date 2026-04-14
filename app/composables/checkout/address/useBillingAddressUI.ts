import { useCheckoutExperienceFeatureContext } from "../checkoutExperienceFeatureContext";
import { useCheckoutFeatureTransition } from "../features/useCheckoutFeatureTransition";
import { useHeightTransition } from "../shared/useHeightTransition";

export function useBillingAddressUI() {


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

	const {
		t,
		is_member,
		use_shipping_as_billing,
		selected_billing_address,
		billing_use_different_address,
		billing_tooltip_open,
		getAddressTagClass,
		is_billing_address_modal_open,
		toggleBillingTooltip,
	} = useCheckoutExperienceFeatureContext();

	const billing_swap_wrapper_ref = ref<HTMLElement | null>(null);
	const billing_mode_swap_wrapper_ref = ref<HTMLElement | null>(null);

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
		t,
		beforeEnter,
		enter,
		afterEnter,
		beforeLeave,
		leave,
		afterLeave,
		is_member,
		selected_billing_address,
		billing_use_different_address,
		use_shipping_as_billing,
		billing_tooltip_open,
		is_billing_address_modal_open,
		getAddressTagClass,
		toggleBillingTooltip,
	}
}