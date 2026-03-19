import { useProductService } from "./product.service"
import { usePricingService } from "./pricing.service"
import { useQuantityService } from "./quantity.service"
import { useSizeService } from "./size.service"
import { useSelectionStore } from "~/stores/product"

export const useQuoteSectionService = () => {
	const selectionStore = useSelectionStore()

	const productService  	= useProductService()

	const sizesService 		= useSizeService()

	const quantityService 	= useQuantityService()

	const pricingService 	= usePricingService()

	function recentSelection(prod_str: string) {
		return selectionStore.hasSelection(prod_str)
	}

	return {
		...productService,
		...sizesService,
		...quantityService,
		...pricingService,

		recentSelection,
	}
}