import { ref } from 'vue';

function createToggleableFlag() {
	const state = ref(false);

	function toggle() {
		state.value = !state.value;
	}

	return { state, toggle };
}

export function useCheckoutTooltipState() {
	const email = createToggleableFlag();
	const points = createToggleableFlag();
	const drop_shipping = createToggleableFlag();
	const billing = createToggleableFlag();

	return {
		email_tooltip_open: email.state,
		points_tooltip_open: points.state,
		drop_shipping_tooltip_open: drop_shipping.state,
		billing_tooltip_open: billing.state,
		toggleEmailTooltip: email.toggle,
		togglePointsTooltip: points.toggle,
		toggleDropShippingTooltip: drop_shipping.toggle,
		toggleBillingTooltip: billing.toggle,
	};
}