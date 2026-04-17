import { useCheckoutExperienceFeatureContext } from "../checkoutExperienceFeatureContext";
import { useCheckoutFeatureTransition } from "../features/useCheckoutFeatureTransition";
import { useDismissibleTooltip } from "../features/useDismissibleTooltip";
import { useHeightTransition } from "../shared/useHeightTransition";
import { useAddressGeneralUICheckoutContext } from "./context/addressGeneralUICheckoutContext";

export function useDropShippingAddressUI() {

	/** Contexts */
	const {
		is_member,
	} = useCheckoutExperienceFeatureContext();

	const {
		drop_shipping_tooltip_open,
		drop_shipping_enabled,

		toggleDropShippingTooltip,
		getAddressTagClass
	} = useAddressGeneralUICheckoutContext()



	const { t: translate } = useI18n();

	const {
		enter_duration_ms,
		leave_duration_ms,
	} = useCheckoutFeatureTransition();

	const drop_shipping_ship_to_another_address = ref(false);

	// refs (used)
	const drop_shipping_swap_wrapper_ref = ref<HTMLElement | null>(null);
	const drop_shipping_mode_swap_wrapper_ref = ref<HTMLElement | null>(null);
	const drop_shipping_tooltip_ref = ref<HTMLElement | null>(null);

	// tooltip
	useDismissibleTooltip(drop_shipping_tooltip_ref, drop_shipping_tooltip_open);

	// stable selector functions (prevents recreation per render)
	const getDropShippingSelector = () =>
		drop_shipping_enabled.value ? '[data-drop-shipping-panel="form"]' : null;

	const getDropShippingModeSelector = () =>
		drop_shipping_ship_to_another_address.value
			? '[data-drop-shipping-mode-panel="another-address"]'
			: '[data-drop-shipping-mode-panel="saved-address"]';

	// transitions
	useHeightTransition(
		drop_shipping_swap_wrapper_ref,
		drop_shipping_enabled,
		getDropShippingSelector,
		{ enterDurationMs: enter_duration_ms, leaveDurationMs: leave_duration_ms }
	);

	useHeightTransition(
		drop_shipping_mode_swap_wrapper_ref,
		drop_shipping_ship_to_another_address,
		getDropShippingModeSelector,
		{
			enabled: () => drop_shipping_enabled.value,
			enterDurationMs: enter_duration_ms,
			leaveDurationMs: leave_duration_ms
		}
	);

	return {
		translate,
		is_member,
		drop_shipping_enabled,
		drop_shipping_ship_to_another_address,
		drop_shipping_tooltip_open,
		drop_shipping_mode_swap_wrapper_ref,

		getAddressTagClass,
		toggleDropShippingTooltip,
	}
}