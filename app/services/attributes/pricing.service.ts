// import { useSelectionStore } from '~/stores/product'

export const usePricingService = () => {
	// const { $api } = useNuxtApp()

	// const selectionStore = useSelectionStore()

	const shipping_fee = ref(0)

	const disc_percentage = ref(0)

	const standard_price = ref(23.98)

	const price = ref(22.54)

	return {
		shipping_fee,
		disc_percentage,
		standard_price,
		price,
	}
}