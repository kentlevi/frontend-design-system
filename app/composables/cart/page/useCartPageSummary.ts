import { useCountry } from '~/composables/app/country/useCountry'
import { useCartService } from '~/services/cart/cart.service'

import { useCartService as useCartCoreService } from '~/services/core/cart/cart.service'

export const useCartPageSummary = () => {
	const { withCountry } = useCountry()
	const cart_service = useCartService('cart-page-summary')

	/** This core service is implemented with real data from API */
	const cart_core_service = useCartCoreService('cart-page-summary')

	const formatPrice = (value: number) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(value)
	}

	const goToCheckout = async () => {
		if (cart_service.selected_ids.value.length === 0) return
		await navigateTo(withCountry('/checkout'))
	}

	return {
		selected_total: cart_core_service.selected_total_cost,
		selected_ids: cart_core_service.selected_ids,
		payment_options: cart_service.payment_options,
		formatPrice,
		goToCheckout,
	}
}