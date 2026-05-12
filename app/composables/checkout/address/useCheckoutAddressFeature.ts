import { useMainCheckOutStore } from "~/stores/checkout/index.store";
import { useCheckoutExperienceFeatureContext } from "../checkoutExperienceFeatureContext";
import { useCheckoutFeatureTransition } from "../features/useCheckoutFeatureTransition";
import { useHeightTransition } from "../shared/useHeightTransition";

export function useCheckoutAddressFeature() {

	/**
     * Stores
     */
	const main_checkout_store = useMainCheckOutStore()
	const { shipping_ship_to_another_address } = storeToRefs(main_checkout_store)


	/**
     * Contexts
     */
	const { is_member } = useCheckoutExperienceFeatureContext();


	/**
     * Helpers
     */
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


	/**
     * Variables
     */
	const shipping_swap_wrapper_ref = ref<HTMLElement | null>(null);
	const getSelector = () =>
		shipping_ship_to_another_address.value
			? '[data-shipping-panel="manual-address"]'
			: '[data-shipping-panel="saved-address"]';
	useHeightTransition(
		shipping_swap_wrapper_ref,
		shipping_ship_to_another_address,
		getSelector,
		{
			enterDurationMs: enter_duration_ms,
			leaveDurationMs: leave_duration_ms
		}
	);


	/**
     * Watchers
     */
	watch(shipping_ship_to_another_address, (val) => {
		if (val) {
			main_checkout_store.setShippingAddressId(null)
		}
	})


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
		shipping_ship_to_another_address,
	}
}