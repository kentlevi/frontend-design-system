import { useProductService } from "./product.service"
import { usePricingService } from "./pricing.service"
import { useQuantityService } from "./quantity.service"
import { useSizeService } from "./size.service"
import { useAttributesStore, useSelectionStore } from "~/stores/product"
import { useColorService } from "./color.service"
import { useLetteringService } from "./lettering.service"
import { useFontService } from "./font.service"

export const useQuoteSectionService = () => {

	const attributeStore 	= useAttributesStore()

	const selectionStore 	= useSelectionStore()

	const productService  	= useProductService()

	const sizesService 		= useSizeService()

	const quantityService 	= useQuantityService()

	const pricingService 	= usePricingService()

	const colorService 		= useColorService()

	const letteringService 	= useLetteringService()

	const fontService = useFontService()

	const size_featured_cards = computed(() => attributeStore.size_featured_cards )


	const clearSelection = () => {
		selectionStore.clearSelection()
	}

	const recentSelection = () => {
		if( !productService.slug.value )
			return

		return selectionStore.hasSelection(productService.slug.value)
	}

	const has_lettering_editor = computed(() =>
		attributeStore.active_lettering_editor.includes(
			productService.slug
			&& productService.slug.value
				? productService.slug.value
				: ''
		)
	)

	const has_color_selection = computed(() =>
		attributeStore.product_w_color.includes(
			productService.slug
			&& productService.slug.value
				? productService.slug.value
				: ''
		)
	)

	const has_font_selection = computed(() =>
		attributeStore.product_w_font.includes(
			productService.slug
			&& productService.slug.value
				? productService.slug.value
				: ''
		)
	)


	return {
		...productService,
		...sizesService,
		...quantityService,
		...pricingService,
		...colorService,
		...letteringService,
		...fontService,
		clearSelection,
		recentSelection,
		has_color_selection,
		has_font_selection,
		has_lettering_editor,
		size_featured_cards,
	}
}