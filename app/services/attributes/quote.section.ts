import { useProductService } from "./product.service"
import { usePricingService } from "./pricing.service"
import { useQuantityService } from "./quantity.service"
import { useSizeService } from "./size.service"
import { useAttributesStore, useSelectionStore } from "~/stores/product"
import { useColorService } from "./color.service"
import { useLetteringService } from "./lettering.service"
import { useFontService } from "./font.service"

export const useQuoteSectionService = () => {

	const attribute_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const product_service = useProductService()

	const sizes_service = useSizeService()

	const quantity_service = useQuantityService()

	const pricing_service = usePricingService()

	const color_service = useColorService()

	const lettering_service = useLetteringService()

	const font_service = useFontService()

	const size_featured_cards = computed(() => attribute_store.sizes )


	const clearSelection = () => {
		selection_store.clearSelection()
	}

	const recentSelection = (slug: string) => {

		return selection_store.hasSelection(slug)
	}

	const has_lettering_editor = computed(() =>
		attribute_store.active_lettering_editor.includes(
			product_service.url_slug
			&& product_service.url_slug.value
				? product_service.url_slug.value
				: ''
		)
	)

	const has_color_selection = computed(() =>
		attribute_store.product_w_color.includes(
			product_service.url_slug
			&& product_service.url_slug.value
				? product_service.url_slug.value
				: ''
		)
	)

	const has_font_selection = computed(() =>
		attribute_store.product_w_font.includes(
			product_service.url_slug
			&& product_service.url_slug.value
				? product_service.url_slug.value
				: ''
		)
	)

	const updateSelectedSlug = (prod_slug: string) => {
		selection_store.updateProductSlug(prod_slug)
	}


	return {
		...product_service,
		...sizes_service,
		...quantity_service,
		...pricing_service,
		...color_service,
		...lettering_service,
		...font_service,
		clearSelection,
		recentSelection,
		updateSelectedSlug,
		has_color_selection,
		has_font_selection,
		has_lettering_editor,
		size_featured_cards,
	}
}