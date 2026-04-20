import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useCheckoutExperienceFeatureContext } from "../checkoutExperienceFeatureContext";
import { useCheckoutFeatureTransition } from "../features/useCheckoutFeatureTransition";
import { useHeightTransition } from "../shared/useHeightTransition";

export function useCheckoutAddressFeature() {

	/** Store */
	const {
		ship_to_another_address,
	} = storeToRefs(useMainCheckOutStore())

	/** Contexts */
	const { is_member } = useCheckoutExperienceFeatureContext();


	const { t: translate } = useI18n()

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

	const shipping_swap_wrapper_ref = ref<HTMLElement | null>(null);

	const getSelector = () =>
		ship_to_another_address.value
			? '[data-shipping-panel="manual-address"]'
			: '[data-shipping-panel="saved-address"]';

	useHeightTransition(
		shipping_swap_wrapper_ref,
		ship_to_another_address,
		getSelector,
		{
			enterDurationMs: enter_duration_ms,
			leaveDurationMs: leave_duration_ms
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

		shipping_swap_wrapper_ref,
		ship_to_another_address,
	}
}