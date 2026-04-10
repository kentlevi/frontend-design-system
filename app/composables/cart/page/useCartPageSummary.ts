import { useCountry } from '~/composables/app/country/useCountry'
import { useCartService } from '~/services/cart/cart.service'

export const useCartPageSummary = () => {
	const { withCountry } = useCountry()
	const cart_service = useCartService('cart-page-summary')

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
		selected_total: cart_service.selected_total,
		selected_ids: cart_service.selected_ids,
		payment_options: cart_service.payment_options,
		formatPrice,
		goToCheckout,
	}
}