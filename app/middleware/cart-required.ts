import { DEFAULT_COUNTRY, resolveSupportedCountry } from '~/constants/countries';
import { useCartStore } from '~/stores/core/cart/cart.store';

export default defineNuxtRouteMiddleware((to) => {
	if (!import.meta.client) return;

	const cart = useCartStore();
	const has_items = cart.items.length > 0;
	const has_selected = (cart.selected_real_ids?.length ?? 0) > 0;

	if (has_items && has_selected) return;

	const country = resolveSupportedCountry(String(to.params.country || DEFAULT_COUNTRY)) || DEFAULT_COUNTRY;
	window.location.href = `/${country}/cart`;
	return abortNavigation();
});