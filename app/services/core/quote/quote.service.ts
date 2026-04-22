import { useAttributesStore, useSelectionStore } from "~/stores/product";
import type { FeaturedDataResponse, FontSpec } from "~/types/products/attributes";
import { useCartService } from "../cart/cart.service";

export const useQuoteService = (_caller : string) => {
	const attribute_store = useAttributesStore()

	const selection_store = useSelectionStore()

	const cart_service = useCartService('quote-service')

	const has_lettering_editor = computed(() => {
		if( !selection_store.url_slug )
			return false

		return attribute_store.active_lettering_editor.includes(selection_store.url_slug)
	})

	const has_font_selection = computed(() => {
		if( !selection_store.url_slug )
			return false

		return attribute_store.product_w_font.includes(selection_store.url_slug)
	})

	const has_color_selection = computed(() => {
		if( !selection_store.url_slug )
			return false

		return attribute_store.product_w_color.includes(selection_store.url_slug)
	})

	const recent_selection = computed(() => {
		if( !selection_store.url_slug )
			return null

		return selection_store.hasSelection(selection_store.url_slug)
	})

	const isLoadingFeatures = (value : boolean) => {
		selection_store.updateLoadingFeaturesFlag(value)
	}

	const assignFeaturedData = async (f_data : FeaturedDataResponse) => {

		selection_store.updateMappingID(f_data.product.pcm_id)

		selection_store.updateProductSlug(f_data.product.url_slug)

		attribute_store.updateProduct({
			url_slug: f_data.product.url_slug,
			name: f_data.product.name,
			description: f_data.product.description,
			image: f_data.product.image
		})

		attribute_store.updateSizes(f_data.featured_sizes)

		attribute_store.updateColors(f_data.variants.colors)

		const f = f_data.variants.fonts.map(font => ({
			id: font.id,
			label: font.name,
			value: font.name,
			code: font.code,
			style: font.style
		})) as FontSpec[]

		attribute_store.updateFonts(f)
	}

	return {
		// 🔥 Store
		...storeToRefs(attribute_store),
		...storeToRefs(selection_store),

		// 🔥 Local States
		has_lettering_editor,
		has_font_selection,
		has_color_selection,
		recent_selection,

		// 🔥 Methods
		assignFeaturedData,
		isLoadingFeatures,
		updateNavigationFlight : selection_store.updateNavigationFlight,
		resetAllSelection: selection_store.reset,
		dispatchItem : cart_service.addItem,
	}
}