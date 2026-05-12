import { useMainCheckOutStore } from '~/stores/checkout/index.store'

export default defineNuxtRouteMiddleware((to, from) => {
	const is_leaving_checkout = from.path.includes('/checkout') && !to.path.includes('/checkout')
	if (!is_leaving_checkout) return

	useMainCheckOutStore().cleanCheckoutStates()
})