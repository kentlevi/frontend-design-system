// import { useSelectionStore } from '~/stores/product'

export const usePricingService = () => {
	// const { $api } = useNuxtApp()

	// const selectionStore = useSelectionStore()

	const price = ref(0)

	return {
		price
	}
}